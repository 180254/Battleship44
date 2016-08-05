package pl.nn44.battleship.model;

import com.google.common.base.MoreObjects;
import com.google.common.base.Objects;
import com.google.common.collect.ImmutableList;

import java.util.Arrays;
import java.util.List;

public class Coord {

    private final int x;
    private final int y;

    public Coord(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public static Coord c(int x, int y) {
        return new Coord(x, y);
    }

    public int getX() {
        return x;
    }

    public int getY() {
        return y;
    }

    public List<Coord> neighbours() {
        return ImmutableList.<Coord>builder()
                .addAll(neighboursPlus())
                .addAll(neighboursX())
                .build();
    }

    public List<Coord> neighboursPlus() {
        return Arrays.asList(
                Coord.c(x - 1, y),
                Coord.c(x + 1, y),
                Coord.c(x, y - 1),
                Coord.c(x, y + 1)
        );
    }

    public List<Coord> neighboursX() {
        return Arrays.asList(
                Coord.c(x - 1, y - 1),
                Coord.c(x - 1, y + 1),
                Coord.c(x + 1, y - 1),
                Coord.c(x + 1, y + 1)
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
