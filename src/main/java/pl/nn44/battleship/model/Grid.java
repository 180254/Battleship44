package pl.nn44.battleship.model;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class Grid {

    protected final int[] cells;
    private final int sizeX;
    private final int sizeY;

    public Grid(int sizeX, int sizeY, int[] cells) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.cells = cells.clone();
    }

    public int getSize() {
        return cells.length;
    }

    public int getSizeX() {
        return sizeX;
    }

    public int getSizeY() {
        return sizeY;
    }

    public boolean isCoordProper(Coord coord) {
        return (coord.getX() >= 0
                && coord.getY() >= 0
                && coord.getX() < sizeX
                && coord.getY() < sizeY);
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
        return coord.getY() * sizeX + coord.getX();
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
