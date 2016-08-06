package pl.nn44.battleship.model;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class Grid {

    protected final int[] cells;
    private final int rowsNo;
    private final int colsNo;

    public Grid(int rowsNo, int colsNo, int[] cells) {
        this.rowsNo = rowsNo;
        this.colsNo = colsNo;
        this.cells = cells.clone();
    }

    public int getSize() {
        return cells.length;
    }

    public int getRowsNo() {
        return rowsNo;
    }

    public int getColsNo() {
        return colsNo;
    }


    public boolean isCoordProper(Coord coord) {
        return (coord.getRow() >= 0
                && coord.getCol() >= 0
                && coord.getRow() < rowsNo
                && coord.getCol() < colsNo);
    }

    public Cell getCell(Coord coord) {
        int offset = coordToOffset(coord);
        int code = cells[offset];
        Cell.Type type = Cell.Type.getByCode(code);

        return new Cell(this, coord, type);
    }

    public List<Cell> getNeighbours(Coord coord) {
        return filteredNeighbours(coord.neighbours());
    }

    public List<Cell> getNeighboursPlus(Coord coord) {
        return filteredNeighbours(coord.neighboursPlus());
    }

    public List<Cell> getNeighboursX(Coord coord) {
        return filteredNeighbours(coord.neighboursX());
    }

    // ---------------------------------------------------------------------------------------------------------------

    protected List<Cell> filteredNeighbours(Collection<Coord> coords) {
        return coords.stream()
                .filter(this::isCoordProper)
                .map(this::getCell)
                .collect(Collectors.toList());
    }

    protected int coordToOffset(Coord coord) {
        return coord.getRow() * colsNo + coord.getCol();
    }

    protected void setCell(Coord coord, Cell.Type type) {
        cells[coordToOffset(coord)] = type.getCode();
    }

    // ---------------------------------------------------------------------------------------------------------------

    @Override
    public boolean equals(Object o) {
        return super.equals(o);
    }

    @Override
    public int hashCode() {
        return super.hashCode();
    }

    @Override
    public String toString() {
        return super.toString();
    }
}
