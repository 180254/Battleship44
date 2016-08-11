package pl.nn44.battleship.service.verifier;

import pl.nn44.battleship.model.Coord;
import pl.nn44.battleship.model.Grid;
import pl.nn44.battleship.model.Ship;
import pl.nn44.battleship.service.other.ShipFinder;

import java.util.List;

public class StraightFleetVerifier extends AbstractFleetVerifier {

    public StraightFleetVerifier(int[] availShipSizes) {
        super(availShipSizes);
    }

    @Override
    public boolean verify(Grid grid) {
        ShipFinder shipFinder = ShipFinder.forGrid(grid);

        return hasProperValues(grid)
                && hasProperShipSizes(shipFinder)
                && hasSpaceAroundShips(shipFinder)
                && allShipsStraight(shipFinder);
    }


    private boolean allShipsStraight(ShipFinder shipFinder) {
        List<Ship> ships = shipFinder.ships();
        return ships.stream().allMatch(this::isShipStraight);
    }

    private boolean isShipStraight(Ship ship) {
        return isOneRow(ship) || isOneCol(ship);
    }

    private boolean isOneRow(Ship ship) {
        List<Coord> coords = ship.getCoords();
        int rightRow = coords.get(0).getRow();
        return coords.stream().map(Coord::getRow).allMatch(r -> r == rightRow);
    }

    private boolean isOneCol(Ship ship) {
        List<Coord> coords = ship.getCoords();
        int rightCol = coords.get(0).getCol();
        return coords.stream().map(Coord::getCol).allMatch(r -> r == rightCol);
    }
}
