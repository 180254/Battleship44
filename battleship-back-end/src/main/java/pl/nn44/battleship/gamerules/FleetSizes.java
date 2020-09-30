package pl.nn44.battleship.gamerules;

import pl.nn44.battleship.util.Lists;

import javax.annotation.concurrent.Immutable;
import java.util.List;

@Immutable
public enum FleetSizes {

  RUSSIAN(List.of(4, 3, 3, 2, 2, 2, 1, 1, 1, 1)),
  CLASSIC_ONE(List.of(5, 4, 3, 3, 2)),
  CLASSIC_TWO(List.of(5, 4, 3, 2, 2, 1, 1));

  private final List<Integer> availableShipSizes;

  FleetSizes(List<Integer> availableShipSizes) {
    this.availableShipSizes = Lists.sortedReverseOrder(availableShipSizes);
  }

  public List<Integer> getAvailableShipSizes() {
    return availableShipSizes;
  }
}
