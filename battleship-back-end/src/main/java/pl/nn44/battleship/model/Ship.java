package pl.nn44.battleship.model;

import java.util.List;
import java.util.Objects;
import java.util.StringJoiner;

public class Ship {

  private final List<Coord> coords;

  public Ship(List<Coord> coords) {
    this.coords = List.copyOf(coords);
  }

  public List<Coord> getCoords() {
    return coords;
  }

  public int getSize() {
    return coords.size();
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    Ship ship = (Ship) o;
    return Objects.equals(coords, ship.coords);
  }

  @Override
  public int hashCode() {
    return Objects.hash(coords);
  }

  @Override
  public String toString() {
    return new StringJoiner(", ", Ship.class.getSimpleName() + "[", "]")
        .add("coords=" + coords)
        .toString();
  }
}
