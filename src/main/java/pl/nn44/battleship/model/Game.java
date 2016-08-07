package pl.nn44.battleship.model;

import com.google.common.base.MoreObjects;
import com.google.common.base.Objects;
import pl.nn44.battleship.utils.IdGenerator;

public class Game {

    private final String id;
    private Player player1;
    private Player player2;

    public Game(IdGenerator idGenerator, Player player1) {
        id = idGenerator.nextId();
        this.player1 = player1;
    }
    // ---------------------------------------------------------------------------------------------------------------

    public String getId() {
        return id;
    }

    public Player getPlayer1() {
        return player1;
    }

    public void setPlayer1(Player player1) {
        this.player1 = player1;
        player1.setGame(this);
    }

    public Player getPlayer2() {
        return player2;
    }

    public void setPlayer2(Player player2) {
        this.player2 = player2;
        player2.setGame(this);
    }

    // ---------------------------------------------------------------------------------------------------------------

    public boolean removePlayer(Player player) {
        if (player.equals(player1)) {
            player1 = null;
            return true;

        } else if (player.equals(player2)) {
            player2 = null;
            return true;

        } else {
            return false;
        }
    }

    public Player secondPlayer(Player player) {
        return player.equals(player1)
                ? player2
                : player1;
    }

    public synchronized boolean setPlayerToFreeSlot(Player player) {
        if (player1 == null) {
            player1 = player;
            return true;
        } else if (player2 == null) {
            player2 = player;
            return true;
        } else {
            return false;
        }
    }

    // ---------------------------------------------------------------------------------------------------------------

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Game game = (Game) o;
        return Objects.equal(id, game.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return MoreObjects.toStringHelper(this)
                .add("id", id)
                .add("player1", player1)
                .add("player2", player2)
                .toString();
    }
}
