package pl.nn44.battleship.model;

import pl.nn44.battleship.gamerules.GameRules;
import pl.nn44.battleship.service.ShipFinder;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

public class ShootGrid extends Grid {

  private final Grid opponentGrid;
  private final ShipFinder opShipFinder;
  private final GameRules gameRules;

  public ShootGrid(Grid opponentGrid, GameRules gameRules) {
    super(gameRules.getGridSize(), new int[opponentGrid.getSize()]);

    this.opponentGrid = opponentGrid;
    this.opShipFinder = ShipFinder.forGrid(opponentGrid);
    this.gameRules = gameRules;

    Arrays.fill(this.cells, Cell.Type.UNKNOWN.getCode());
  }

  /**
   * @param coord coord
   * @return list of changed cells
   */
  public List<Cell> shoot(Coord coord) {
    List<Cell> changedCell = new ArrayList<>();
    Cell.Type opponentCell = opponentGrid.getCell(coord).getType();

    if (opponentCell == Cell.Type.SHIP || opponentCell == Cell.Type.SHIP_SUNK) {
      this.setCell(coord, Cell.Type.SHIP);

      // In this case, opponentShip is non-null for sure.
      Ship opponentShip = Objects.requireNonNull(opShipFinder.findShip(coord));

      if (isShipSunk(opponentShip)) {
        for (Coord shipCoord : opponentShip.getCoords()) {
          this.setCell(shipCoord, Cell.Type.SHIP_SUNK);
          changedCell.add(this.getCell(shipCoord));
        }

        if (gameRules.isShowFieldsForSureEmpty()) {
          List<Coord> neighbours;
          if (gameRules.isFleetCanTouchEachOtherDiagonally()) {
            neighbours = opShipFinder.neighboursPlus(opponentShip);
          } else {
            neighbours = opShipFinder.neighbours(opponentShip);
          }

          for (Coord neighbourCoord : neighbours) {
            this.setCell(neighbourCoord, Cell.Type.EMPTY);
            changedCell.add(this.getCell(neighbourCoord));
          }

        }
      }

    } else {
      this.setCell(coord, Cell.Type.EMPTY);
    }

    changedCell.add(this.getCell(coord));
    return List.copyOf(changedCell);
  }

  public boolean allShipsSunk() {
    return opShipFinder.ships().stream().allMatch(this::isShipSunk);
  }

  private boolean isShipSunk(Ship ship) {
    return ship.getCoords().stream()
        .map(this::getCell)
        .allMatch(c -> c.getType() == Cell.Type.SHIP || c.getType() == Cell.Type.SHIP_SUNK);
  }
}
