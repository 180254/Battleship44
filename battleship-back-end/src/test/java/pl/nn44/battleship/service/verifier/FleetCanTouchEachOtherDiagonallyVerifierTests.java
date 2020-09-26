package pl.nn44.battleship.service.verifier;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import pl.nn44.battleship.gamerules.FleetMode;
import pl.nn44.battleship.gamerules.FleetSizes;
import pl.nn44.battleship.gamerules.GameRules;
import pl.nn44.battleship.model.Grid;

public class FleetCanTouchEachOtherDiagonallyVerifierTests {

  private final FleetVerifier fleetVerifier;

  {
    GameRules gameRules = new GameRules();
    gameRules.setFleetMode(FleetMode.CURVED);
    gameRules.setFleetSizes(FleetSizes.RUSSIAN);
    gameRules.setFleetCanTouchEachOtherDiagonally(true);
    fleetVerifier = FleetVerifierFactory.forRules(gameRules);
  }

  @Test
  public void verify_noFleet() {
    Grid grid = new Grid(3, 3, new int[]{
        0, 0, 0,
        0, 0, 0,
        0, 0, 0
    });

    Assertions.assertFalse(fleetVerifier.verify(grid));
  }

  @Test
  public void verify_oneFleet() {
    Grid grid = new Grid(3, 3, new int[]{
        0, 0, 0,
        0, 1, 1,
        0, 0, 0
    });

    Assertions.assertFalse(fleetVerifier.verify(grid));
  }

  @Test
  public void verify_properFleetNumber_straight() {
    Grid grid = new Grid(10, 10, new int[]{
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 1, 0, 1, 0, 0, 0, 1, 0, 0,
        0, 1, 0, 1, 0, 0, 0, 0, 0, 0,
        0, 1, 0, 1, 0, 0, 0, 0, 0, 0,
        0, 1, 0, 0, 0, 1, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 1, 0, 0,
        0, 1, 1, 1, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 1, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
        0, 0, 0, 1, 1, 0, 0, 0, 0, 0,
    });

    Assertions.assertTrue(fleetVerifier.verify(grid));
  }


  @Test
  public void verify_properFleetNumber_curved() {
    Grid grid = new Grid(10, 10, new int[]{
        0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
        0, 1, 0, 1, 0, 0, 0, 0, 0, 0,
        0, 1, 0, 1, 1, 0, 0, 0, 0, 0,
        1, 1, 0, 0, 0, 1, 0, 1, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
        0, 1, 1, 1, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 1, 0, 1, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    });

    Assertions.assertTrue(fleetVerifier.verify(grid));
  }
}
