package pl.nn44.battleship.service.verifier;

import pl.nn44.battleship.model.Cell;
import pl.nn44.battleship.model.Coord;
import pl.nn44.battleship.model.Grid;
import pl.nn44.battleship.model.Ship;
import pl.nn44.battleship.service.other.ShipFinder;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public abstract class AbstractFleetVerifier implements FleetVerifier {

    public final List<Integer> validCells = Arrays.asList(
            Cell.Type.EMPTY.getCode(),
            Cell.Type.SHIP.getCode()
    );

    protected final int[] availSheepSizes;

    public AbstractFleetVerifier(int[] availSheepSizes) {
        this.availSheepSizes = availSheepSizes.clone();
        Arrays.sort(this.availSheepSizes);
    }

    protected boolean hasProperValues(Grid grid) {
        int[] cells = grid.getCells();
        return Arrays.stream(cells).allMatch(validCells::contains);
    }

    protected boolean hasProperShipSizes(ShipFinder shipFinder) {
        List<Ship> ships = shipFinder.ships();
        int[] shipSizes = ships.stream().mapToInt(Ship::getSize).sorted().toArray();
        return Arrays.equals(availSheepSizes, shipSizes);
    }

    protected boolean hasSpaceAroundShips(ShipFinder shipFinder) {
        List<Ship> ships = shipFinder.ships();
        boolean collision = false;

        outerLoop:
        for (int i = 0; i < ships.size(); i++) {
            Ship ship1 = ships.get(i);
            List<Coord> surrounding1 = shipFinder.surrounding(ship1);

            for (int j = i + 1; j < ships.size(); j++) {
                Ship ship2 = ships.get(j);
                List<Coord> coords2 = ship2.getCoords();

                if (!Collections.disjoint(coords2, surrounding1)) {
                    collision = true;
                    break outerLoop;
                }
            }
        }

        return !collision;
    }
}
