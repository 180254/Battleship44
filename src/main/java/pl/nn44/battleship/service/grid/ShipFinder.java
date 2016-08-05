package pl.nn44.battleship.service.grid;


import pl.nn44.battleship.model.Cell;
import pl.nn44.battleship.model.Coord;
import pl.nn44.battleship.model.Grid;
import pl.nn44.battleship.model.Ship;
import pl.nn44.battleship.utils.Suppliers;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.function.Supplier;
import java.util.stream.Collectors;

public class ShipFinder {

    private final Grid grid;
    private final Supplier<List<Ship>> ships = Suppliers.memoize(this::calculateShips);
    private final ConcurrentMap<Ship, List<Coord>> surrounding = new ConcurrentHashMap<>();

    private ShipFinder(Grid grid) {
        this.grid = grid;
    }

    public static ShipFinder forGrid(Grid grid) {
        return new ShipFinder(grid);
    }

    // ---------------------------------------------------------------------------------------------------------------

    public List<Ship> ships() {
        return ships.get();
    }

    public List<Coord> surrounding(Ship ship) {
        return surrounding.computeIfAbsent(ship, this::calculateSurrounding);
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

    // ---------------------------------------------------------------------------------------------------------------

    private List<Ship> calculateShips() {
        List<Ship> ships = new ArrayList<>();

        for (int posX = 0; posX < grid.getSizeX(); posX++) {
            for (int posY = 0; posY < grid.getSizeY(); posY++) {

                Coord coord = Coord.c(posX, posY);
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

        return ships;
    }

    private List<Coord> calculateSurrounding(Ship ship) {
        return ship.getCoords().stream()
                .flatMap(c -> grid.getNeighbours(c).stream())
                .map(Cell::getCoord)
                .filter(c -> !ship.getCoords().contains(c))
                .collect(Collectors.toList());
    }

    // ---------------------------------------------------------------------------------------------------------------

    private List<Coord> collectShipCoords(Coord startCoord) {
        return collectShipCoords(startCoord, new ArrayList<>(), new ArrayList<>());
    }

    private List<Coord> collectShipCoords(Coord startCoord,
                                          List<Coord> ship_int,
                                          List<Coord> checked_int) {

        if (checked_int.contains(startCoord)) {
            return ship_int;
        }

        checked_int.add(startCoord);

        if (grid.getCell(startCoord).getType() == Cell.Type.SHIP) {
            ship_int.add(startCoord);

            for (Cell neighbourCell : grid.getNeighboursPlus(startCoord)) {
                collectShipCoords(neighbourCell.getCoord(), ship_int, checked_int);
            }
        }

        return ship_int;
    }

    // ---------------------------------------------------------------------------------------------------------------

    private boolean isShipCoord(List<Ship> ships, Coord coord) {
        return ships.stream()
                .flatMap(s -> s.getCoords().stream())
                .anyMatch(shipCoord -> shipCoord.equals(coord));
    }
}
