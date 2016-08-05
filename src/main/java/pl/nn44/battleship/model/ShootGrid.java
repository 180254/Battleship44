package pl.nn44.battleship.model;

import pl.nn44.battleship.utils.Assert;

import java.util.Arrays;

public class ShootGrid extends Grid {

    private final Grid opponentGrid;

    public ShootGrid(Grid opponentGrid) {
        super(
                opponentGrid.getSizeX(),
                opponentGrid.getSizeY(),
                new int[opponentGrid.getSize()]);

        this.opponentGrid = opponentGrid;
        Arrays.fill(this.cells, Cell.Type.SHOOT_UNKNOWN.getCode());
    }

    public Grid getOpponentGrid() {
        return opponentGrid;
    }

    public Cell.Type shoot(Coord coord) {
        Assert.ensureThat(opponentGrid.isCoordProper(coord), "coord", "out of grid");
        Cell.Type type = opponentGrid.getCell(coord).getType();

        if (type == Cell.Type.SHIP) {

        }

        return type == Cell.Type.SHIP
                ? Cell.Type.SHOOT_HIT
                : Cell.Type.SHOOT_MISS;

    }
}
