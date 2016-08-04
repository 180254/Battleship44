package pl.nn44.battleship.model;

import com.google.common.base.MoreObjects;
import com.google.common.base.Objects;
import pl.nn44.battleship.DoVerify;

/**
 * Cell model.
 * This model does NOT do verification of given data as parameters.
 */
public class Cell {

    private final Coord coord;
    private final CellType cellType;

    @DoVerify(false)
    public Cell(Coord coord, CellType cellType) {
        this.coord = coord;
        this.cellType = cellType;
    }

    public Coord getCoord() {
        return coord;
    }

    public CellType getCellType() {
        return cellType;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Cell cell = (Cell) o;

        return Objects.equal(coord, cell.coord) &&
                cellType == cell.cellType;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(coord, cellType);
    }

    @Override
    public String toString() {
        return MoreObjects.toStringHelper(this)
                .add("coord", coord)
                .add("cellType", cellType)
                .toString();
    }
}
