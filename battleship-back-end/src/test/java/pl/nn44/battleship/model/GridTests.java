package pl.nn44.battleship.model;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.List;

public class GridTests {

  private final int[] CELLS_23 = {
      0, 1,
      1, 0,
      0, 1
  };
  private final int[] CELLS_33 = {
      0, 1, 0,
      1, 0, 1,
      0, 1, 0,
  };
  private final int[] CELLS_34 = {
      1, 0, 1,
      0, 1, 0,
      1, 0, 1,
      0, 1, 0
  };
  private final int[] CELLS_43 = {
      0, 0, 0, 1,
      1, 1, 0, 0,
      0, 0, 0, 1
  };

  @Test
  public void getCell_first() {
    int[] cells = CELLS_33.clone();
    Grid grid = new Grid(3, 3, cells);

    Coord cellCord = new Coord(0, 0);
    Cell cell = grid.getCell(cellCord);

    Assertions.assertSame(Cell.Type.getByCode(0), cell.getType());
    Assertions.assertSame(cellCord, cell.getCoord());
  }

  @Test
  public void getCell_last() {
    int[] cells = CELLS_23.clone();
    Grid grid = new Grid(3, 2, cells);

    Coord cellCord = new Coord(2, 1);
    Cell cell = grid.getCell(cellCord);

    Assertions.assertSame(Cell.Type.getByCode(1), cell.getType());
    Assertions.assertSame(cellCord, cell.getCoord());
  }

  @Test
  public void getCell_lastInRow() {
    int[] cells = CELLS_34.clone();
    Grid grid = new Grid(4, 3, cells);

    Coord cellCord = new Coord(2, 2);
    Cell cell = grid.getCell(cellCord);

    Assertions.assertSame(Cell.Type.getByCode(1), cell.getType());
    Assertions.assertSame(cellCord, cell.getCoord());
  }

  @Test
  public void getCell_firstInRow() {
    int[] cells = CELLS_34.clone();
    Grid grid = new Grid(4, 3, cells);

    Coord cellCord = new Coord(1, 0);
    Cell cell = grid.getCell(cellCord);

    Assertions.assertSame(Cell.Type.getByCode(0), cell.getType());
    Assertions.assertSame(cellCord, cell.getCoord());
  }

  @Test
  public void getCell_some() {
    int[] cells = CELLS_34.clone();
    Grid grid = new Grid(4, 3, cells);

    Coord cellCord = new Coord(1, 1);
    Cell cell = grid.getCell(cellCord);

    Assertions.assertSame(Cell.Type.getByCode(1), cell.getType());
    Assertions.assertSame(cellCord, cell.getCoord());
  }

  @Test
  public void getNeighboursPlus_allInGrid() {
    int[] cells = CELLS_33.clone();
    Grid grid = new Grid(3, 3, cells);

    Coord coord = new Coord(1, 1);
    List<Cell> neighbours = grid.neighboursPlus(coord);
    List<Coord> coordNeighbours = coord.neighboursPlus();

    Assertions.assertSame(4, neighbours.size());

    for (Cell neighbour : neighbours) {
      Assertions.assertTrue(coordNeighbours.contains(neighbour.getCoord()));
    }
  }

  @Test
  public void getNeighboursPlus_someOutOfGrid_top() {
    int[] cells = CELLS_33.clone();
    Grid grid = new Grid(3, 3, cells);

    Coord coord = new Coord(0, 1);
    List<Cell> neighbours = grid.neighboursPlus(coord);

    Assertions.assertSame(3, neighbours.size());
    Assertions.assertTrue(neighbours.contains(grid.getCell(new Coord(0, 0))));
    Assertions.assertTrue(neighbours.contains(grid.getCell(new Coord(0, 2))));
    Assertions.assertTrue(neighbours.contains(grid.getCell(new Coord(1, 1))));
  }

  @Test
  public void getNeighboursPlus_someOutOfGrid_left() {
    int[] cells = CELLS_33.clone();
    Grid grid = new Grid(3, 3, cells);

    Coord coord = new Coord(1, 0);
    List<Cell> neighbours = grid.neighboursPlus(coord);

    Assertions.assertSame(3, neighbours.size());
    Assertions.assertTrue(neighbours.contains(grid.getCell(new Coord(0, 0))));
    Assertions.assertTrue(neighbours.contains(grid.getCell(new Coord(2, 0))));
    Assertions.assertTrue(neighbours.contains(grid.getCell(new Coord(1, 1))));
  }

  @Test
  public void getNeighboursPlus_someOutOfGrid_right() {
    int[] cells = CELLS_33.clone();
    Grid grid = new Grid(3, 3, cells);

    Coord coord = new Coord(1, 2);
    List<Cell> neighbours = grid.neighboursPlus(coord);

    Assertions.assertSame(3, neighbours.size());
    Assertions.assertTrue(neighbours.contains(grid.getCell(new Coord(0, 2))));
    Assertions.assertTrue(neighbours.contains(grid.getCell(new Coord(2, 2))));
    Assertions.assertTrue(neighbours.contains(grid.getCell(new Coord(1, 1))));
  }

  @Test
  public void getNeighboursPlus_someOutOfGrid_bottom() {
    int[] cells = CELLS_33.clone();
    Grid grid = new Grid(3, 3, cells);

    Coord coord = new Coord(2, 1);
    List<Cell> neighbours = grid.neighboursPlus(coord);

    Assertions.assertSame(3, neighbours.size());
    Assertions.assertTrue(neighbours.contains(grid.getCell(new Coord(2, 0))));
    Assertions.assertTrue(neighbours.contains(grid.getCell(new Coord(2, 2))));
    Assertions.assertTrue(neighbours.contains(grid.getCell(new Coord(1, 1))));
  }

  @Test
  public void getNeighboursPlus_someOutOfGrid_topLeft() {
    int[] cells = CELLS_43.clone();
    Grid grid = new Grid(3, 4, cells);

    Coord coord = new Coord(0, 0);
    List<Cell> neighbours = grid.neighboursPlus(coord);

    Assertions.assertSame(2, neighbours.size());
    Assertions.assertTrue(neighbours.contains(grid.getCell(new Coord(1, 0))));
    Assertions.assertTrue(neighbours.contains(grid.getCell(new Coord(0, 1))));
  }

  @Test
  public void getNeighboursPlus_someOutOfGrid_topRight() {
    int[] cells = CELLS_43.clone();
    Grid grid = new Grid(3, 4, cells);

    Coord coord = new Coord(0, 3);
    List<Cell> neighbours = grid.neighboursPlus(coord);

    Assertions.assertSame(2, neighbours.size());
    Assertions.assertTrue(neighbours.contains(grid.getCell(new Coord(0, 2))));
    Assertions.assertTrue(neighbours.contains(grid.getCell(new Coord(1, 3))));
  }

  @Test
  public void getNeighboursPlus_someOutOfGrid_bottomLeft() {
    int[] cells = CELLS_43.clone();
    Grid grid = new Grid(3, 4, cells);

    Coord coord = new Coord(2, 0);
    List<Cell> neighbours = grid.neighboursPlus(coord);

    Assertions.assertSame(2, neighbours.size());
    Assertions.assertTrue(neighbours.contains(grid.getCell(new Coord(1, 0))));
    Assertions.assertTrue(neighbours.contains(grid.getCell(new Coord(2, 1))));
  }

  @Test
  public void getNeighboursPlus_someOutOfGrid_bottomRight() {
    int[] cells = CELLS_43.clone();
    Grid grid = new Grid(3, 4, cells);

    Coord coord = new Coord(2, 3);
    List<Cell> neighbours = grid.neighboursPlus(coord);

    Assertions.assertSame(2, neighbours.size());
    Assertions.assertTrue(neighbours.contains(grid.getCell(new Coord(1, 3))));
    Assertions.assertTrue(neighbours.contains(grid.getCell(new Coord(2, 2))));
  }

  @Test
  public void getNeighboursX_allInGrid() {
    int[] cells = CELLS_43.clone();
    Grid grid = new Grid(3, 4, cells);

    Coord coord = new Coord(1, 2);
    List<Cell> neighbours = grid.neighboursX(coord);
    List<Coord> coordNeighbours = coord.neighboursX();

    Assertions.assertSame(4, neighbours.size());

    for (Cell neighbour : neighbours) {
      Assertions.assertTrue(coordNeighbours.contains(neighbour.getCoord()));
    }
  }

  @Test
  public void getNeighboursX_someOutOfGrid_top() {
    int[] cells = CELLS_43.clone();
    Grid grid = new Grid(3, 4, cells);

    Coord coord = new Coord(0, 1);
    List<Cell> neighbours = grid.neighboursX(coord);

    Assertions.assertSame(2, neighbours.size());
    Assertions.assertTrue(neighbours.contains(grid.getCell(new Coord(1, 0))));
    Assertions.assertTrue(neighbours.contains(grid.getCell(new Coord(1, 2))));
  }

  @Test
  public void getNeighboursX_someOutOfGrid_left() {
    int[] cells = CELLS_43.clone();
    Grid grid = new Grid(3, 4, cells);

    Coord coord = new Coord(1, 3);
    List<Cell> neighbours = grid.neighboursX(coord);

    Assertions.assertSame(2, neighbours.size());
    Assertions.assertTrue(neighbours.contains(grid.getCell(new Coord(0, 2))));
    Assertions.assertTrue(neighbours.contains(grid.getCell(new Coord(2, 2))));

  }

  @Test
  public void getNeighboursX_someOutOfGrid_right() {
    int[] cells = CELLS_43.clone();
    Grid grid = new Grid(3, 4, cells);

    Coord coord = new Coord(1, 0);
    List<Cell> neighbours = grid.neighboursX(coord);

    Assertions.assertSame(2, neighbours.size());
    Assertions.assertTrue(neighbours.contains(grid.getCell(new Coord(0, 1))));
    Assertions.assertTrue(neighbours.contains(grid.getCell(new Coord(2, 1))));
  }

  @Test
  public void getNeighboursX_someOutOfGrid_bottom() {
    int[] cells = CELLS_43.clone();
    Grid grid = new Grid(3, 4, cells);

    Coord coord = new Coord(2, 2);
    List<Cell> neighbours = grid.neighboursX(coord);

    Assertions.assertSame(2, neighbours.size());
    Assertions.assertTrue(neighbours.contains(grid.getCell(new Coord(1, 1))));
    Assertions.assertTrue(neighbours.contains(grid.getCell(new Coord(1, 3))));
  }

  @Test
  public void getNeighboursX_someOutOfGrid_topLeft() {
    int[] cells = CELLS_43.clone();
    Grid grid = new Grid(3, 4, cells);

    Coord coord = new Coord(0, 0);
    List<Cell> neighbours = grid.neighboursX(coord);

    Assertions.assertSame(1, neighbours.size());
    Assertions.assertTrue(neighbours.contains(grid.getCell(new Coord(1, 1))));
  }

  @Test
  public void getNeighboursX_someOutOfGrid_topRight() {
    int[] cells = CELLS_43.clone();
    Grid grid = new Grid(3, 4, cells);

    Coord coord = new Coord(0, 3);
    List<Cell> neighbours = grid.neighboursX(coord);

    Assertions.assertSame(1, neighbours.size());
    Assertions.assertTrue(neighbours.contains(grid.getCell(new Coord(1, 2))));
  }

  @Test
  public void getNeighboursX_someOutOfGrid_bottomLeft() {
    int[] cells = CELLS_43.clone();
    Grid grid = new Grid(3, 4, cells);

    Coord coord = new Coord(2, 0);
    List<Cell> neighbours = grid.neighboursX(coord);

    Assertions.assertSame(1, neighbours.size());
    Assertions.assertTrue(neighbours.contains(grid.getCell(new Coord(1, 1))));
  }

  @Test
  public void getNeighboursX_someOutOfGrid_bottomRight() {
    int[] cells = CELLS_43.clone();
    Grid grid = new Grid(3, 4, cells);

    Coord coord = new Coord(2, 3);
    List<Cell> neighbours = grid.neighboursX(coord);

    Assertions.assertSame(1, neighbours.size());
    Assertions.assertTrue(neighbours.contains(grid.getCell(new Coord(1, 2))));
  }

}
