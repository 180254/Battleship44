package pl.nn44.battleship.model;

import com.google.common.base.MoreObjects;
import com.google.common.base.Objects;
import org.springframework.web.socket.WebSocketSession;

public class Player {

    private final WebSocketSession session;
    private Grid grid;
    private ShootGrid shootGrid;
    private Game game;

    public Player(WebSocketSession session) {
        this.session = session;
    }

    // ---------------------------------------------------------------------------------------------------------------

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

    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    // ---------------------------------------------------------------------------------------------------------------

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Player player = (Player) o;
        return Objects.equal(session, player.session);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(session);
    }

    @Override
    public String toString() {
        return MoreObjects.toStringHelper(this)
                .add("session", session)
                .add("grid", grid)
                .add("shootGrid", shootGrid)
                .toString();
    }
}
