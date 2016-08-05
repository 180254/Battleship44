package pl.nn44.battleship.model;

import com.google.common.base.MoreObjects;
import com.google.common.base.Objects;
import pl.nn44.battleship.annotation.DoVerify;

import java.util.Arrays;

public class Cell {

    private final Coord coord;
    private final Type type;

    @DoVerify(false)
    public Cell(Coord coord, Type type) {
        this.coord = coord;
        this.type = type;
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

        return Objects.equal(coord, cell.coord) &&
                type == cell.type;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(coord, type);
    }

    @Override
    public String toString() {
        return MoreObjects.toStringHelper(this)
                .add("coord", coord)
                .add("type", type)
                .toString();
    }

    // ---------------------------------------------------------------------------------------------------------------

    public enum Type {

        EMPTY(0), SHIP(1),

        UNKNOWN(5), HIT(6), MISS(7), VERIFIED_EMPTY(8);

        private int code;

        Type(int code) {
            this.code = code;
        }

        public int getCode() {
            return code;
        }

        @DoVerify(true)
        public static Type getByCode(int code) {
            Type[] allCells = Type.values();
            return Arrays.stream(allCells)
                    .filter(cell -> cell.code == code)
                    .findAny()
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
