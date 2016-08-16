package pl.nn44.battleship.controller;

import com.google.common.collect.ImmutableMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import pl.nn44.battleship.model.*;
import pl.nn44.battleship.service.locker.Locker;
import pl.nn44.battleship.service.serializer.Serializer;
import pl.nn44.battleship.service.verifier.FleetVerifier;
import pl.nn44.battleship.util.id.IdGenerator;
import pl.nn44.battleship.util.other.Strings;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.function.BiConsumer;

public class GameController extends TextWebSocketHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(GameController.class);


    public static final int COMMAND_LEN = 4;
    private final Map<String, BiConsumer<Player, String>> commands =
            new ImmutableMap.Builder<String, BiConsumer<Player, String>>()
                    .put("GAME", this::game)
                    .put("GRID", this::grid)
                    .put("SHOT", this::shot)
                    .put("PING", this::ping)
                    .build();

    private final ConcurrentMap<WebSocketSession, Player> players = new ConcurrentHashMap<>();
    private final ConcurrentMap<String, Game> games = new ConcurrentHashMap<>();

    private final Random random;
    private final Locker locker;
    private final IdGenerator idGenerator;
    private final FleetVerifier fleetVerifier;
    private final Serializer<Grid, String> gridSerializer;
    private final Serializer<Coord, String> coordSerializer;
    private final Serializer<List<Cell>, String> cellSerializer;

    public GameController(Random random,
                          Locker locker,
                          IdGenerator idGenerator,
                          FleetVerifier fleetVerifier,
                          Serializer<Grid, String> gridSerializer,
                          Serializer<Coord, String> coordSerializer,
                          Serializer<List<Cell>, String> cellSerializer) {
        this.random = random;
        this.locker = locker;
        this.idGenerator = idGenerator;
        this.fleetVerifier = fleetVerifier;
        this.gridSerializer = gridSerializer;
        this.coordSerializer = coordSerializer;
        this.cellSerializer = cellSerializer;
    }

    // ---------------------------------------------------------------------------------------------------------------

    private void txt(Player player, String format, Object... args) {
        txt(player.getSession(), format, args);
    }

    private void txt(WebSocketSession session, String format, Object... args) {
        String msg = String.format(format, args);
        LOGGER.info("->  {} @ {}", session.getId(), msg);

        try {
            TextMessage textMessage = new TextMessage(msg);
            session.sendMessage(textMessage);
        } catch (IOException e) {
            LOGGER.warn("server to user _fail_");
            LOGGER.info("->  {} @ {}", session.getId(), msg);
            LOGGER.warn("exception stack", e);
        }
    }


    // ---------------------------------------------------------------------------------------------------------------

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        LOGGER.info("<-> {} @ established", session.getId());
        txt(session, "HI_. What you're looking for here?");
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        LOGGER.info("<-> {} @ closed @ {}", session.getId(), status);
        Player player = players.get(session);
        Locker.Sync lock = locker.lock(player);

        try {
            if (player == null) {
                return;
            }

            players.remove(session);

            Game game = player.getGame();
            if (game == null) {
                return;
            }

            Player secondPlayer = game.secondPlayer(player);
            game.removePlayer(player);

            if (secondPlayer != null) {
                txt(secondPlayer, "1PLA opponent-is-gone " + game.getId());
                game.nextGame();
            } else {
                games.remove(game.getId());
            }
        } finally {
            lock.unlock();
        }
    }

    // ---------------------------------------------------------------------------------------------------------------

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        String command = Strings.safeSubstring(payload, 0, COMMAND_LEN);
        String param = Strings.safeSubstring(payload, COMMAND_LEN + 1);

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

    // ---------------------------------------------------------------------------------------------------------------

    private void game(Player player, String param) {
        Locker.Sync lockGame = null;

        try {
            if (player.getGame() != null) {
                txt(player, "400_ you-are-in-game");

            } else if (param.equals("NEW")) {
                Game game = new Game(idGenerator, player);
                player.setGame(game);
                games.put(game.getId(), game);
                txt(player, "GAME OK %s", game.getId());

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

            if (!grid.isPresent()) {
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

            if (!coord.isPresent()) {
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