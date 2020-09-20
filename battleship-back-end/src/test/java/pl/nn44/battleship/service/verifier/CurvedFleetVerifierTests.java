package pl.nn44.battleship.service.verifier;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import pl.nn44.battleship.configuration.GameProperties.FleetType;
import pl.nn44.battleship.model.Grid;

public class CurvedFleetVerifierTests {

  private final FleetVerifier fleetVerifier = FleetVerifierFactory.forType(
      FleetType.Mode.CURVED, FleetType.Sizes.RUSSIAN);

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
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 1, 0, 1, 0, 0, 0, 1, 0, 0,
        0, 1, 0, 1, 0, 0, 0, 0, 0, 0,
        0, 1, 0, 1, 0, 0, 0, 1, 0, 0,
        0, 1, 0, 0, 0, 1, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 1, 0, 0,
        0, 1, 1, 1, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 1, 0, 1, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    });

    Assertions.assertTrue(fleetVerifier.verify(grid));
  }

  @Test
  public void verify_properFleetNumber_straight_collision() {
    Grid grid = new Grid(10, 10, new int[]{
        0, 0, 0, 0, 0, 1, 1, 0, 0, 0,
        0, 1, 0, 1, 0, 0, 0, 1, 0, 0,
        0, 1, 0, 1, 0, 0, 0, 0, 0, 0,
        0, 1, 0, 1, 0, 0, 0, 1, 0, 0,
        0, 1, 0, 0, 0, 1, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 1, 0, 0,
        0, 1, 1, 1, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 1, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    });

    Assertions.assertFalse(fleetVerifier.verify(grid));
  }

  @Test
  public void verify_properFleetNumber_curved() {
    Grid grid = new Grid(10, 10, new int[]{
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 1, 0, 1, 0, 0, 0, 1, 0, 0,
        0, 1, 0, 1, 1, 0, 0, 0, 0, 0,
        1, 1, 0, 0, 0, 0, 0, 1, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 1, 0, 0,
        0, 1, 1, 1, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 1, 0, 1, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    });

    Assertions.assertTrue(fleetVerifier.verify(grid));
  }

  @Test
  public void verify_properFleetNumber_curved_noSpaceAround() {
    Grid grid = new Grid(10, 10, new int[]{
        0, 0, 1, 1, 0, 0, 0, 0, 0, 0,
        0, 1, 0, 1, 0, 0, 0, 1, 0, 0,
        0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
        1, 1, 0, 0, 0, 0, 0, 1, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 1, 0, 0,
        0, 1, 1, 1, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 1, 0, 1, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    });

    Assertions.assertFalse(fleetVerifier.verify(grid));
  }

  @Test
  public void verify_properFleetNumber_andIllegalCode_minus() {
    Grid grid = new Grid(10, 10, new int[]{
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, -1, 0, 1, 0, 0, 0, 1, 0, 0,
        0, 1, 0, 1, 1, 0, 0, 0, 0, 0,
        1, 1, 0, 0, 0, 0, 0, 1, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 1, 0, 0,
        0, 1, 1, 1, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 1, 0, 1, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    });

    Assertions.assertFalse(fleetVerifier.verify(grid));
  }

  @Test
  public void verify_properFleetNumber_andIllegalCode_9() {
    Grid grid = new Grid(10, 10, new int[]{
        0, 0, 0, 0, 0, 0, 0, 0, 0, 9,
        0, 1, 0, 1, 0, 0, 0, 1, 0, 0,
        0, 1, 0, 1, 1, 0, 0, 0, 0, 0,
        1, 1, 0, 0, 0, 0, 0, 1, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 1, 0, 0,
        0, 1, 1, 1, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 1, 0, 1, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    });

    Assertions.assertFalse(fleetVerifier.verify(grid));
  }
}
