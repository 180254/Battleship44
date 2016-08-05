package pl.nn44.battleship.model;

import org.springframework.web.socket.WebSocketSession;

public class Player {

    private WebSocketSession session;
    private Grid grid;
    private ShootGrid shootGrid;

    public WebSocketSession getSession() {
        return session;
    }

    public void setSession(WebSocketSession session) {
        this.session = session;
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
}
