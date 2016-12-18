package pl.nn44.battleship.service.other;

import org.junit.Assert;
import org.junit.Test;
import pl.nn44.battleship.model.Coord;
import pl.nn44.battleship.model.Grid;
import pl.nn44.battleship.model.Ship;

import java.util.List;

public class ShipFinderTests {

    @Test
    public void ships_shipFound() {
        Grid grid = new Grid(3, 3, new int[]{
                0, 0, 0,
                1, 0, 0,
                1, 1, 0
        });
        ShipFinder shipFinder = ShipFinder.forGrid(grid);
        List<Ship> ships = shipFinder.ships();

        Assert.assertEquals(1, ships.size());
        Assert.assertEquals(3, ships.get(0).getSize());

        List<Coord> coords = ships.get(0).getCoords();
        Assert.assertTrue(coords.contains(Coord.c(1, 0)));
        Assert.assertTrue(coords.contains(Coord.c(2, 0)));
        Assert.assertTrue(coords.contains(Coord.c(2, 1)));
    }

    @Test
    public void surrounding_check() {
        Grid grid = new Grid(4, 4, new int[]{
                0, 0, 0, 0,
                0, 0, 0, 0,
                1, 1, 0, 0,
                1, 0, 0, 0
        });
        ShipFinder shipFinder = ShipFinder.forGrid(grid);
        List<Ship> ships = shipFinder.ships();
        List<Coord> surrounding = shipFinder.surrounding(ships.get(0));

        Assert.assertEquals(6, surrounding.size());
        Assert.assertTrue(surrounding.contains(Coord.c(1, 0)));
        Assert.assertTrue(surrounding.contains(Coord.c(1, 1)));
        Assert.assertTrue(surrounding.contains(Coord.c(1, 2)));
        Assert.assertTrue(surrounding.contains(Coord.c(2, 2)));
        Assert.assertTrue(surrounding.contains(Coord.c(3, 2)));
        Assert.assertTrue(surrounding.contains(Coord.c(3, 1)));
    }

    @Test
    public void findShip_check() {
        Grid grid = new Grid(3, 3, new int[]{
                0, 0, 0,
                1, 0, 0,
                1, 1, 0
        });
        ShipFinder shipFinder = ShipFinder.forGrid(grid);
        List<Ship> ships = shipFinder.ships();

        Ship findShip = shipFinder.findShip(Coord.c(2, 0));
        Assert.assertEquals(ships.get(0), findShip);
    }
}
