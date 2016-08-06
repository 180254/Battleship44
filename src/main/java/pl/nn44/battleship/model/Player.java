package pl.nn44.battleship.model;

import com.google.common.base.MoreObjects;
import com.google.common.base.Objects;
import org.springframework.web.socket.WebSocketSession;

public class Player {

    public WebSocketSession session;
    public Grid grid;
    public ShootGrid shootGrid;

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
