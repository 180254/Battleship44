package pl.nn44.battleship.model;

import com.google.common.base.MoreObjects;
import com.google.common.base.Objects;

import java.util.Arrays;

public class Cell {

    private final Grid grid;
    private final Coord coord;
    private final Type type;

    public Cell(Coord coord, Type type) {
        this.grid = null;
        this.coord = coord;
        this.type = type;
    }

    public Cell(Grid grid, Coord coord, Type type) {
        this.grid = grid;
        this.coord = coord;
        this.type = type;
    }

    public Grid getGrid() {
        return grid;
    }

    public Coord getCoord() {
        return coord;
    }

    public Type getType() {
        return type;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Cell cell = (Cell) o;
        return Objects.equal(grid, cell.grid) &&
                Objects.equal(coord, cell.coord);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(grid, coord);
    }

    @Override
    public String toString() {
        return MoreObjects.toStringHelper(this)
                .add("grid", grid)
                .add("coord", coord)
                .add("type", type)
                .toString();
    }

    // ---------------------------------------------------------------------------------------------------------------

    public enum Type {

        UNKNOWN(-1),
        EMPTY(0),
        SHIP(1);

        private final int code;

        Type(int code) {
            this.code = code;
        }

        public int getCode() {
            return code;
        }

        public static Type getByCode(int code) {
            Type[] allCells = Type.values();
            return Arrays.stream(allCells)
                    .filter(cell -> cell.code == code)
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("bad code"));
        }

        @Override
        public String toString() {
            return MoreObjects.toStringHelper(this)
                    .add("name", name())
                    .add("code", code)
                    .toString();
        }
    }
}
