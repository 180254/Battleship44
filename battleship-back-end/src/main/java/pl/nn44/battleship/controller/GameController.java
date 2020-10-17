package pl.nn44.battleship.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import pl.nn44.battleship.gamerules.FleetMode;
import pl.nn44.battleship.gamerules.FleetSizes;
import pl.nn44.battleship.gamerules.GameRules;
import pl.nn44.battleship.model.*;
import pl.nn44.battleship.service.*;
import pl.nn44.battleship.util.IdGenerator;
import pl.nn44.battleship.util.Strings;

import javax.annotation.Nonnull;
import java.io.IOException;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.function.BiConsumer;

public class GameController extends TextWebSocketHandler {

  private static final Logger LOGGER = LoggerFactory.getLogger(GameController.class);

  private final ConcurrentMap<WebSocketSession, Player> players = new ConcurrentHashMap<>();
  private final ConcurrentMap<String, Game> games = new ConcurrentHashMap<>();

  private final GameRules gameRules;
  private final Random random;
  private final Locker locker;
  private final IdGenerator idGenerator;
  private final MetricsService metricsService;
  private final Serializer<Grid, String> gridSerializer;
  private final Serializer<Coord, String> coordSerializer;
  private final Serializer<List<Cell>, String> cellSerializer;

  private final Map<String, BiConsumer<Player, String>> commands =
      Map.ofEntries(
          Map.entry("GAME", this::game),
          Map.entry("GAME-RULES", this::gameRules),
          Map.entry("GRID", this::grid),
          Map.entry("SHOT", this::shot),
          Map.entry("PING", this::ping)
      );

  public GameController(GameRules gameRules,
                        Random random,
                        Locker locker,
                        IdGenerator idGenerator,
                        MetricsService metricsService,
                        Serializer<Grid, String> gridSerializer,
                        Serializer<Coord, String> coordSerializer,
                        Serializer<List<Cell>, String> cellSerializer) {
    this.gameRules = gameRules;
    this.random = random;
    this.locker = locker;
    this.idGenerator = idGenerator;
    this.metricsService = metricsService;
    this.gridSerializer = gridSerializer;
    this.coordSerializer = coordSerializer;
    this.cellSerializer = cellSerializer;

    this.metricsService.registerDeliverable("players.currentSize", players::size);
    this.metricsService.registerDeliverable("games.currentSize", games::size);
  }

  private String sessionId(WebSocketSession session) {
    return String.format("%1$8s", session.getId()).replace(' ', '0');
  }

  private void send(Player player, String format, Object... args) {
    send(player.getSession(), format, args);
  }

  private void send(WebSocketSession session, String format, Object... args) {
    String msg = String.format(format, args);
    LOGGER.info("->  {} @ {}", sessionId(session), msg);

    try {
      TextMessage textMessage = new TextMessage(msg);
      session.sendMessage(textMessage);
    } catch (IOException e) {
      LOGGER.warn("<-> sending message to user failed");
      LOGGER.warn("->  {} @ {}", sessionId(session), msg);
      LOGGER.warn("<-> exception stack", e);
    }
  }

  private void broadcast(String format, Object... args) {
    String msg = String.format(format, args);
    LOGGER.info("->  {} @ {}", "______bc", msg);

    TextMessage textMessage = new TextMessage(msg);
    players.forEach((session, player) -> {
      try {
        session.sendMessage(textMessage);
      } catch (IOException ignored) {
      }
    });
  }

  @Override
  public void afterConnectionEstablished(@Nonnull WebSocketSession session) {
    InetSocketAddress clientSocketAddress = session.getRemoteAddress();
    LOGGER.info("<-> {} @ established {}", sessionId(session), clientSocketAddress);
    send(session, "HI_. Welcome.");

    InetAddress clientAddress = (clientSocketAddress != null)
        ? clientSocketAddress.getAddress()
        : null;
    metricsService.maybeUnique("players.uniqueSoFar", clientAddress);
  }

  @Override
  public void afterConnectionClosed(@Nonnull WebSocketSession session, @Nonnull CloseStatus status) {
    LOGGER.info("<-> {} @ closed @ {}", sessionId(session), status);
    Player player = players.get(session);
    Locker.Unlocker lock = locker.lock(player);

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

        send(secondPlayer, "1PLA %s",
            gameInterrupted ? "game-interrupted" : "game-not-interrupted");

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
  protected void handleTextMessage(@Nonnull WebSocketSession session, TextMessage message) {
    String payload = message.getPayload();
    int endOfCommandIndex = Strings.indexOf(payload, ' ', payload.length());
    String command = Strings.safeSubstring(payload, 0, endOfCommandIndex);
    String param = Strings.safeSubstring(payload, endOfCommandIndex + 1);

    LOGGER.info("<-  {} @ {}", session.getId(), message.getPayload());

    Player player = players.computeIfAbsent(session, Player::new);
    Locker.Unlocker lock = locker.lock(player);

    try {
      commands
          .getOrDefault(command, this::other)
          .accept(player, param);
    } finally {
      lock.unlock();
    }
  }

  private void game(Player player, String param) {
    Locker.Unlocker lockGame = null;

    try {
      if (player.getGame() != null) {
        send(player, "400_ you-are-in-game");

      } else if (param.equals("NEW")) {
        Game game = new Game(idGenerator, player);
        game.cloneGameRules(gameRules);
        player.setGame(game);
        games.put(game.getId(), game);
        send(player, "GAME OK %s", game.getId());
        send(player, "GAME-RULES %s", game.getGameRules().describe());
        broadcast("STAT players=%d", players.size());
        metricsService.increment("games.totalCreated");

      } else {
        Game game = games.get(param);
        lockGame = locker.lock(game);

        if (game == null) {
          send(player, "GAME FAIL no-such-game");

        } else if (!game.setPlayerAtFreeSlot(player)) {
          send(player, "GAME FAIL no-free-slot");

        } else {
          player.setGame(game);
          send(player, "GAME OK %s", game.getId());
          send(player, "GAME-RULES %s", game.getGameRules().describe());
          send(game.getPlayer(0), "2PLA");
          send(game.getPlayer(1), "2PLA");
          broadcast("STAT players=%d", players.size());
        }
      }

    } finally {
      if (lockGame != null) {
        lockGame.unlock();
      }
    }
  }

  private void gameRules(Player player, String param) {
    Locker.Unlocker lockGame = null;
    try {
      if (player.getGame() == null) {
        send(player, "400_ no-game-set");

      } else if (param.startsWith("CHANGE ")) {
        Game game = player.getGame();
        lockGame = locker.lock(game);

        if(game.allPlayerSlotsUsed()) {
          send(player, "400_ 2pla-in-game");
          return;
        }

        if (game.getState() == Game.State.IN_PROGRESS) {
          send(player, "400_ game-in-progress");
          return;
        }

        String[] gameRulesChange = param.substring("CHANGE ".length()).split("=", 2);
        if (gameRulesChange.length != 1 && gameRulesChange.length != 2) {
          send(player, "400_ game-rules-invalid-change");
          return;
        }
        GameRules gameRules = game.getGameRules();

        if (gameRulesChange.length == 1) {
          String changeKey = gameRulesChange[0];

          switch (changeKey) {
            case "fleet-mode": {
              List<FleetMode> fleetModes = Arrays.asList(FleetMode.values());
              int currentIndex = fleetModes.indexOf(gameRules.getFleetMode());
              int nextIndex = (currentIndex + 1) % fleetModes.size();
              FleetMode nextFleetMode = fleetModes.get(nextIndex);
              gameRules.setFleetMode(nextFleetMode);
              send(player, "GAME-RULES fleet-mode=%s", nextFleetMode);
              break;
            }

            case "fleet-sizes": {
              List<FleetSizes> fleetSizes = Arrays.asList(FleetSizes.values());
              int currentIndex = fleetSizes.indexOf(gameRules.getFleetSizes());
              int nextIndex = (currentIndex + 1) % fleetSizes.size();
              FleetSizes nextFleetMode = fleetSizes.get(nextIndex);
              gameRules.setFleetSizes(nextFleetMode);
              send(player, "GAME-RULES fleet-sizes=%s", nextFleetMode);
              break;
            }

            case "fleet-can-touch-each-other-diagonally": {
              boolean fleetCanTouchEachOtherDiagonally = gameRules.isFleetCanTouchEachOtherDiagonally();
              gameRules.setFleetCanTouchEachOtherDiagonally(!fleetCanTouchEachOtherDiagonally);
              send(player, "GAME-RULES fleet-can-touch-each-other-diagonally=%s", !fleetCanTouchEachOtherDiagonally);
              break;
            }

            case "show-fields-for-sure-empty": {
              boolean showFieldsForSureEmpty = gameRules.isShowFieldsForSureEmpty();
              gameRules.setShowFieldsForSureEmpty(!showFieldsForSureEmpty);
              send(player, "GAME-RULES show-fields-for-sure-empty=%s", !showFieldsForSureEmpty);
              break;
            }

            default: {
              send(player, "400_ game-rules-invalid-change");
            }
          }

        } else {
          String changeKey = gameRulesChange[0];
          String changeValue = gameRulesChange[1];

          outerSwitch:
          switch (changeKey) {
            case "fleet-mode": {
              for (FleetMode fleetMode : FleetMode.values()) {
                if (fleetMode.name().equalsIgnoreCase(changeValue)) {
                  gameRules.setFleetMode(fleetMode);
                  send(player, "GAME-RULES fleet-mode=%s", fleetMode);
                  break outerSwitch;
                }
              }
              send(player, "400_ game-rules-invalid-change");
              break;
            }

            case "fleet-sizes": {
              for (FleetSizes fleetSizes : FleetSizes.values()) {
                if (fleetSizes.name().equalsIgnoreCase(changeValue)) {
                  gameRules.setFleetSizes(fleetSizes);
                  send(player, "GAME-RULES fleet-sizes=%s", fleetSizes);
                  break outerSwitch;
                }
              }
              send(player, "400_ game-rules-invalid-change");
              break;
            }

            case "fleet-can-touch-each-other-diagonally": {
              boolean boolChangeValue = Boolean.parseBoolean(changeValue);
              gameRules.setFleetCanTouchEachOtherDiagonally(boolChangeValue);
              send(player, "GAME-RULES fleet-can-touch-each-other-diagonally=%s",
                  gameRules.isFleetCanTouchEachOtherDiagonally());
              break;
            }

            case "show-fields-for-sure-empty": {
              boolean boolChangeValue = Boolean.parseBoolean(changeValue);
              gameRules.setShowFieldsForSureEmpty(boolChangeValue);
              send(player, "GAME-RULES show-fields-for-sure-empty=%s",
                  gameRules.isShowFieldsForSureEmpty());
              break;
            }

            default: {
              send(player, "400_ game-rules-invalid-change");
            }
          }
        }

      }
    } finally {
      if (lockGame != null) {
        lockGame.unlock();
      }
    }
  }

  private void grid(Player player, String param) {
    Locker.Unlocker lockGame = null;

    try {
      Game game = player.getGame();
      lockGame = locker.lock(game);

      if (game == null) {
        send(player, "400_ no-game-set");

      } else if (game.getState() == Game.State.IN_PROGRESS) {
        send(player, "400_ game-in-progress");

      } else if (player.getGrid() != null) {
        send(player, "400_ grid-already-set");

      } else if (param.equals("RANDOM")) {
        new MonteCarloFleet(game.getGameRules(), random, metricsService).maybeRandomFleet().whenComplete((grid, throwable) -> {
          if (grid != null && throwable == null) {
            send(player, "GRID RANDOM %s", gridSerializer.serialize(grid));
          }
        });

      } else {
        Optional<Grid> grid = gridSerializer.deserialize(param);

        if (grid.isEmpty()) {
          send(player, "GRID FAIL");

        } else if (!FleetVerifierFactory.forRules(game.getGameRules()).verify(grid.get())) {
          send(player, "GRID FAIL");

        } else {
          player.setGrid(grid.get());
          send(player, "GRID OK");

          if (game.bothGridSets()) {
            game.setState(Game.State.IN_PROGRESS);
            game.prepareShootGrids();
            game.nextTour(random);

            send(game.getPlayer(0), "TOUR START");
            send(game.getPlayer(1), "TOUR START");
            send(game.getTourPlayer(), "TOUR YOU");
            send(game.getNotTourPlayer(), "TOUR HE");

            metricsService.increment("games.totalStarted");
          }
        }
      }
    } finally {
      if (lockGame != null) {
        lockGame.unlock();
      }
    }
  }

  private void shot(Player player, String param) {
    Locker.Unlocker lockGame = null;

    try {
      Game game = player.getGame();
      lockGame = locker.lock(game);

      if (game == null) {
        send(player, "400_ no-game-set");

      } else if (game.getState() == Game.State.WAITING) {
        send(player, "400_ game-waiting");

      } else if (game.getNotTourPlayer().equals(player)) {
        send(player, "400_ not-your-tour");

      } else {
        Optional<Coord> coord = coordSerializer.deserialize(param);

        if (coord.isEmpty()) {
          send(player, "400_ bad-shoot");

        } else {
          Player tourPlayer = game.getTourPlayer();
          List<Cell> shoot = tourPlayer.getShootGrid().shoot(coord.get());
          String shootSerial = cellSerializer.serialize(shoot);

          send(tourPlayer, "YOU_ %s", shootSerial);
          send(game.getNotTourPlayer(), "HE__ %s", shootSerial);

          if (game.completed()) {
            send(tourPlayer, "WON_ YOU");
            send(game.getNotTourPlayer(), "WON_ HE");
            game.nextGame();

            metricsService.increment("games.totalFinished");
            metricsService.increment("games.totalCreated");

          } else {
            boolean goodShoot = shoot.stream()
                .anyMatch(s -> s.getType() == Cell.Type.SHIP || s.getType() == Cell.Type.SHIP_SUNK);
            if (!goodShoot) {
              game.nextTour();
            }

            send(game.getTourPlayer(), "TOUR YOU");
            send(game.getNotTourPlayer(), "TOUR HE");
          }
        }
      }
    } finally {
      if (lockGame != null) {
        lockGame.unlock();
      }
    }
  }

  private void ping(Player player, String param) {
    send(player, "PONG %s", param);
  }

  private void other(Player player, String payload) {
    send(player, "400_ unknown-command");
  }
}
