package pl.nn44.battleship.model;

import com.google.common.base.MoreObjects;
import com.google.common.base.Objects;
import com.google.common.collect.ImmutableList;

import java.util.Arrays;
import java.util.List;

public class Coord {

  private final int row;
  private final int col;

  public Coord(int row, int col) {
    this.row = row;
    this.col = col;
  }

  public static Coord c(int row, int col) {
    return new Coord(row, col);
  }

  public int getCol() {
    return col;
  }

  public int getRow() {
    return row;
  }

  public List<Coord> neighbours() {
    return ImmutableList.<Coord>builder()
        .addAll(neighboursPlus())
        .addAll(neighboursX())
        .build();
  }

  public List<Coord> neighboursPlus() {
    return Arrays.asList(
        Coord.c(row, col - 1),
        Coord.c(row, col + 1),
        Coord.c(row - 1, col),
        Coord.c(row + 1, col)
    );
  }

  public List<Coord> neighboursX() {
    return Arrays.asList(
        Coord.c(row - 1, col - 1),
        Coord.c(row + 1, col - 1),
        Coord.c(row - 1, col + 1),
        Coord.c(row + 1, col + 1)
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
    return Objects.hashCode(row, col);
  }

  @Override
  public String toString() {
    return MoreObjects.toStringHelper(this)
        .add("row", row)
        .add("col", col)
        .toString();
  }
}
