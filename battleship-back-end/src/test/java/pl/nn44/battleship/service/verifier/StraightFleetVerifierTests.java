package pl.nn44.battleship.service.verifier;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import pl.nn44.battleship.gamerules.FleetMode;
import pl.nn44.battleship.gamerules.FleetSizes;
import pl.nn44.battleship.gamerules.GameRules;
import pl.nn44.battleship.gamerules.GridSize;
import pl.nn44.battleship.model.Grid;
import pl.nn44.battleship.service.FleetVerifier;
import pl.nn44.battleship.service.FleetVerifierFactory;

public class StraightFleetVerifierTests {

  private final FleetVerifier fleetVerifier;

  {
    GameRules gameRules = new GameRules(
        new GridSize(10, 10),
        FleetMode.STRAIGHT,
        FleetSizes.RUSSIAN,
        false,
        false);
    fleetVerifier = FleetVerifierFactory.forRules(gameRules);
  }

  @Test
  public void verify_straight_valid() {
    Grid grid = new Grid(10, 10, new int[]{
        1, 0, 1, 0, 1, 0, 1, 0, 0, 0,
        1, 0, 1, 0, 1, 0, 0, 0, 0, 0,
        1, 0, 1, 0, 0, 0, 1, 0, 0, 0,
        1, 0, 0, 0, 1, 0, 0, 0, 0, 0,
        0, 0, 1, 0, 1, 0, 1, 0, 0, 0,
        0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 0, 1, 0, 1, 0, 0, 0,
        0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    });

    Assertions.assertTrue(fleetVerifier.verify(grid));
  }

  @Test
  public void verify_straight_verticallyAndHorizontally_valid() {
    Grid grid = new Grid(10, 10, new int[]{
        1, 0, 1, 0, 1, 0, 1, 0, 0, 0,
        1, 0, 1, 0, 1, 0, 0, 0, 0, 0,
        1, 0, 1, 0, 0, 0, 1, 0, 0, 0,
        1, 0, 0, 0, 1, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 1, 0, 1, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 1, 0, 1, 0, 0, 0,
        0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
    });

    Assertions.assertTrue(fleetVerifier.verify(grid));
  }

  @Test
  public void verify_curved_invalid() {
    Grid grid = new Grid(10, 10, new int[]{
        1, 0, 1, 0, 1, 0, 1, 0, 0, 0,
        1, 0, 1, 0, 1, 0, 0, 0, 0, 0,
        1, 0, 1, 0, 0, 0, 1, 0, 0, 0,
        1, 0, 0, 0, 1, 0, 0, 0, 0, 0,
        0, 0, 1, 0, 1, 0, 1, 0, 0, 0,
        0, 1, 1, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 1, 0, 1, 0, 0, 0,
        0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    });

    Assertions.assertFalse(fleetVerifier.verify(grid));
  }
}
