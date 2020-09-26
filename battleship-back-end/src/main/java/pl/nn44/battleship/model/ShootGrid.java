package pl.nn44.battleship.model;

import pl.nn44.battleship.service.other.ShipFinder;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ShootGrid extends Grid {

  private final Grid opponentGrid;
  private final ShipFinder opShipFinder;

  public ShootGrid(Grid opponentGrid) {
    super(
        opponentGrid.getRowsNo(), opponentGrid.getColsNo(),
        new int[opponentGrid.getSize()]);

    this.opponentGrid = opponentGrid;
    this.opShipFinder = ShipFinder.forGrid(opponentGrid);

    Arrays.fill(this.cells, Cell.Type.UNKNOWN.getCode());
  }

  /**
   * @param coord coord
   * @return list of changed cells
   */
  public List<Cell> shoot(Coord coord) {
    List<Cell> changedCell = new ArrayList<>();
    Cell.Type opponentCell = opponentGrid.getCell(coord).getType();

    if (opponentCell == Cell.Type.SHIP) {
      this.setCell(coord, Cell.Type.SHIP);

      Ship opponentShip = opShipFinder.findShip(coord);
      if (isShipSink(opponentShip)) {

        for (Coord neighbourCoord : opShipFinder.neighbours(opponentShip)) {
          this.setCell(neighbourCoord, Cell.Type.EMPTY);
          changedCell.add(this.getCell(neighbourCoord));
        }
      }

    } else {
      this.setCell(coord, Cell.Type.EMPTY);
    }

    changedCell.add(this.getCell(coord));
    return List.copyOf(changedCell);
  }

  public boolean allShotDown() {
    return opShipFinder.ships().stream().allMatch(this::isShipSink);
  }

  private boolean isShipSink(Ship ship) {
    return ship.getCoords().stream()
        .map(this::getCell)
        .allMatch(c -> c.getType() == Cell.Type.SHIP);
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
