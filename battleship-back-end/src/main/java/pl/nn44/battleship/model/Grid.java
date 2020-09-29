package pl.nn44.battleship.model;

import pl.nn44.battleship.gamerules.GridSize;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class Grid {

  protected final GridSize gridSize;
  protected final int[] cells;

  public Grid(int rows, int cols, int[] cells) {
    this.gridSize = new GridSize(rows, cols);
    this.cells = cells.clone();
  }


  public Grid(GridSize gridSize, int[] cells) {
    this.gridSize = gridSize;
    this.cells = cells.clone();
  }

  public Grid(GridSize gridSize, List<Ship> ships) {
    this.gridSize = gridSize;
    this.cells = new int[gridSize.getRows() * gridSize.getCols()];

    for (Ship ship : ships) {
      for (Coord coord : ship.getCoords()) {
        setCell(coord, Cell.Type.SHIP);
      }
    }
  }

  public int[] getCells() {
    return cells.clone();
  }

  public int getSize() {
    return cells.length;
  }

  public int getRowsNo() {
    return gridSize.getRows();
  }

  public int getColsNo() {
    return gridSize.getCols();
  }

  public boolean isCoordProper(Coord coord) {
    return (coord.getRow() >= 0
        && coord.getCol() >= 0
        && coord.getRow() < gridSize.getRows()
        && coord.getCol() < gridSize.getCols());
  }

  public Cell getCell(Coord coord) {
    int offset = coordToOffset(coord);
    int code = cells[offset];
    Cell.Type type = Cell.Type.getByCode(code);

    return new Cell(this, coord, type);
  }

  public List<Cell> neighbours(Coord coord) {
    return filteredCoords(coord.neighbours());
  }

  public List<Cell> neighboursPlus(Coord coord) {
    return filteredCoords(coord.neighboursPlus());
  }

  public List<Cell> neighboursX(Coord coord) {
    return filteredCoords(coord.neighboursX());
  }

  protected List<Cell> filteredCoords(Collection<Coord> coords) {
    return coords.stream()
        .filter(this::isCoordProper)
        .map(this::getCell)
        .collect(Collectors.toUnmodifiableList());
  }

  protected int coordToOffset(Coord coord) {
    return coord.getRow() * gridSize.getCols() + coord.getCol();
  }

  protected void setCell(Coord coord, Cell.Type type) {
    cells[coordToOffset(coord)] = type.getCode();
  }

  public String visualize() {
    StringBuilder sb = new StringBuilder();
    for (int col = 0; col < gridSize.getCols(); col++) {
      for (int row = 0; row < gridSize.getRows(); row++) {
        sb.append(cells[coordToOffset(Coord.create(row, col))]);
        sb.append(" ");
      }
      sb.append("\n");
    }
    return sb.toString();
  }

  @Override
  public boolean equals(Object o) {
    return super.equals(o);
  }

  @Override
  public int hashCode() {
    return super.hashCode();
  }

  @Override
  public String toString() {
    return super.toString();
  }
}
