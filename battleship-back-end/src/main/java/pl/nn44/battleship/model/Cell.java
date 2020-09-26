package pl.nn44.battleship.model;

import java.util.Arrays;
import java.util.Objects;
import java.util.StringJoiner;

public class Cell {

  private final Grid grid;
  private final Coord coord;
  private final Type type;

  public Cell(Coord coord, Type type) {
    this.grid = null;
    this.coord = coord;
    this.type = type;
  }

  public Cell(Grid grid, Coord coord, Type type) {
    this.grid = grid;
    this.coord = coord;
    this.type = type;
  }

  public Grid getGrid() {
    return grid;
  }

  public Coord getCoord() {
    return coord;
  }

  public Type getType() {
    return type;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    Cell cell = (Cell) o;
    return Objects.equals(grid, cell.grid) &&
        Objects.equals(coord, cell.coord);
  }

  @Override
  public int hashCode() {
    return Objects.hash(grid, coord);
  }

  @Override
  public String toString() {
    return new StringJoiner(", ", Cell.class.getSimpleName() + "[", "]")
        .add("grid=" + grid)
        .add("coord=" + coord)
        .add("type=" + type)
        .toString();
  }

  public enum Type {

    UNKNOWN(-1),
    EMPTY(0),
    SHIP(1),
    SHIP_SUNK(2);

    private final int code;

    Type(int code) {
      this.code = code;
    }

    public static Type getByCode(int code) {
      Type[] allCells = Type.values();
      return Arrays.stream(allCells)
          .filter(cell -> cell.code == code)
          .findFirst()
          .orElseThrow(() -> new IllegalArgumentException("bad code"));
    }

    public int getCode() {
      return code;
    }

    @Override
    public String toString() {
      return new StringJoiner(", ", Type.class.getSimpleName() + "[", "]")
          .add("code=" + code)
          .toString();
    }
  }
}
