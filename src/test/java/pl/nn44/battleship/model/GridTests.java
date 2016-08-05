package pl.nn44.battleship.model;

import org.junit.Assert;
import org.junit.Test;

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
    public void newGrid_properSize_square() {
        int[] cells = CELLS_33.clone();
        new Grid(3, 3, cells);
    }

    @Test
    public void newGrid_properSize_notSquare() {
        int[] cells = CELLS_34.clone();
        new Grid(3, 4, cells);
    }

    @Test(expected = IllegalArgumentException.class)
    public void newGrid_wrongSize_square() {
        int[] cells = CELLS_33.clone();
        new Grid(3, 4, cells);
    }

    @Test(expected = IllegalArgumentException.class)
    public void newGrid_wrongSize_notSquare() {
        int[] cells = CELLS_34.clone();
        new Grid(3, 5, cells);
    }

    @Test(expected = IllegalArgumentException.class)
    public void newGrid_wrongSize_zeroX() {
        int[] cells = CELLS_33.clone();
        new Grid(0, 2, cells);
    }

    @Test(expected = IllegalArgumentException.class)
    public void newGrid_wrongSize_zeroY() {
        int[] cells = CELLS_33.clone();
        new Grid(3, 0, cells);
    }

    @Test
    public void getCell_first() {
        int[] cells = CELLS_33.clone();
        Grid grid = new Grid(3, 3, cells);

        Coord cellCord = new Coord(0, 0);
        Cell cell = grid.getCell(cellCord);

        Assert.assertSame(Cell.Type.getByCode(0), cell.getType());
        Assert.assertSame(cellCord, cell.getCoord());
    }

    @Test
    public void getCell_last() {
        int[] cells = CELLS_23.clone();
        Grid grid = new Grid(2, 3, cells);

        Coord cellCord = new Coord(1, 2);
        Cell cell = grid.getCell(cellCord);

        Assert.assertSame(Cell.Type.getByCode(1), cell.getType());
        Assert.assertSame(cellCord, cell.getCoord());
    }

    @Test
    public void getCell_lastInRow() {
        int[] cells = CELLS_34.clone();
        Grid grid = new Grid(3, 4, cells);

        Coord cellCord = new Coord(2, 2);
        Cell cell = grid.getCell(cellCord);

        Assert.assertSame(Cell.Type.getByCode(1), cell.getType());
        Assert.assertSame(cellCord, cell.getCoord());
    }

    @Test
    public void getCell_firstInRow() {
        int[] cells = CELLS_34.clone();
        Grid grid = new Grid(3, 4, cells);

        Coord cellCord = new Coord(0, 1);
        Cell cell = grid.getCell(cellCord);

        Assert.assertSame(Cell.Type.getByCode(0), cell.getType());
        Assert.assertSame(cellCord, cell.getCoord());
    }

    @Test
    public void getCell_some() {
        int[] cells = CELLS_34.clone();
        Grid grid = new Grid(3, 4, cells);

        Coord cellCord = new Coord(1, 1);
        Cell cell = grid.getCell(cellCord);

        Assert.assertSame(Cell.Type.getByCode(1), cell.getType());
        Assert.assertSame(cellCord, cell.getCoord());
    }

    @Test(expected = IllegalArgumentException.class)
    public void getCell_outOfGrid_X() {
        int[] cells = CELLS_33.clone();
        Grid grid = new Grid(3, 3, cells);

        Coord cellCord = new Coord(3, 0);
        grid.getCell(cellCord);
    }


    @Test(expected = IllegalArgumentException.class)
    public void getCell_outOfGrid_Y() {
        int[] cells = CELLS_33.clone();
        Grid grid = new Grid(3, 3, cells);

        Coord cellCord = new Coord(0, 3);
        grid.getCell(cellCord);
    }

    @Test(expected = IllegalArgumentException.class)
    public void getCell_minusX() {
        int[] cells = CELLS_33.clone();
        Grid grid = new Grid(3, 3, cells);

        Coord cellCord = new Coord(-1, 0);
        grid.getCell(cellCord);
    }

    @Test(expected = IllegalArgumentException.class)
    public void getCell_minusY() {
        int[] cells = CELLS_33.clone();
        Grid grid = new Grid(3, 3, cells);

        Coord cellCord = new Coord(0, -1);
        grid.getCell(cellCord);
    }

    @Test
    public void getNeighboursPlus_allInGrid() {
        int[] cells = CELLS_33.clone();
        Grid grid = new Grid(3, 3, cells);

        Coord coord = new Coord(1, 1);
        List<Cell> neighbours = grid.getNeighboursPlus(coord);
        List<Coord> coordNeighbours = coord.neighboursPlus();

        Assert.assertSame(4, neighbours.size());

        for (Cell neighbour : neighbours) {
            Assert.assertTrue(coordNeighbours.contains(neighbour.getCoord()));
        }
    }

    @Test
    public void getNeighboursPlus_someOutOfGrid_top() {
        int[] cells = CELLS_33.clone();
        Grid grid = new Grid(3, 3, cells);

        Coord coord = new Coord(1, 0);
        List<Cell> neighbours = grid.getNeighboursPlus(coord);

        Assert.assertSame(3, neighbours.size());
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(0, 0))));
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(2, 0))));
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(1, 1))));
    }

    @Test
    public void getNeighboursPlus_someOutOfGrid_left() {
        int[] cells = CELLS_33.clone();
        Grid grid = new Grid(3, 3, cells);

        Coord coord = new Coord(0, 1);
        List<Cell> neighbours = grid.getNeighboursPlus(coord);

        Assert.assertSame(3, neighbours.size());
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(0, 0))));
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(0, 2))));
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(1, 1))));
    }

    @Test
    public void getNeighboursPlus_someOutOfGrid_right() {
        int[] cells = CELLS_33.clone();
        Grid grid = new Grid(3, 3, cells);

        Coord coord = new Coord(2, 1);
        List<Cell> neighbours = grid.getNeighboursPlus(coord);

        Assert.assertSame(3, neighbours.size());
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(2, 0))));
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(2, 2))));
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(1, 1))));
    }

    @Test
    public void getNeighboursPlus_someOutOfGrid_bottom() {
        int[] cells = CELLS_33.clone();
        Grid grid = new Grid(3, 3, cells);

        Coord coord = new Coord(1, 2);
        List<Cell> neighbours = grid.getNeighboursPlus(coord);

        Assert.assertSame(3, neighbours.size());
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(0, 2))));
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(2, 2))));
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(1, 1))));
    }

    @Test
    public void getNeighboursPlus_someOutOfGrid_topLeft() {
        int[] cells = CELLS_43.clone();
        Grid grid = new Grid(4, 3, cells);

        Coord coord = new Coord(0, 0);
        List<Cell> neighbours = grid.getNeighboursPlus(coord);

        Assert.assertSame(2, neighbours.size());
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(0, 1))));
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(1, 0))));
    }

    @Test
    public void getNeighboursPlus_someOutOfGrid_topRight() {
        int[] cells = CELLS_43.clone();
        Grid grid = new Grid(4, 3, cells);

        Coord coord = new Coord(3, 0);
        List<Cell> neighbours = grid.getNeighboursPlus(coord);

        Assert.assertSame(2, neighbours.size());
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(2, 0))));
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(3, 1))));
    }

    @Test
    public void getNeighboursPlus_someOutOfGrid_bottomLeft() {
        int[] cells = CELLS_43.clone();
        Grid grid = new Grid(4, 3, cells);

        Coord coord = new Coord(0, 2);
        List<Cell> neighbours = grid.getNeighboursPlus(coord);

        Assert.assertSame(2, neighbours.size());
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(0, 1))));
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(1, 2))));
    }

    @Test
    public void getNeighboursPlus_someOutOfGrid_bottomRight() {
        int[] cells = CELLS_43.clone();
        Grid grid = new Grid(4, 3, cells);

        Coord coord = new Coord(3, 2);
        List<Cell> neighbours = grid.getNeighboursPlus(coord);

        Assert.assertSame(2, neighbours.size());
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(3, 1))));
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(2, 2))));
    }

    @Test
    public void getNeighboursX_allInGrid() {
        int[] cells = CELLS_43.clone();
        Grid grid = new Grid(4, 3, cells);

        Coord coord = new Coord(2, 1);
        List<Cell> neighbours = grid.getNeighboursX(coord);
        List<Coord> coordNeighbours = coord.neighboursX();

        Assert.assertSame(4, neighbours.size());

        for (Cell neighbour : neighbours) {
            Assert.assertTrue(coordNeighbours.contains(neighbour.getCoord()));
        }
    }

    @Test
    public void getNeighboursX_someOutOfGrid_top() {
        int[] cells = CELLS_43.clone();
        Grid grid = new Grid(4, 3, cells);

        Coord coord = new Coord(1, 0);
        List<Cell> neighbours = grid.getNeighboursX(coord);

        Assert.assertSame(2, neighbours.size());
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(0, 1))));
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(2, 1))));
    }

    @Test
    public void getNeighboursX_someOutOfGrid_left() {
        int[] cells = CELLS_43.clone();
        Grid grid = new Grid(4, 3, cells);

        Coord coord = new Coord(3, 1);
        List<Cell> neighbours = grid.getNeighboursX(coord);

        Assert.assertSame(2, neighbours.size());
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(2, 0))));
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(2, 2))));

    }

    @Test
    public void getNeighboursX_someOutOfGrid_right() {
        int[] cells = CELLS_43.clone();
        Grid grid = new Grid(4, 3, cells);

        Coord coord = new Coord(0, 1);
        List<Cell> neighbours = grid.getNeighboursX(coord);

        Assert.assertSame(2, neighbours.size());
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(1, 0))));
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(1, 2))));
    }

    @Test
    public void getNeighboursX_someOutOfGrid_bottom() {
        int[] cells = CELLS_43.clone();
        Grid grid = new Grid(4, 3, cells);

        Coord coord = new Coord(2, 2);
        List<Cell> neighbours = grid.getNeighboursX(coord);

        Assert.assertSame(2, neighbours.size());
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(1, 1))));
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(3, 1))));
    }

    @Test
    public void getNeighboursX_someOutOfGrid_topLeft() {
        int[] cells = CELLS_43.clone();
        Grid grid = new Grid(4, 3, cells);

        Coord coord = new Coord(0, 0);
        List<Cell> neighbours = grid.getNeighboursX(coord);

        Assert.assertSame(1, neighbours.size());
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(1, 1))));
    }

    @Test
    public void getNeighboursX_someOutOfGrid_topRight() {
        int[] cells = CELLS_43.clone();
        Grid grid = new Grid(4, 3, cells);

        Coord coord = new Coord(3, 0);
        List<Cell> neighbours = grid.getNeighboursX(coord);

        Assert.assertSame(1, neighbours.size());
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(2, 1))));
    }

    @Test
    public void getNeighboursX_someOutOfGrid_bottomLeft() {
        int[] cells = CELLS_43.clone();
        Grid grid = new Grid(4, 3, cells);

        Coord coord = new Coord(0, 2);
        List<Cell> neighbours = grid.getNeighboursX(coord);

        Assert.assertSame(1, neighbours.size());
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(1, 1))));
    }

    @Test
    public void getNeighboursX_someOutOfGrid_bottomRight() {
        int[] cells = CELLS_43.clone();
        Grid grid = new Grid(4, 3, cells);

        Coord coord = new Coord(3, 2);
        List<Cell> neighbours = grid.getNeighboursX(coord);

        Assert.assertSame(1, neighbours.size());
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(2, 1))));
    }

}
