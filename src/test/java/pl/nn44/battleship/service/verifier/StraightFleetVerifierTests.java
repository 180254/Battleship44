package pl.nn44.battleship.service.verifier;

import org.junit.Assert;
import org.junit.Test;
import pl.nn44.battleship.configuration.GameProperties;
import pl.nn44.battleship.model.Grid;

public class StraightFleetVerifierTests {

    private final FleetVerifier fleetVerifier = FleetVerifierFactory.forType(
            GameProperties.FleetType.Mode.STRAIGHT, GameProperties.FleetType.Sizes.RUSSIAN);

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

        Assert.assertEquals(true, fleetVerifier.verify(grid));
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

        Assert.assertEquals(true, fleetVerifier.verify(grid));
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

        Assert.assertEquals(false, fleetVerifier.verify(grid));
    }
}
