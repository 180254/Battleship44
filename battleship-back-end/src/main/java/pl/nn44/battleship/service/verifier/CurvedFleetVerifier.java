package pl.nn44.battleship.service.verifier;

import pl.nn44.battleship.model.Grid;
import pl.nn44.battleship.service.other.ShipFinder;

public class CurvedFleetVerifier extends AbstractFleetVerifier {

  public CurvedFleetVerifier(int[] availShipSizes) {
    super(availShipSizes);
  }

  @Override
  public boolean verify(Grid grid) {
    ShipFinder shipFinder = ShipFinder.forGrid(grid);

    return hasProperValues(grid)
        && hasProperShipSizes(shipFinder)
        && hasSpaceAroundShips(shipFinder);
  }
}
