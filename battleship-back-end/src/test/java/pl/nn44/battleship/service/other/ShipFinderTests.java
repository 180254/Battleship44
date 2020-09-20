package pl.nn44.battleship.service.other;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
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

    Assertions.assertEquals(1, ships.size());
    Assertions.assertEquals(3, ships.get(0).getSize());

    List<Coord> coords = ships.get(0).getCoords();
    Assertions.assertTrue(coords.contains(Coord.c(1, 0)));
    Assertions.assertTrue(coords.contains(Coord.c(2, 0)));
    Assertions.assertTrue(coords.contains(Coord.c(2, 1)));
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

    Assertions.assertEquals(6, surrounding.size());
    Assertions.assertTrue(surrounding.contains(Coord.c(1, 0)));
    Assertions.assertTrue(surrounding.contains(Coord.c(1, 1)));
    Assertions.assertTrue(surrounding.contains(Coord.c(1, 2)));
    Assertions.assertTrue(surrounding.contains(Coord.c(2, 2)));
    Assertions.assertTrue(surrounding.contains(Coord.c(3, 2)));
    Assertions.assertTrue(surrounding.contains(Coord.c(3, 1)));
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
    Assertions.assertEquals(ships.get(0), findShip);
  }
}
