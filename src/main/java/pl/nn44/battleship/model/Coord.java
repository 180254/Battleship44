package pl.nn44.battleship.model;

import com.google.common.base.MoreObjects;
import com.google.common.base.Objects;
import pl.nn44.battleship.DoVerify;

import java.util.Arrays;
import java.util.List;

/**
 * Coord model.
 * This model does NOT do verification of data as parameters.
 */
public class Coord {

    private final int x;
    private final int y;

    @DoVerify(false)
    public Coord(int x, int y) {
        this.x = x;
        this.y = y;
    }

    @DoVerify(false)
    public static Coord c(int x, int y) {
        return new Coord(x, y);
    }

    public int getX() {
        return x;
    }

    public int getY() {
        return y;
    }

    /**
     * Get neighbours of this coord.
     * This method does _not_ verify if given neighbours are proper (in grid).
     *
     * @return list of neighbours
     */
    @DoVerify(false)
    public List<Coord> neighbours() {
        return Arrays.asList(
                Coord.c(x - 1, y),
                Coord.c(x + 1, y),
                Coord.c(x, y - 1),
                Coord.c(x, y + 1)
        );
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Coord coord = (Coord) o;
        return x == coord.x &&
                y == coord.y;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(x, y);
    }

    @Override
    public String toString() {
        return MoreObjects.toStringHelper(this)
                .add("x", x)
                .add("y", y)
                .toString();
    }
}