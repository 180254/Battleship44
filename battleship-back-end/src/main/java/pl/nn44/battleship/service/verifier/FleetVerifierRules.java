package pl.nn44.battleship.service.verifier;

import pl.nn44.battleship.model.Cell;
import pl.nn44.battleship.model.Coord;
import pl.nn44.battleship.model.Grid;
import pl.nn44.battleship.model.Ship;
import pl.nn44.battleship.service.other.ShipFinder;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.function.Function;

public class FleetVerifierRules {

  private final ShipFinder shipFinder;

  public FleetVerifierRules(ShipFinder shipFinder) {
    this.shipFinder = shipFinder;
  }

  public boolean hasProperValues(Grid grid) {
    int[] cells = grid.getCells();
    return Arrays.stream(cells).allMatch(val ->
        val == Cell.Type.EMPTY.getCode()
            || val == Cell.Type.SHIP.getCode()
    );
  }

  public boolean hasProperShipSizes(List<Ship> ships, int[] availShipSizes) {
    int[] shipSizes = ships.stream().mapToInt(Ship::getSize).sorted().toArray();
    return Arrays.equals(availShipSizes, shipSizes);
  }

  public boolean hasSpaceAroundShips(List<Ship> ships) {
    return hasSpaceAroundShipsHelper(ships, shipFinder::neighbours);
  }

  public boolean hasSpaceAroundShipsPlus(List<Ship> ships) {
    return hasSpaceAroundShipsHelper(ships, shipFinder::neighboursPlus);
  }

  private boolean hasSpaceAroundShipsHelper(List<Ship> ships, Function<Ship, List<Coord>> neighboursSupplier) {
    boolean collision = false;

    outerLoop:
    for (int i = 0; i < ships.size(); i++) {
      Ship ship1 = ships.get(i);
      List<Coord> neighbours = neighboursSupplier.apply(ship1);

      for (int j = i + 1; j < ships.size(); j++) {
        Ship ship2 = ships.get(j);
        List<Coord> coords2 = ship2.getCoords();

        if (!Collections.disjoint(coords2, neighbours)) {
          collision = true;
          break outerLoop;
        }
      }
    }

    return !collision;
  }

  public boolean allShipsStraight(List<Ship> ships) {
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
