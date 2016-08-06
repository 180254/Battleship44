package pl.nn44.battleship.model;

import com.google.common.base.MoreObjects;
import com.google.common.base.Objects;
import pl.nn44.battleship.utils.IdGenerator;

public class Game {

    public final String id;
    public Player player1;
    public Player player2;

    public Game(IdGenerator idGenerator) {
        id = idGenerator.nextId();
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
