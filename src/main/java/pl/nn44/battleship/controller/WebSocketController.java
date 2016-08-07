package pl.nn44.battleship.controller;

import com.google.common.collect.ImmutableMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import pl.nn44.battleship.model.Game;
import pl.nn44.battleship.model.Player;
import pl.nn44.battleship.utils.IdGenerator;
import pl.nn44.battleship.utils.Strings;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.function.BiConsumer;

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

    private final IdGenerator idGenerator;

    public WebSocketController(IdGenerator idGenerator) {
        this.idGenerator = idGenerator;
    }
    // ---------------------------------------------------------------------------------------------------------------

    private TextMessage txt(String str) {
        return new TextMessage(str);
    }

    private void txt(Player player, String format, Object... args) {
        String msg = String.format(format, args);

        try {
            player.getSession().sendMessage(txt(msg));

        } catch (IOException e) {
            LOGGER.warn(
                    String.format("Unable to send message [%s] to [%s]", msg, player),
                    e);
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
    }

    // ---------------------------------------------------------------------------------------------------------------

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        String command = Strings.safeSubstring(payload, 0, COMMAND_LEN);
        String param = Strings.safeSubstring(payload, COMMAND_LEN + 1);

        Player player = players
                .computeIfAbsent(session, Player::new);

        commands
                .getOrDefault(command, this::other)
                .accept(player, param);
    }

    // ---------------------------------------------------------------------------------------------------------------

    private void game(Player player, String param) {
        if (player.getGame() != null) {
            txt(player, "400_ no-game");

        } else if (param.equals("NEW")) {
            Game game = new Game(idGenerator, player);
            games.put(game.getId(), game);
            txt(player, String.format("GAME OK %s", game.getId()));

        } else {
            Game game = games.get(param);
            if (game == null) {
                txt(player, "GAME FAIL no-such-game");
            } else if (game.setPlayerToFreeSlot(player)) {
                txt(player, String.format("GAME OK %s", game.getId()));
            } else {
                txt(player, "GAME FAIL no-free-slot");
            }

        }
    }

    private void grid(Player player, String param) {

    }

    private void shot(Player player, String param) {

    }

    private void ping(Player player, String param) {
        txt(player, "PONG %s", param);
    }

    private void other(Player player, String payload) {
        txt(player, "400_ unknown-command");
    }
}