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

  private final GameRules defaultGameRules;
  private final Random random;
  private final Locker locker;
  private final IdGenerator idGenerator;
  private final MetricsService metricsService;
  private final MatchMakingService matchMakingService;
  private final Serializer<Grid, String> gridSerializer;
  private final Serializer<Coord, String> coordSerializer;
  private final Serializer<List<Cell>, String> cellSerializer;

  private final Map<String, BiConsumer<Player, String>> commands =
      Map.ofEntries(
          Map.entry("GAME", this::processCommandGame),
          Map.entry("GAME-RULES", this::processCommandGameRules),
          Map.entry("MATCHMK", this::processCommandMatchMaking),
          Map.entry("GRID", this::processCommandGrid),
          Map.entry("SHOT", this::processCommandShot),
          Map.entry("PING", this::processCommandPing)
      );

  public GameController(GameRules defaultGameRules,
                        Random random,
                        Locker locker,
                        IdGenerator idGenerator,
                        MetricsService metricsService,
                        MatchMakingService matchMakingService, Serializer<Grid, String> gridSerializer,
                        Serializer<Coord, String> coordSerializer,
                        Serializer<List<Cell>, String> cellSerializer) {
    this.defaultGameRules = defaultGameRules;
    this.random = random;
    this.locker = locker;
    this.idGenerator = idGenerator;
    this.metricsService = metricsService;
    this.matchMakingService = matchMakingService;
    this.gridSerializer = gridSerializer;
    this.coordSerializer = coordSerializer;
    this.cellSerializer = cellSerializer;

    this.metricsService.registerDeliverableMetric("players.currentSize", players::size);
    this.metricsService.registerDeliverableMetric("games.currentSize", games::size);
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
    metricsService.countUniqueValues("players.uniqueSoFar", clientAddress);

    players.computeIfAbsent(session, Player::new);
    broadcast("STAT players=%s", players.size());
  }

  @Override
  public void afterConnectionClosed(@Nonnull WebSocketSession session, @Nonnull CloseStatus status) {
    LOGGER.info("<-> {} @ closed @ {}", sessionId(session), status);
    Player player = players.get(session);
    Locker.Unlocker playerLock = locker.lock(player);

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
      playerLock.unlock();
    }
  }

  @Override
  protected void handleTextMessage(@Nonnull WebSocketSession session, TextMessage message) {
    String payload = message.getPayload();
    int endOfCommandIndex = Strings.indexOf(payload, ' ', payload.length());
    String command = Strings.safeSubstring(payload, 0, endOfCommandIndex);
    String param = Strings.safeSubstring(payload, endOfCommandIndex + 1);

    LOGGER.info("<-  {} @ {}", session.getId(), message.getPayload());

    Player player = players.get(session);
    Locker.Unlocker lock = locker.lock(player);

    try {
      commands
          .getOrDefault(command, this::processOtherCommand)
          .accept(player, param);
    } finally {
      lock.unlock();
    }
  }

  private void processCommandGame(Player player, String param) {
    if (player.getGame() != null) {
      send(player, "400 GAME you-are-in-game");
      return;
    }

    if (param.equals("NEW")) {
      Game game = new Game(idGenerator, player);
      game.cloneGameRules(defaultGameRules);
      player.setGame(game);
      games.put(game.getId(), game);
      send(player, "GAME OK %s", game.getId());
      send(player, "GAME-RULES %s", game.getGameRules().describe());
      metricsService.incrementCounter("games.totalCreated");
      return;
    }

    // else GAME <game_id>
    Game game = games.get(param);

    if (game == null) {
      send(player, "400 GAME no-such-game");
      return;
    }

    if (!game.setPlayerAtFreeSlot(player)) {
      send(player, "400 GAME no-free-slot");
      return;
    }

    player.setGame(game);
    send(player, "GAME OK %s", game.getId());
    send(player, "GAME-RULES %s", game.getGameRules().describe());
    send(game.getPlayer(0), "2PLA");
    send(game.getPlayer(1), "2PLA");
  }


  private void processCommandGameRules(Player player, String param) {
    if (player.getGame() == null) {
      send(player, "400 GAME-RULES no-game-set");
      return;
    }

    Game game = player.getGame();

    if (game.bothPlayerSlotsUsed()) {
      send(player, "400 GAME-RULES 2pla-in-game");
      return;
    }

    if (game.getState() == Game.State.IN_PROGRESS) {
      send(player, "400 GAME-RULES game-in-progress");
      return;
    }

    String[] gameRulesChange = param.split("=", 2);
    if (gameRulesChange.length != 2) {
      send(player, "400 GAME-RULES invalid-game-rules-change");
      return;
    }

    GameRules gameRules = game.getGameRules();

    if (gameRulesChange[1].equals("next")) {
      String changeKey = gameRulesChange[0];

      switch (changeKey) {
        case "fleet-sizes": {
          List<FleetSizes> fleetSizes = Arrays.asList(FleetSizes.values());
          int currentIndex = fleetSizes.indexOf(gameRules.getFleetSizes());
          int nextIndex = (currentIndex + 1) % fleetSizes.size();
          FleetSizes nextFleetMode = fleetSizes.get(nextIndex);
          gameRules.setFleetSizes(nextFleetMode);
          send(player, "GAME-RULES fleet-sizes=%s", nextFleetMode);
          break;
        }

        case "fleet-mode": {
          List<FleetMode> fleetModes = Arrays.asList(FleetMode.values());
          int currentIndex = fleetModes.indexOf(gameRules.getFleetMode());
          int nextIndex = (currentIndex + 1) % fleetModes.size();
          FleetMode nextFleetMode = fleetModes.get(nextIndex);
          gameRules.setFleetMode(nextFleetMode);
          send(player, "GAME-RULES fleet-mode=%s", nextFleetMode);
          break;
        }

        case "fleet-can-touch-each-other-diagonally": {
          boolean currentValue = gameRules.isFleetCanTouchEachOtherDiagonally();
          boolean nextValue = !currentValue;
          gameRules.setFleetCanTouchEachOtherDiagonally(nextValue);
          send(player, "GAME-RULES fleet-can-touch-each-other-diagonally=%s", nextValue);
          break;
        }

        case "show-fields-for-sure-empty": {
          boolean currentValue = gameRules.isShowFieldsForSureEmpty();
          boolean nextValue = !currentValue;
          gameRules.setShowFieldsForSureEmpty(nextValue);
          send(player, "GAME-RULES show-fields-for-sure-empty=%s", nextValue);
          break;
        }

        default: {
          send(player, "400 GAME-RULES invalid-game-rules-change");
        }
      }

      return;
    }

    String changeKey = gameRulesChange[0];
    String changeValue = gameRulesChange[1];

    outerSwitch:
    switch (changeKey) {
      case "fleet-sizes": {
        for (FleetSizes fleetSizes : FleetSizes.values()) {
          if (fleetSizes.name().equalsIgnoreCase(changeValue)) {
            gameRules.setFleetSizes(fleetSizes);
            send(player, "GAME-RULES fleet-sizes=%s", fleetSizes);
            break outerSwitch;
          }
        }
        send(player, "400 GAME-RULES invalid-game-rules-change");
        break;
      }

      case "fleet-mode": {
        for (FleetMode fleetMode : FleetMode.values()) {
          if (fleetMode.name().equalsIgnoreCase(changeValue)) {
            gameRules.setFleetMode(fleetMode);
            send(player, "GAME-RULES fleet-mode=%s", fleetMode);
            break outerSwitch;
          }
        }
        send(player, "400 GAME-RULES invalid-game-rules-change");
        break;
      }

      case "fleet-can-touch-each-other-diagonally": {
        boolean nextValue = Boolean.parseBoolean(changeValue);
        gameRules.setFleetCanTouchEachOtherDiagonally(nextValue);
        send(player, "GAME-RULES fleet-can-touch-each-other-diagonally=%s", nextValue);
        break;
      }

      case "show-fields-for-sure-empty": {
        boolean nextValue = Boolean.parseBoolean(changeValue);
        gameRules.setShowFieldsForSureEmpty(nextValue);
        send(player, "GAME-RULES show-fields-for-sure-empty=%s", nextValue);
        break;
      }

      default: {
        send(player, "400 GAME-RULES invalid-game-rules-change");
      }
    }
  }

  private void processCommandMatchMaking(Player player, String param) {
    Game game = player.getGame();

    if (game == null) {
      send(player, "400 MATCHMK no-game-set");
      return;
    }

    if (game.getState() == Game.State.IN_PROGRESS) {
      send(player, "400 MATCHMK game-in-progress");
      return;
    }

    matchMakingService.makeGameAsync(player).whenComplete((newGame, throwable) -> {
      if (throwable != null) {
        send(player, "408 MATCHMK timeout");
        return;
      }

      send(newGame.getPlayer(0), "MATCHMK %s", newGame.getId());
      send(newGame.getPlayer(1), "MATCHMK %s", newGame.getId());
    });
  }

  private void processCommandGrid(Player player, String param) {
    Game game = player.getGame();

    if (game == null) {
      send(player, "400 GRID no-game-set");
      return;
    }

    if (game.getState() == Game.State.IN_PROGRESS) {
      send(player, "400 GRID game-in-progress");
      return;
    }

    if (player.getGrid() != null) {
      send(player, "400 GRID grid-already-set");
      return;
    }

    if (param.equals("RANDOM")) {
      MonteCarloFleet monteCarloFleet = new MonteCarloFleet(game.getGameRules(), random, metricsService);
      monteCarloFleet.maybeRandomFleet().whenComplete((grid, throwable) -> {
        if (throwable == null && grid != null) {
          send(player, "GRID RANDOM %s", gridSerializer.serialize(grid));
        }
      });
      return;
    }

    // GRID 0,1,0,1,1,
    Optional<Grid> grid = gridSerializer.deserialize(param);

    if (grid.isEmpty()) {
      send(player, "GRID FAIL");
      return;
    }

    if (!FleetVerifierFactory.forRules(game.getGameRules()).verify(grid.get())) {
      send(player, "GRID FAIL");
      return;
    }

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

      metricsService.incrementCounter("games.totalStarted");
    }
  }

  private void processCommandShot(Player player, String param) {
    Game game = player.getGame();

    if (game == null) {
      send(player, "400 SHOT no-game-set");
      return;
    }

    if (game.getState() == Game.State.WAITING) {
      send(player, "400 SHOT game-waiting");
      return;
    }

    if (game.getNotTourPlayer().equals(player)) {
      send(player, "400 SHOT not-your-tour");
      return;
    }

    // SHOT [0,2]
    Optional<Coord> coord = coordSerializer.deserialize(param);

    if (coord.isEmpty()) {
      send(player, "400 SHOT bad-shoot");
      return;
    }

    Player tourPlayer = game.getTourPlayer();
    List<Cell> shoot = tourPlayer.getShootGrid().shoot(coord.get());
    String shootSerial = cellSerializer.serialize(shoot);

    send(tourPlayer, "YOU_ %s", shootSerial);
    send(game.getNotTourPlayer(), "HE__ %s", shootSerial);

    if (game.completed()) {
      send(tourPlayer, "WON_ YOU");
      send(game.getNotTourPlayer(), "WON_ HE");
      game.nextGame();

      metricsService.incrementCounter("games.totalFinished");
      metricsService.incrementCounter("games.totalCreated");

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

  private void processCommandPing(Player player, String param) {
    send(player, "PONG %s", param);
  }

  @SuppressWarnings("PMD.UnusedFormalParameter") // must match to "commands" map prototype
  private void processOtherCommand(Player player, String payload) {
    send(player, "400 unknown-command");
  }
}
