package pl.nn44.battleship.service;

import org.junit.Assert;
import org.junit.Test;
import pl.nn44.battleship.model.Grid;

public class FleetVerifierCurvedTest {

    private final FleetVerifier fleetVerifier = FleetVerifierFactory.curvedRussian();

    @Test
    public void verify_noFleet() {
        Grid grid = new Grid(3, 3, new int[]{
                0, 0, 0,
                0, 0, 0,
                0, 0, 0
        });

        Assert.assertSame(false, fleetVerifier.verify(grid));
    }

    @Test
    public void verify_oneFleet() {
        Grid grid = new Grid(3, 3, new int[]{
                0, 0, 0,
                0, 1, 1,
                0, 0, 0
        });

        Assert.assertSame(false, fleetVerifier.verify(grid));
    }

    @Test
    public void verify_properFleet_straight() {
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

        Assert.assertSame(true, fleetVerifier.verify(grid));
    }

    @Test
    public void verify_properFleet_straight_collision() {
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

        Assert.assertSame(false, fleetVerifier.verify(grid));
    }

    @Test
    public void verify_properFleet_curved() {
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

        Assert.assertSame(true, fleetVerifier.verify(grid));
    }

    @Test
    public void verify_properFleet_curved_collision() {
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

        Assert.assertSame(false, fleetVerifier.verify(grid));
    }
}
