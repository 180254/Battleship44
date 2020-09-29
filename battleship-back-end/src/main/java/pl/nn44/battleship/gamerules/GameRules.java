package pl.nn44.battleship.gamerules;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConstructorBinding;
import org.springframework.stereotype.Component;

import java.util.StringJoiner;

@Component
@ConfigurationProperties(prefix = "game.rules", ignoreInvalidFields = false, ignoreUnknownFields = false)
@ConstructorBinding
public class GameRules {

  private final GridSize gridSize;
  private final FleetMode fleetMode;
  private final FleetSizes fleetSizes;
  private final boolean fleetCanTouchEachOtherDiagonally;
  private final boolean showFieldsForSureEmpty;

  public GameRules(GridSize gridSize,
                   FleetMode fleetMode,
                   FleetSizes fleetSizes,
                   boolean fleetCanTouchEachOtherDiagonally,
                   boolean showFieldsForSureEmpty) {
    this.gridSize = gridSize;
    this.fleetMode = fleetMode;
    this.fleetSizes = fleetSizes;
    this.fleetCanTouchEachOtherDiagonally = fleetCanTouchEachOtherDiagonally;
    this.showFieldsForSureEmpty = showFieldsForSureEmpty;
  }

  public GridSize getGridSize() {
    return gridSize;
  }

  public FleetMode getFleetMode() {
    return fleetMode;
  }

  public FleetSizes getFleetSizes() {
    return fleetSizes;
  }

  public boolean isFleetCanTouchEachOtherDiagonally() {
    return fleetCanTouchEachOtherDiagonally;
  }

  public boolean isShowFieldsForSureEmpty() {
    return showFieldsForSureEmpty;
  }

  @Override
  public String toString() {
    return new StringJoiner(", ", GameRules.class.getSimpleName() + "[", "]")
        .add("gridSize=" + gridSize)
        .add("fleetMode=" + fleetMode)
        .add("fleetSizes=" + fleetSizes)
        .add("fleetCanTouchEachOtherDiagonally=" + fleetCanTouchEachOtherDiagonally)
        .add("showFieldsForSureEmpty=" + showFieldsForSureEmpty)
        .toString();
  }
}
