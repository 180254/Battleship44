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
import pl.nn44.battleship.utils.id.IdGenerator;
import pl.nn44.battleship.utils.other.Strings;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.locks.Lock;
import java.util.function.BiConsumer;
import java.util.stream.Collectors;

@SuppressWarnings("SynchronizationOnLocalVariableOrMethodParameter")
public class WebSocketController extends TextWebSocketHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(WebSocketController.class);


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
    private final Serializer<Cell, String> cellSerializer;

    public WebSocketController(Random random,
                               Locker locker,
                               IdGenerator idGenerator,
                               FleetVerifier fleetVerifier,
                               Serializer<Grid, String> gridSerializer,
                               Serializer<Coord, String> coordSerializer,
                               Serializer<Cell, String> cellSerializer) {
        this.random = random;
        this.locker = locker;
        this.idGenerator = idGenerator;
        this.fleetVerifier = fleetVerifier;
        this.gridSerializer = gridSerializer;
        this.coordSerializer = coordSerializer;
        this.cellSerializer = cellSerializer;
    }

    // ---------------------------------------------------------------------------------------------------------------

    private TextMessage txt(String str) {
        return new TextMessage(str);
    }

    private void txt(Player player, String format, Object... args) {
        String msgId = idGenerator.nextId();
        String msg = String.format(format, args);
        LOGGER.info("-> {} @ {} @ {}", msgId, player.getSession(), msg);

        try {
            player.getSession().sendMessage(txt(msg));
        } catch (IOException e) {
            LOGGER.warn("SERVER -> USER FAIL: {}", msgId);
            LOGGER.warn("exception stack", e);
        }
    }


    // ---------------------------------------------------------------------------------------------------------------

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        session.sendMessage(txt("HI_. What you're looking for here?"));
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        Player player = players.get(session);
        Lock[] locks = locker.lock(player);
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
                txt(secondPlayer, "1PLA");
            } else {
                games.remove(game.getId());
            }
        } finally {
            locker.unlock(locks);
        }
    }

    // ---------------------------------------------------------------------------------------------------------------

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        String command = Strings.safeSubstring(payload, 0, COMMAND_LEN);
        String param = Strings.safeSubstring(payload, COMMAND_LEN + 1);

        Player player = players
                .computeIfAbsent(session, Player::new);

        Lock[] locks = locker.lock(player);

        try {
            commands
                    .getOrDefault(command, this::other)
                    .accept(player, param);
        } finally {
            locker.unlock(locks);
        }
    }

    // ---------------------------------------------------------------------------------------------------------------

    private void game(Player player, String param) {
        if (player.getGame() != null) {
            txt(player, "400_ you-are-in-game");

        } else if (param.equals("NEW")) {
            Game game = new Game(idGenerator, player);
            games.put(game.getId(), game);
            txt(player, "GAME OK %s", game.getId());

        } else {
            Game game = games.get(param);
            if (game == null) {
                txt(player, "GAME FAIL no-such-game");

            } else if (!game.setPlayerToFreeSlot(player)) {
                txt(player, "GAME FAIL no-free-slot");

            } else {
                txt(player, "GAME OK %s", game.getId());
                txt(game.getPlayer1(), "2PLA");
                txt(game.getPlayer2(), "2PLA");
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
            Grid grid = null;//gridSerializer.deserialize(param);
            if (!fleetVerifier.verify(grid)) {
                txt(player, "GRID FAIL");

            } else {
                player.setGrid(grid);
                txt(player, "GRID OK");

                if (game.bothGridSet()) {
                    game.setState(Game.State.IN_PROGRESS);
                    game.setShootGrids();

                    txt(game.getPlayer1(), "TOUR START");
                    txt(game.getPlayer2(), "TOUR START");
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
            Coord coord = null;//coordSerializer.deserialize(param);
            Player tourPlayer = game.getTourPlayer();
            List<Cell> shoot = tourPlayer.getShootGrid().shoot(coord);
            String shootSerial = shoot.stream().map(cellSerializer::serialize).collect(Collectors.joining(","));

            txt(tourPlayer, "YOU_ %s", shootSerial);
            txt(game.getNotTourPlayer(), "HE__ %s", shootSerial);

            if (game.completed()) {
                txt(tourPlayer, "WON_ YOU");
                txt(game.getNotTourPlayer(), "WON_ HE");
                game.reset();
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