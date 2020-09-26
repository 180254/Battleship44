package pl.nn44.battleship.gamerules;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.StringJoiner;

@Component
@ConfigurationProperties(prefix = "game.rules", ignoreInvalidFields = false, ignoreUnknownFields = false)
public class GameRules {

  private GridSize gridSize;
  private FleetMode fleetMode;
  private FleetSizes fleetSizes;
  private boolean fleetCanTouchEachOtherDiagonally;

  public GridSize getGridSize() {
    return gridSize;
  }

  public void setGridSize(GridSize gridSize) {
    this.gridSize = gridSize;
  }

  public FleetMode getFleetMode() {
    return fleetMode;
  }

  public void setFleetMode(FleetMode fleetMode) {
    this.fleetMode = fleetMode;
  }

  public FleetSizes getFleetSizes() {
    return fleetSizes;
  }

  public void setFleetSizes(FleetSizes fleetSizes) {
    this.fleetSizes = fleetSizes;
  }

  public boolean isFleetCanTouchEachOtherDiagonally() {
    return fleetCanTouchEachOtherDiagonally;
  }

  public void setFleetCanTouchEachOtherDiagonally(boolean fleetCanTouchEachOtherDiagonally) {
    this.fleetCanTouchEachOtherDiagonally = fleetCanTouchEachOtherDiagonally;
  }

  @Override
  public String toString() {
    return new StringJoiner(", ", GameRules.class.getSimpleName() + "[", "]")
        .add("gridSize=" + gridSize)
        .add("fleetMode=" + fleetMode)
        .add("fleetSizes=" + fleetSizes)
        .add("fleetCanTouchEachOtherDiagonally=" + fleetCanTouchEachOtherDiagonally)
        .toString();
  }
}
