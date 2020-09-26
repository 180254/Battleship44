package pl.nn44.battleship.service.other;

import pl.nn44.battleship.model.Cell;
import pl.nn44.battleship.model.Coord;
import pl.nn44.battleship.model.Grid;
import pl.nn44.battleship.model.Ship;
import pl.nn44.battleship.util.other.Suppliers;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.stream.Collectors;

public class ShipFinder {

  private final Grid grid;
  private final Supplier<List<Ship>> ships = Suppliers.memoize(this::calculateShips);

  private ShipFinder(Grid grid) {
    this.grid = grid;
  }

  public static ShipFinder forGrid(Grid grid) {
    return new ShipFinder(grid);
  }

  public List<Ship> ships() {
    return ships.get();
  }

  public List<Coord> neighbours(Ship ship) {
    return calculateNeighbours(ship, grid::neighbours);
  }

  public List<Coord> neighboursPlus(Ship ship) {
    return calculateNeighbours(ship, grid::neighboursPlus);
  }

  public List<Coord> neighboursX(Ship ship) {
    return calculateNeighbours(ship, grid::neighboursX);
  }

  public Ship findShip(Coord coord) {
    Ship find = null;

    for (Ship ship : ships.get()) {
      if (ship.getCoords().contains(coord)) {
        find = ship;
        break;
      }
    }

    return find;
  }

  private List<Ship> calculateShips() {
    List<Ship> ships = new ArrayList<>();

    for (int rowNo = 0; rowNo < grid.getRowsNo(); rowNo++) {
      for (int colNo = 0; colNo < grid.getColsNo(); colNo++) {

        Coord coord = Coord.create(rowNo, colNo);
        Cell cell = grid.getCell(coord);

        if (cell.getType() == Cell.Type.SHIP) {
          if (!isShipCoord(ships, coord)) {

            List<Coord> shipCoords = collectShipCoords(coord);
            Ship ship = new Ship(shipCoords);
            ships.add(ship);
          }
        }
      }
    }

    return Collections.unmodifiableList(ships);
  }

  private List<Coord> calculateNeighbours(Ship ship, Function<Coord, List<Cell>> neighboursSupplier) {
    return ship.getCoords().stream()
        .flatMap(c -> neighboursSupplier.apply(c).stream())
        .map(Cell::getCoord)
        .filter(c -> !ship.getCoords().contains(c))
        .distinct()
        .collect(Collectors.toUnmodifiableList());
  }

  private List<Coord> collectShipCoords(Coord startCoord) {
    return List.copyOf(collectShipCoords(startCoord, new ArrayList<>(), new ArrayList<>()));
  }

  private List<Coord> collectShipCoords(Coord startCoord,
                                        List<Coord> shipCoords,
                                        List<Coord> checkedCoords) {

    if (checkedCoords.contains(startCoord)) {
      return shipCoords;
    }

    checkedCoords.add(startCoord);

    if (grid.getCell(startCoord).getType() == Cell.Type.SHIP) {
      shipCoords.add(startCoord);

      for (Cell neighbourCell : grid.neighboursPlus(startCoord)) {
        collectShipCoords(neighbourCell.getCoord(), shipCoords, checkedCoords);
      }
    }

    return shipCoords;
  }

  private boolean isShipCoord(List<Ship> ships, Coord coord) {
    return ships.stream()
        .flatMap(s -> s.getCoords().stream())
        .anyMatch(shipCoord -> shipCoord.equals(coord));
  }
}
