package pl.nn44.battleship.service.other;

import pl.nn44.battleship.gamerules.GameRules;
import pl.nn44.battleship.model.Grid;

public class GridFactory {

  public static Grid fromGameRules(GameRules gameRules, int[] cells) {
    return new Grid(
        gameRules.getGridSize().getRows(),
        gameRules.getGridSize().getCols(),
        cells
    );
  }
}
