package pl.nn44.battleship.model;

import org.junit.Assert;
import org.junit.Test;

import java.util.List;

public class GridTests {

    @Test
    public void newGrid_properSize_square() {
        int[] cells = {
                0, 0, 0,
                1, 1, 0,
                1, 0, 1,
        };
        new Grid(3, 3, cells);
    }

    @Test
    public void newGrid_properSize_notSquare() {
        int[] cells = {
                0, 0, 0,
                1, 1, 0,
                1, 0, 1,
                0, 0, 0
        };
        new Grid(3, 4, cells);
    }

    @Test(expected = IllegalArgumentException.class)
    public void newGrid_wrongSize_square() {
        int[] cells = {
                0, 0, 0,
                1, 1, 0,
                1, 0, 1,
        };
        new Grid(3, 4, cells);
    }

    @Test(expected = IllegalArgumentException.class)
    public void newGrid_wrongSize_notSquare() {
        int[] cells = {
                0, 0, 0,
                1, 1, 0,
                1, 0, 1,
                0, 0, 0, 2
        };
        new Grid(3, 5, cells);
    }

    @Test(expected = IllegalArgumentException.class)
    public void newGrid_wrongSize_zeroX() {
        int[] cells = {
                0, 0, 0,
                1, 1, 0,
        };
        new Grid(0, 2, cells);
    }

    @Test(expected = IllegalArgumentException.class)
    public void newGrid_wrongSize_zeroY() {
        int[] cells = {
                0, 0, 0,
                1, 1, 0,
        };
        new Grid(3, 0, cells);
    }


    @Test
    public void getCell_first() {
        int[] cells = {
                1, 0, 0,
                0, 0, 0,
        };
        Grid grid = new Grid(3, 2, cells);

        Coord cellCord = new Coord(0, 0);
        Cell cell = grid.getCell(cellCord);

        Assert.assertSame(Cell.Type.getByCode(1), cell.getType());
        Assert.assertSame(cellCord, cell.getCoord());
    }

    @Test
    public void getCell_last() {
        int[] cells = {
                0, 0, 0,
                0, 0, 1,
        };
        Grid grid = new Grid(3, 2, cells);

        Coord cellCord = new Coord(2, 1);
        Cell cell = grid.getCell(cellCord);

        Assert.assertSame(Cell.Type.getByCode(1), cell.getType());
        Assert.assertSame(cellCord, cell.getCoord());
    }

    @Test
    public void getCell_lastInRow() {
        int[] cells = {
                0, 0, 0,
                0, 0, 1,
                0, 0, 0,
                0, 0, 0,
        };
        Grid grid = new Grid(3, 4, cells);

        Coord cellCord = new Coord(2, 1);
        Cell cell = grid.getCell(cellCord);

        Assert.assertSame(Cell.Type.getByCode(1), cell.getType());
        Assert.assertSame(cellCord, cell.getCoord());
    }

    @Test
    public void getCell_firstInRow() {
        int[] cells = {
                0, 0, 0,
                1, 0, 0,
                0, 0, 0,
        };
        Grid grid = new Grid(3, 3, cells);

        Coord cellCord = new Coord(0, 1);
        Cell cell = grid.getCell(cellCord);

        Assert.assertSame(Cell.Type.getByCode(1), cell.getType());
        Assert.assertSame(cellCord, cell.getCoord());
    }

    @Test(expected = IllegalArgumentException.class)
    public void getCell_outOfGrid_X() {
        int[] cells = {
                0, 0, 0,
                1, 0, 0,
                0, 0, 0,
        };
        Grid grid = new Grid(3, 3, cells);

        Coord cellCord = new Coord(3, 0);
        grid.getCell(cellCord);
    }


    @Test(expected = IllegalArgumentException.class)
    public void getCell_outOfGrid_Y() {
        int[] cells = {
                0, 0, 0,
                1, 0, 0,
                0, 0, 0,
        };
        Grid grid = new Grid(3, 3, cells);

        Coord cellCord = new Coord(0, 3);
        grid.getCell(cellCord);
    }

    @Test(expected = IllegalArgumentException.class)
    public void getCell_minusX() {
        int[] cells = {
                0, 0, 0,
                1, 0, 0,
                0, 0, 0,
        };
        Grid grid = new Grid(3, 3, cells);

        Coord cellCord = new Coord(-1, 0);
        grid.getCell(cellCord);
    }

    @Test(expected = IllegalArgumentException.class)
    public void getCell_minusY() {
        int[] cells = {
                0, 0, 0,
                1, 0, 0,
                0, 0, 0,
        };
        Grid grid = new Grid(3, 3, cells);

        Coord cellCord = new Coord(0, -1);
        grid.getCell(cellCord);
    }

    @Test
    public void getNeighboursPlus_allInGrid() {
        int[] cells = {
                0, 0, 0,
                1, 1, 0,
                0, 0, 0,
        };
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
        int[] cells = {
                0, 0, 0,
                1, 1, 0,
                0, 0, 0,
        };
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
        int[] cells = {
                0, 0, 0,
                1, 1, 0,
                0, 0, 0,
        };
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
        int[] cells = {
                0, 0, 0,
                1, 1, 0,
                0, 0, 0,
        };
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
        int[] cells = {
                0, 0, 0,
                1, 1, 0,
                0, 0, 0,
        };
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
        int[] cells = {
                0, 0, 0, 1,
                1, 1, 0, 0,
                0, 0, 0, 1
        };
        Grid grid = new Grid(4, 3, cells);

        Coord coord = new Coord(0, 0);
        List<Cell> neighbours = grid.getNeighboursPlus(coord);

        Assert.assertSame(2, neighbours.size());
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(0, 1))));
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(1, 0))));
    }

    @Test
    public void getNeighboursPlus_someOutOfGrid_topRight() {
        int[] cells = {
                0, 0, 0, 1,
                1, 1, 0, 0,
                0, 0, 0, 1
        };
        Grid grid = new Grid(4, 3, cells);

        Coord coord = new Coord(3, 0);
        List<Cell> neighbours = grid.getNeighboursPlus(coord);

        Assert.assertSame(2, neighbours.size());
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(2, 0))));
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(3, 1))));
    }

    @Test
    public void getNeighboursPlus_someOutOfGrid_bottomLeft() {
        int[] cells = {
                0, 0, 0, 1,
                1, 1, 0, 0,
                0, 0, 0, 1
        };
        Grid grid = new Grid(4, 3, cells);

        Coord coord = new Coord(0, 2);
        List<Cell> neighbours = grid.getNeighboursPlus(coord);

        Assert.assertSame(2, neighbours.size());
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(0, 1))));
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(1, 2))));
    }

    @Test
    public void getNeighboursPlus_someOutOfGrid_bottomRight() {
        int[] cells = {
                0, 0, 0, 1,
                1, 1, 0, 0,
                0, 0, 0, 1
        };
        Grid grid = new Grid(4, 3, cells);

        Coord coord = new Coord(3, 2);
        List<Cell> neighbours = grid.getNeighboursPlus(coord);

        Assert.assertSame(2, neighbours.size());
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(3, 1))));
        Assert.assertTrue(neighbours.contains(grid.getCell(new Coord(2, 2))));
    }
}
