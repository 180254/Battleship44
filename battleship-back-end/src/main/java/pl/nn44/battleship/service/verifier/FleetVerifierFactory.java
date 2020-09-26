package pl.nn44.battleship.service.verifier;

import pl.nn44.battleship.gamerules.FleetMode;
import pl.nn44.battleship.gamerules.GameRules;
import pl.nn44.battleship.model.Grid;
import pl.nn44.battleship.model.Ship;
import pl.nn44.battleship.service.other.ShipFinder;

import java.util.List;

public class FleetVerifierFactory {

  public static FleetVerifier forRules(GameRules rules) {

    return new FleetVerifier() {
      @Override
      public boolean verify(Grid grid) {
        ShipFinder shipFinder = ShipFinder.forGrid(grid);
        FleetVerifierRules fleetVerifierRules = new FleetVerifierRules(shipFinder);

        if (!fleetVerifierRules.hasAllowedValues(grid)) {
          return false;
        }

        List<Ship> ships = shipFinder.ships();

        boolean valid = fleetVerifierRules.hasProperShipSizes(ships, rules.getFleetSizes().getAvailableShipSizes());

        if (rules.getFleetMode() == FleetMode.STRAIGHT) {
          valid &= fleetVerifierRules.allShipsStraight(ships);
        }

        if (rules.isFleetCanTouchEachOtherDiagonally()) {
          valid &= fleetVerifierRules.hasSpaceAroundShipsPlus(ships);
        } else {
          valid &= fleetVerifierRules.hasSpaceAroundShips(ships);
        }

        return valid;
      }
    };
  }
}
