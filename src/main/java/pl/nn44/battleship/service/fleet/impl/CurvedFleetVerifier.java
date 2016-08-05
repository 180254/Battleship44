package pl.nn44.battleship.service.fleet.impl;

import pl.nn44.battleship.model.Cell;
import pl.nn44.battleship.model.Coord;
import pl.nn44.battleship.model.Grid;
import pl.nn44.battleship.model.Ship;
import pl.nn44.battleship.service.fleet.FleetVerifier;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class CurvedFleetVerifier implements FleetVerifier {

    public final int[] availSheepSizes;

    public CurvedFleetVerifier(int[] availSheepSizes) {
        this.availSheepSizes = availSheepSizes.clone();
        Arrays.sort(this.availSheepSizes);
    }

    @Override
    public boolean verify(Grid grid) {
        List<Ship> ships = collectShips(grid);

        return checkShipSizes(ships)
                && checkShipsCollisions(grid, ships);
    }

    // ---------------------------------------------------------------------------------------------------------------

    public boolean checkShipSizes(List<Ship> ships) {
        int[] shipSizes = ships.stream().mapToInt(Ship::getSize).sorted().toArray();
        return Arrays.equals(availSheepSizes, shipSizes);
    }

    public boolean checkShipsCollisions(Grid grid, List<Ship> ships) {
        boolean collision = false;

        loopI:
        for (int i = 0; i < ships.size(); i++) {
            Ship ship1 = ships.get(i);
            List<Coord> surrounding1 = surroundingShip(grid, ship1);

            for (int j = 0; j < ships.size(); j++) {
                if (i == j) continue;

                Ship ship2 = ships.get(j);
                List<Coord> coords2 = ship2.getCoords();

                if (!Collections.disjoint(coords2, surrounding1)) {
                    collision = true;
                    break loopI;
                }
            }
        }


        return !collision;
    }


    // ---------------------------------------------------------------------------------------------------------------

    private List<Ship> collectShips(Grid grid) {
        List<Ship> ships = new ArrayList<>();

        for (int posX = 0; posX < grid.getSizeX(); posX++) {
            for (int posY = 0; posY < grid.getSizeY(); posY++) {

                Coord coord = Coord.c(posX, posY);
                Cell cell = grid.getCell(coord);

                if (cell.getType() == Cell.Type.SHIP) {
                    if (!isShipCoord(ships, coord)) {

                        List<Coord> shipCoords = collectShipCoords(grid, coord);
                        Ship ship = new Ship(shipCoords);
                        ships.add(ship);
                    }
                }
            }
        }

        return ships;
    }

    private List<Coord> collectShipCoords(Grid grid, Coord startCoord) {
        return collectShipCoords(
                grid, startCoord,
                new ArrayList<>(), new ArrayList<>());
    }

    private List<Coord> collectShipCoords(Grid grid, Coord startCoord,
                                          List<Coord> ship_int, List<Coord> checked_int) {

        if (checked_int.contains(startCoord)) {
            return ship_int;
        }

        checked_int.add(startCoord);

        if (grid.getCell(startCoord).getType() == Cell.Type.SHIP) {
            ship_int.add(startCoord);

            for (Cell neighbourCell : grid.getNeighboursPlus(startCoord)) {
                collectShipCoords(grid, neighbourCell.getCoord(), ship_int, checked_int);
            }
        }

        return ship_int;
    }

    private boolean isShipCoord(List<Ship> ships, Coord coord) {
        return ships.stream()
                .flatMap(s -> s.getCoords().stream())
                .anyMatch(shipCoord -> shipCoord.equals(coord));
    }

    private List<Coord> surroundingShip(Grid grid, Ship ship) {
        return ship.getCoords().stream()
                .flatMap(c -> grid.getNeighbours(c).stream())
                .map(Cell::getCoord)
                .filter(c -> !ship.getCoords().contains(c))
                .collect(Collectors.toList());

    }
}
