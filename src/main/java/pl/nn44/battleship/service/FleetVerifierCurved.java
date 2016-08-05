package pl.nn44.battleship.service;

import pl.nn44.battleship.model.Coord;
import pl.nn44.battleship.model.Grid;
import pl.nn44.battleship.model.Ship;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class FleetVerifierCurved implements FleetVerifier {

    public final int[] availSheepSizes;

    public FleetVerifierCurved(int[] availSheepSizes) {
        this.availSheepSizes = availSheepSizes.clone();
        Arrays.sort(this.availSheepSizes);
    }

    @Override
    public boolean verify(Grid grid) {
        ShipFinder shipFinder = ShipFinder.forGrid(grid);

        return checkShipSizes(shipFinder)
                && checkShipsCollisions(shipFinder);
    }

    // ---------------------------------------------------------------------------------------------------------------

    public boolean checkShipSizes(ShipFinder shipFinder) {
        List<Ship> ships = shipFinder.ships();
        int[] shipSizes = ships.stream().mapToInt(Ship::getSize).sorted().toArray();
        return Arrays.equals(availSheepSizes, shipSizes);
    }

    public boolean checkShipsCollisions(ShipFinder shipFinder) {
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
