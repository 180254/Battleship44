package pl.nn44.battleship.model;

import org.springframework.web.socket.WebSocketSession;

import java.util.Objects;
import java.util.StringJoiner;

public class Player {

  private final WebSocketSession session;
  private Game game;
  private Grid grid;
  private ShootGrid shootGrid;

  public Game getGame() {
    return game;
  }

  public void setGame(Game game) {
    this.game = game;
  }

  public Player(WebSocketSession session) {
    this.session = session;
  }

  public WebSocketSession getSession() {
    return session;
  }

  public Grid getGrid() {
    return grid;
  }

  public void setGrid(Grid grid) {
    this.grid = grid;
  }

  public ShootGrid getShootGrid() {
    return shootGrid;
  }

  public void setShootGrid(ShootGrid shootGrid) {
    this.shootGrid = shootGrid;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    Player player = (Player) o;
    return Objects.equals(session, player.session);
  }

  @Override
  public int hashCode() {
    return Objects.hash(session);
  }

  @Override
  public String toString() {
    return new StringJoiner(", ", Player.class.getSimpleName() + "[", "]")
        .add("session=" + session)
        .toString();
  }
}
