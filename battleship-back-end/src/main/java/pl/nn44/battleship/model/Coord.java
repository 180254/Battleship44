package pl.nn44.battleship.model;

import pl.nn44.battleship.gamerules.GridSize;

import java.util.List;
import java.util.Objects;
import java.util.StringJoiner;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class Coord {

  private final int row;
  private final int col;

  public Coord(int row, int col) {
    this.row = row;
    this.col = col;
  }

  public static Coord create(int row, int col) {
    return new Coord(row, col);
  }

  public int getCol() {
    return col;
  }

  public int getRow() {
    return row;
  }

  public boolean isProper(GridSize gridSize) {
    return row >= 0
        && col >= 0
        && row < gridSize.getRows()
        && col < gridSize.getCols();
  }

  public List<Coord> neighbours() {
    return Stream.concat(
        neighboursPlus().stream(),
        neighboursX().stream()
    ).collect(Collectors.toUnmodifiableList());
  }

  public List<Coord> neighboursPlus() {
    return List.of(
        Coord.create(row, col - 1),
        Coord.create(row, col + 1),
        Coord.create(row - 1, col),
        Coord.create(row + 1, col)
    );
  }

  public List<Coord> neighboursX() {
    return List.of(
        Coord.create(row - 1, col - 1),
        Coord.create(row + 1, col - 1),
        Coord.create(row - 1, col + 1),
        Coord.create(row + 1, col + 1)
    );
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    Coord coord = (Coord) o;
    return row == coord.row &&
        col == coord.col;
  }

  @Override
  public int hashCode() {
    return Objects.hash(row, col);
  }

  @Override
  public String toString() {
    return new StringJoiner(", ", Coord.class.getSimpleName() + "[", "]")
        .add("row=" + row)
        .add("col=" + col)
        .toString();
  }
}
