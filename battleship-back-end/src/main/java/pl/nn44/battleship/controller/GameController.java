package pl.nn44.battleship.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import pl.nn44.battleship.gamerules.GameRules;
import pl.nn44.battleship.model.*;
import pl.nn44.battleship.service.locker.Locker;
import pl.nn44.battleship.service.serializer.Serializer;
import pl.nn44.battleship.service.verifier.FleetVerifier;
import pl.nn44.battleship.util.id.IdGenerator;
import pl.nn44.battleship.util.other.Strings;

import javax.annotation.Nonnull;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.function.BiConsumer;

public class GameController extends TextWebSocketHandler {

  private static final Logger LOGGER = LoggerFactory.getLogger(GameController.class);

  private final ConcurrentMap<WebSocketSession, Player> players = new ConcurrentHashMap<>();
  private final ConcurrentMap<String, Game> games = new ConcurrentHashMap<>();
  private final GameRules gameRules;
  private final Random random;
  private final Locker locker;
  private final IdGenerator idGenerator;
  private final FleetVerifier fleetVerifier;
  private final Serializer<Grid, String> gridSerializer;
  private final Serializer<Coord, String> coordSerializer;
  private final Serializer<List<Cell>, String> cellSerializer;
  private final Map<String, BiConsumer<Player, String>> commands =
      Map.ofEntries(
          Map.entry("GAME", this::game),
          Map.entry("GRID", this::grid),
          Map.entry("SHOT", this::shot),
          Map.entry("PING", this::ping)
      );

  public GameController(GameRules gameRules,
                        Random random,
                        Locker locker,
                        IdGenerator idGenerator,
                        FleetVerifier fleetVerifier,
                        Serializer<Grid, String> gridSerializer,
                        Serializer<Coord, String> coordSerializer,
                        Serializer<List<Cell>, String> cellSerializer) {
    this.gameRules = gameRules;
    this.random = random;
    this.locker = locker;
    this.idGenerator = idGenerator;
    this.fleetVerifier = fleetVerifier;
    this.gridSerializer = gridSerializer;
    this.coordSerializer = coordSerializer;
    this.cellSerializer = cellSerializer;

    if (LOGGER.isDebugEnabled()) {
      Executors.newSingleThreadScheduledExecutor().scheduleAtFixedRate(() -> {
        LOGGER.error("players.size=" + players.size());
        LOGGER.error("games.size=" + games.size());
      }, 0, 30, TimeUnit.SECONDS);
    }
  }

  private String id(WebSocketSession session) {
    return String.format("%1$8s", session.getId()).replace(' ', '0');
  }

  private void txt(Player player, String format, Object... args) {
    txt(player.getSession(), format, args);
  }

  private void txt(WebSocketSession session, String format, Object... args) {
    String msg = String.format(format, args);
    LOGGER.info("->  {} @ {}", id(session), msg);

    try {
      TextMessage textMessage = new TextMessage(msg);
      session.sendMessage(textMessage);
    } catch (IOException e) {
      LOGGER.warn("<-> server to user _fail_");
      LOGGER.warn("->  {} @ {}", id(session), msg);
      LOGGER.warn("<-> exception stack", e);
    }
  }

  private void broadcast(String format, Object... args) {
    String msg = String.format(format, args);
    LOGGER.info("->  {} @ {}", "______bc", msg);

    TextMessage textMessage = new TextMessage(msg);
    players.forEach((s, p) -> {
      try {
        s.sendMessage(textMessage);
      } catch (IOException ignored) {
      }
    });
  }

  @Override
  public void afterConnectionEstablished(@Nonnull WebSocketSession session) {
    LOGGER.info("<-> {} @ established {}", id(session), session.getRemoteAddress());
    txt(session, "HI_. Welcome.");
  }

  @Override
  public void afterConnectionClosed(@Nonnull WebSocketSession session, @Nonnull CloseStatus status) {
    LOGGER.info("<-> {} @ closed @ {}", id(session), status);
    Player player = players.get(session);
    Locker.Sync lock = locker.lock(player);

    try {
      if (player == null) {
        return;
      }

      players.remove(session);
      broadcast("STAT players=%s", players.size());

      Game game = player.getGame();
      if (game == null) {
        return;
      }

      Player secondPlayer = game.secondPlayer(player);
      game.removePlayer(player);

      if (secondPlayer != null) {
        boolean gameInterrupted
            = game.getState() == Game.State.IN_PROGRESS;

        txt(secondPlayer, "1PLA %s",
            gameInterrupted
                ? "game-interrupted"
                : "game-not-interrupted");

        if (gameInterrupted) {
          game.nextGame();
        }

      } else {
        games.remove(game.getId());
      }
    } finally {
      lock.unlock();
    }
  }

  @Override
  protected void handleTextMessage(WebSocketSession session, TextMessage message) {
    String payload = message.getPayload();
    int endOfCommandIndex = payload.indexOf(' ');
    if (endOfCommandIndex == -1) {
      endOfCommandIndex = payload.length();
    }
    String command = Strings.safeSubstring(payload, 0, endOfCommandIndex);
    String param = Strings.safeSubstring(payload, endOfCommandIndex + 1);

    LOGGER.info("<-  {} @ {}", session.getId(), message.getPayload());

    Player player = players
        .computeIfAbsent(session, Player::new);

    Locker.Sync lock = locker.lock(player);

    try {
      commands
          .getOrDefault(command, this::other)
          .accept(player, param);
    } finally {
      lock.unlock();
    }
  }

  private void game(Player player, String param) {
    Locker.Sync lockGame = null;

    try {
      if (player.getGame() != null) {
        txt(player, "400_ you-are-in-game");

      } else if (param.equals("NEW")) {
        Game game = new Game(idGenerator, player);
        game.cloneRules(gameRules);
        player.setGame(game);
        games.put(game.getId(), game);
        txt(player, "GAME OK %s", game.getId());
        broadcast("STAT players=%d", players.size());

      } else {
        Game game = games.get(param);
        lockGame = locker.lock(game);

        if (game == null) {
          txt(player, "GAME FAIL no-such-game");

        } else if (!game.setPlayerAtFreeSlot(player)) {
          txt(player, "GAME FAIL no-free-slot");

        } else {
          player.setGame(game);
          txt(player, "GAME OK %s", game.getId());
          txt(game.getPlayer(0), "2PLA");
          txt(game.getPlayer(1), "2PLA");
          broadcast("STAT players=%d", players.size());
        }
      }

    } finally {
      if (lockGame != null) {
        lockGame.unlock();
      }
    }
  }

  private void grid(Player player, String param) {
    Game game = player.getGame();

    if (game == null) {
      txt(player, "400_ no-game-set");

    } else if (game.getState() == Game.State.IN_PROGRESS) {
      txt(player, "400_ game-in-progress");

    } else if (player.getGrid() != null) {
      txt(player, "400_ grid-already-set");

    } else {
      Optional<Grid> grid = gridSerializer.deserialize(param);

      if (grid.isEmpty()) {
        txt(player, "GRID FAIL");

      } else if (!fleetVerifier.verify(grid.get())) {
        txt(player, "GRID FAIL");

      } else {
        player.setGrid(grid.get());
        txt(player, "GRID OK");

        if (game.bothGridSets()) {
          game.setState(Game.State.IN_PROGRESS);
          game.prepareShootGrids();
          game.nextTour(random);

          txt(game.getPlayer(0), "TOUR START");
          txt(game.getPlayer(1), "TOUR START");
          txt(game.getTourPlayer(), "TOUR YOU");
          txt(game.getNotTourPlayer(), "TOUR HE");
        }
      }
    }

  }

  private void shot(Player player, String param) {
    Game game = player.getGame();

    if (game == null) {
      txt(player, "400_ no-game-set");

    } else if (game.getState() == Game.State.WAITING) {
      txt(player, "400_ game-waiting");

    } else if (game.getNotTourPlayer().equals(player)) {
      txt(player, "400_ not-your-tour");

    } else {
      Optional<Coord> coord = coordSerializer.deserialize(param);

      if (coord.isEmpty()) {
        txt(player, "400_ bad-shoot");

      } else {
        Player tourPlayer = game.getTourPlayer();
        List<Cell> shoot = tourPlayer.getShootGrid().shoot(coord.get());
        String shootSerial = cellSerializer.serialize(shoot);

        txt(tourPlayer, "YOU_ %s", shootSerial);
        txt(game.getNotTourPlayer(), "HE__ %s", shootSerial);

        if (game.completed()) {
          txt(tourPlayer, "WON_ YOU");
          txt(game.getNotTourPlayer(), "WON_ HE");
          game.nextGame();

        } else {
          boolean goodShoot = shoot.stream()
              .anyMatch(s -> s.getType() == Cell.Type.SHIP || s.getType() == Cell.Type.SHIP_SUNK);
          if (!goodShoot) {
            game.nextTour();
          }

          txt(game.getTourPlayer(), "TOUR YOU");
          txt(game.getNotTourPlayer(), "TOUR HE");
        }
      }
    }
  }

  private void ping(Player player, String param) {
    txt(player, "PONG %s", param);
  }

  private void other(Player player, String payload) {
    txt(player, "400_ unknown-command");
  }
}
