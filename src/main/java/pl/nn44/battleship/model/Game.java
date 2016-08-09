package pl.nn44.battleship.model;

import com.google.common.base.MoreObjects;
import com.google.common.base.Objects;
import pl.nn44.battleship.utils.IdGenerator;

import java.util.Random;

public class Game {

    private final String id;
    private final Player[] players = new Player[2];
    private State state = State.WAITING;
    private Integer tour = null;

    public Game(IdGenerator idGenerator, Player player1) {
        id = idGenerator.nextId();
        this.players[1] = player1;
    }
    // ---------------------------------------------------------------------------------------------------------------

    public String getId() {
        return id;
    }

    public Player getPlayer1() {
        return players[0];
    }

    public void setPlayer1(Player player1) {
        players[0] = player1;
        player1.setGame(this);
    }

    public Player getPlayer2() {
        return players[1];
    }

    public void setPlayer2(Player player2) {
        players[1] = player2;
        player2.setGame(this);
    }

    public State getState() {
        return state;
    }

    public void setState(State state) {
        this.state = state;
    }

    public Integer getTour() {
        return tour;
    }

    public void setTour(Integer tour) {
        this.tour = tour;
    }

    // ---------------------------------------------------------------------------------------------------------------

    public boolean removePlayer(Player player) {
        if (player.equals(players[0])) {
            players[0] = null;
            return true;

        } else if (player.equals(players[1])) {
            players[1] = null;
            return true;

        } else {
            return false;
        }
    }

    public Player secondPlayer(Player player) {
        return player.equals(players[0])
                ? players[1]
                : players[0];
    }

    public synchronized boolean setPlayerToFreeSlot(Player player) {
        if (players[0] == null) {
            players[0] = player;
            return true;
        } else if (players[1] == null) {
            players[1] = player;
            return true;
        } else {
            return false;
        }
    }

    public boolean bothGridSet() {
        return players[0] != null
                && players[1] != null
                && players[0].getGrid() != null
                && players[1].getGrid() != null;
    }

    public void nextTour(Random random) {
        tour = tour == null
                ? random.nextInt(2)
                : (tour + 1) % 2;
    }

    public Player getTourPlayer() {
        return players[tour];
    }

    public Player getNotTourPlayer() {
        return players[(tour + 1) % 2];
    }

    public void setShootGrids() {
        players[0].setShootGrid(new ShootGrid(players[1].getGrid()));
        players[1].setShootGrid(new ShootGrid(players[0].getGrid()));
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
                .add("players", players)
                .toString();
    }

    public boolean completed() {
        return false;
    }

    public void reset() {

    }

    // ---------------------------------------------------------------------------------------------------------------

    public enum State {
        WAITING, IN_PROGRESS
    }
}
