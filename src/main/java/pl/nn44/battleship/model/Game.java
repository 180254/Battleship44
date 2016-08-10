package pl.nn44.battleship.model;

import com.google.common.base.MoreObjects;
import com.google.common.base.Objects;
import pl.nn44.battleship.utils.id.IdGenerator;
import pl.nn44.battleship.utils.other.Arrays;

import java.util.Random;

public class Game {

    private final String id;
    private final Player[] players = new Player[2];
    private State state = State.WAITING;
    private Integer tour = null;

    public Game(IdGenerator idGenerator, Player player1) {
        id = idGenerator.nextId();
        this.players[0] = player1;
    }
    // ---------------------------------------------------------------------------------------------------------------

    public String getId() {
        return id;
    }

    public Player getPlayer(int no) {
        return players[no];
    }

    public void setPlayer(int no, Player player) {
        players[no] = player;
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

    public boolean setPlayerAtFreeSlot(Player player) {
        int slotIndex = Arrays.indexOf(null, players);

        if (slotIndex != -1) {
            players[slotIndex] = player;
        }

        return slotIndex != -1;
    }

    public boolean removePlayer(Player player) {
        int playerIndex = Arrays.indexOf(player, players);

        if (playerIndex != -1) {
            players[playerIndex] = null;
        }

        return playerIndex != -1;
    }

    public Player secondPlayer(Player player) {
        int playerIndex = Arrays.indexOf(player, players);
        return players[playerIndex + 1 % 2];
    }

    public boolean bothGridSets() {
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

    public void prepareShootGrids() {
        players[0].setShootGrid(new ShootGrid(players[1].getGrid()));
        players[1].setShootGrid(new ShootGrid(players[0].getGrid()));
    }

    // ---------------------------------------------------------------------------------------------------------------

    public boolean completed() {
        // TODO: implement
        return false;
    }

    public void nextGame() {
        // TODO: implement
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

    // ---------------------------------------------------------------------------------------------------------------

    public enum State {
        WAITING, IN_PROGRESS
    }
}
