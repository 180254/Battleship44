package pl.nn44.battleship.model;

import com.google.common.collect.ImmutableList;
import pl.nn44.battleship.annotation.DoVerify;
import pl.nn44.battleship.utils.Assert;

import java.util.List;
import java.util.stream.Collectors;

public class Grid {

    protected final int[] cells;
    private final int sizeX;
    private final int sizeY;

    @DoVerify(true)
    public Grid(int sizeX, int sizeY, int[] cells) {
        Assert.ensureThat(cells.length == sizeX * sizeY, "cells", "out of grid");

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

    @DoVerify(true)
    public Cell getCell(Coord coord) {
        Assert.ensureThat(isCoordProper(coord), "coord", "out of grid");

        int offset = coordToOffset(coord);
        int code = cells[offset];
        Cell.Type type = Cell.Type.getByCode(code);

        return new Cell(coord, type);
    }

    @DoVerify(true)
    public List<Cell> getNeighbours(Coord coord) {
        Assert.ensureThat(isCoordProper(coord), "coord", "out of grid");

        return ImmutableList.<Cell>builder()
                .addAll(getNeighboursPlus(coord))
                .addAll(getNeighboursX(coord))
                .build();
    }

    @DoVerify(true)
    public List<Cell> getNeighboursPlus(Coord coord) {
        Assert.ensureThat(isCoordProper(coord), "coord", "out of grid");

        return coord.neighboursPlus().stream()
                .filter(this::isCoordProper)
                .map(this::getCell)
                .collect(Collectors.toList());
    }

    @DoVerify(true)
    public List<Cell> getNeighboursX(Coord coord) {
        Assert.ensureThat(isCoordProper(coord), "coord", "out of grid");

        return coord.neighboursX().stream()
                .filter(this::isCoordProper)
                .map(this::getCell)
                .collect(Collectors.toList());
    }

    // ---------------------------------------------------------------------------------------------------------------

    @DoVerify(false)
    protected boolean isCoordProper(Coord coord) {
        return (coord.getX() >= 0
                && coord.getY() >= 0
                && coord.getX() < sizeX
                && coord.getY() < sizeY);
    }

    @DoVerify(false)
    protected int coordToOffset(Coord coord) {
        return coord.getY() * sizeX + coord.getX();
    }

}
