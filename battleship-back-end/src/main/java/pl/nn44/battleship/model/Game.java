package pl.nn44.battleship.model;

import pl.nn44.battleship.gamerules.GameRules;
import pl.nn44.battleship.util.id.IdGenerator;
import pl.nn44.battleship.util.other.Arrays;

import java.util.Objects;
import java.util.Random;
import java.util.StringJoiner;

public class Game {

  private final String id;
  private final Player[] players = new Player[2];
  private final GameRules gameRules;
  private State state = State.WAITING;
  private Integer tour = null;

  public Game(IdGenerator idGenerator, Player player1) {
    this.id = idGenerator.nextId();
    this.gameRules = new GameRules();
    this.players[0] = player1;
  }

  public void cloneRules(GameRules gameRules) {
    this.gameRules.setGridSize(gameRules.getGridSize());
    this.gameRules.setFleetMode(gameRules.getFleetMode());
    this.gameRules.setFleetSizes(gameRules.getFleetSizes());
    this.gameRules.setFleetCanTouchEachOtherDiagonally(gameRules.isFleetCanTouchEachOtherDiagonally());
    this.gameRules.setShowFieldsForSureEmpty(gameRules.isShowFieldsForSureEmpty());
  }

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

  public boolean setPlayerAtFreeSlot(Player player) {
    int slotIndex = Arrays.indexOf(null, players);

    if (slotIndex != -1) {
      players[slotIndex] = player;
    }

    return slotIndex != -1;
  }

  public void removePlayer(Player player) {
    int playerIndex = Arrays.indexOf(player, players);

    if (playerIndex != -1) {
      players[playerIndex] = null;
    }
  }

  public Player secondPlayer(Player player) {
    int playerIndex = Arrays.indexOf(player, players);
    return players[(playerIndex + 1) % 2];
  }

  public boolean bothGridSets() {
    return players[0] != null
        && players[1] != null
        && players[0].getGrid() != null
        && players[1].getGrid() != null;
  }

  public void nextTour() {
    nextTour(null);
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
    players[0].setShootGrid(new ShootGrid(players[1].getGrid(), gameRules));
    players[1].setShootGrid(new ShootGrid(players[0].getGrid(), gameRules));
  }

  public boolean completed() {
    return players[0].getShootGrid().allShotDown()
        || players[1].getShootGrid().allShotDown();
  }

  public void nextGame() {
    state = State.WAITING;
    tour = null;

    for (Player player : players) {
      if (player != null) {
        player.setGrid(null);
        player.setShootGrid(null);
      }
    }
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    Game game = (Game) o;
    return Objects.equals(id, game.id);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id);
  }

  @Override
  public String toString() {
    return new StringJoiner(", ", Game.class.getSimpleName() + "[", "]")
        .add("id='" + id + "'")
        .add("players=" + java.util.Arrays.toString(players))
        .toString();
  }

  public enum State {
    WAITING, IN_PROGRESS
  }
}
