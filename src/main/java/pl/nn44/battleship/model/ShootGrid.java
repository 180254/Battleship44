package pl.nn44.battleship.model;

import pl.nn44.battleship.service.grid.ShipFinder;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ShootGrid extends Grid {

    private final Grid opponentGrid;
    private final ShipFinder opShipFinder;

    public ShootGrid(Grid opponentGrid) {
        super(
                opponentGrid.getSizeX(),
                opponentGrid.getSizeY(),
                new int[opponentGrid.getSize()]);

        this.opponentGrid = opponentGrid;
        this.opShipFinder = ShipFinder.forGrid(opponentGrid);

        Arrays.fill(this.cells, Cell.Type.SHOOT_UNKNOWN.getCode());
    }

    /**
     * @param coord coord
     * @return list of changed cells
     */
    public List<Cell> shoot(Coord coord) {
        List<Cell> changedCell = new ArrayList<>();
        Cell.Type opponentCell = opponentGrid.getCell(coord).getType();

        if (opponentCell == Cell.Type.SHIP) {
            this.setCell(coord, Cell.Type.SHOOT_HIT);

            Ship opponentShip = opShipFinder.findShip(coord);
            if (isShipSink(opponentShip)) {

                for (Coord surroundCoord : opShipFinder.surrounding(opponentShip)) {
                    this.setCell(surroundCoord, Cell.Type.SHOOT_EMPTY);
                    changedCell.add(this.getCell(surroundCoord));
                }
            }

        } else {
            this.setCell(coord, Cell.Type.SHOOT_EMPTY);
        }

        changedCell.add(this.getCell(coord));
        return changedCell;
    }

    // ---------------------------------------------------------------------------------------------------------------

    private boolean isShipSink(Ship ship) {
        return ship.getCoords().stream()
                .map(this::getCell)
                .allMatch(c -> c.getType() == Cell.Type.SHOOT_HIT);
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
