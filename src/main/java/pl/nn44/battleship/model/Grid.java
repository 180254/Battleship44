package pl.nn44.battleship.model;

import pl.nn44.battleship.DoVerify;
import pl.nn44.battleship.utils.Assert;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Grid model.
 * This model DO verification of data given as parameters.
 */
public class Grid {

    private final int[] cells;
    private final int sizeX;

    @DoVerify(true)
    public Grid(int sizeX, int sizeY, int[] cells) {
        Assert.notNull(cells, "cells");
        Assert.ensureThat(cells.length == sizeX * sizeY, "cells", "out of grid");

        this.sizeX = sizeX;
        this.cells = cells.clone();
    }

    @DoVerify(true)
    public Cell getCell(Coord coord) {
        verifyCoord(coord);

        int offset = coordToOffset(coord);
        int code = cells[offset];
        CellType types = CellType.getByCode(code);

        return new Cell(coord, types);
    }

    @DoVerify(true)
    public List<Cell> getNeighbours(Coord coord) {
        verifyCoord(coord);

        return coord.neighbours().stream()
                .filter(this::isCoordProper)
                .map(this::getCell)
                .collect(Collectors.toList());
    }

    // -------------------------------------------------------------------------------------------------

    @DoVerify(false)
    private int coordToOffset(Coord coord) {
        return coord.getX() * sizeX + coord.getY();
    }

    @DoVerify(true)
    private void verifyCoord(Coord coord) {
        Assert.ensureThat(coordToOffset(coord) < cells.length, "coord.x,y", "out of grid");
        Assert.ensureThat(coord.getX() >= 0, "coord.x", "out of grid");
        Assert.ensureThat(coord.getY() >= 0, "coord.x", "out of grid");
    }

    @DoVerify(false)
    private boolean isCoordProper(Coord coord) {
        // TODO: better method without repeating conditions?
        try {
            verifyCoord(coord);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}
