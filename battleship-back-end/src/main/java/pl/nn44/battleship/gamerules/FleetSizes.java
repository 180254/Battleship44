package pl.nn44.battleship.gamerules;

import java.util.stream.IntStream;

public enum FleetSizes {
  RUSSIAN(new int[]{4, 3, 3, 2, 2, 2, 1, 1, 1, 1}),
  CLASSIC_ONE(new int[]{5, 4, 3, 3, 2}),
  CLASSIC_TWO(new int[]{5, 4, 3, 2, 2, 1, 1});

  private final int[] availableShipSizes;

  FleetSizes(int[] availableShipSizes) {
    this.availableShipSizes = IntStream.of(availableShipSizes).sorted().toArray();
  }

  public int[] getAvailableShipSizes() {
    return availableShipSizes;
  }
}
