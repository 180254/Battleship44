package pl.nn44.battleship.gamerules;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConstructorBinding;

import java.util.Objects;
import java.util.StringJoiner;

@ConfigurationProperties(prefix = "game.rules", ignoreInvalidFields = false, ignoreUnknownFields = false)
@ConstructorBinding
public class GameRules {

  private GridSize gridSize;
  private FleetSizes fleetSizes;
  private FleetMode fleetMode;
  private boolean fleetCanTouchEachOtherDiagonally;
  private boolean showFieldsForSureEmpty;

  public GameRules() {
  }

  public GameRules(GridSize gridSize,
                   FleetSizes fleetSizes,
                   FleetMode fleetMode,
                   boolean fleetCanTouchEachOtherDiagonally,
                   boolean showFieldsForSureEmpty) {
    this.gridSize = gridSize;
    this.fleetSizes = fleetSizes;
    this.fleetMode = fleetMode;
    this.fleetCanTouchEachOtherDiagonally = fleetCanTouchEachOtherDiagonally;
    this.showFieldsForSureEmpty = showFieldsForSureEmpty;
  }

  public GridSize getGridSize() {
    return gridSize;
  }

  public void setGridSize(GridSize gridSize) {
    this.gridSize = gridSize;
  }

  public FleetSizes getFleetSizes() {
    return fleetSizes;
  }

  public void setFleetSizes(FleetSizes fleetSizes) {
    this.fleetSizes = fleetSizes;
  }

  public FleetMode getFleetMode() {
    return fleetMode;
  }

  public void setFleetMode(FleetMode fleetMode) {
    this.fleetMode = fleetMode;
  }

  public boolean isFleetCanTouchEachOtherDiagonally() {
    return fleetCanTouchEachOtherDiagonally;
  }

  public void setFleetCanTouchEachOtherDiagonally(boolean fleetCanTouchEachOtherDiagonally) {
    this.fleetCanTouchEachOtherDiagonally = fleetCanTouchEachOtherDiagonally;
  }

  public boolean isShowFieldsForSureEmpty() {
    return showFieldsForSureEmpty;
  }

  public void setShowFieldsForSureEmpty(boolean showFieldsForSureEmpty) {
    this.showFieldsForSureEmpty = showFieldsForSureEmpty;
  }

  public String describe() {
    return new StringJoiner(",")
        .add("grid-size=" + gridSize.getRows() + "x" + gridSize.getCols())
        .add("fleet-sizes=" + fleetSizes)
        .add("fleet-mode=" + fleetMode)
        .add("fleet-can-touch-each-other-diagonally=" + fleetCanTouchEachOtherDiagonally)
        .add("show-fields-for-sure-empty=" + showFieldsForSureEmpty)
        .toString();
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    GameRules gameRules = (GameRules) o;
    return fleetCanTouchEachOtherDiagonally == gameRules.fleetCanTouchEachOtherDiagonally &&
        showFieldsForSureEmpty == gameRules.showFieldsForSureEmpty &&
        gridSize.equals(gameRules.gridSize) &&
        fleetSizes == gameRules.fleetSizes &&
        fleetMode == gameRules.fleetMode;
  }

  @Override
  public int hashCode() {
    return Objects.hash(gridSize, fleetSizes, fleetMode, fleetCanTouchEachOtherDiagonally, showFieldsForSureEmpty);
  }

  @Override
  public String toString() {
    return new StringJoiner(", ", GameRules.class.getSimpleName() + "[", "]")
        .add("gridSize=" + gridSize)
        .add("fleetSizes=" + fleetSizes)
        .add("fleetMode=" + fleetMode)
        .add("fleetCanTouchEachOtherDiagonally=" + fleetCanTouchEachOtherDiagonally)
        .add("showFieldsForSureEmpty=" + showFieldsForSureEmpty)
        .toString();
  }
}
