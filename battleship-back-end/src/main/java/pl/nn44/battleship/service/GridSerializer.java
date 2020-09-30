package pl.nn44.battleship.service;

import pl.nn44.battleship.gamerules.GameRules;
import pl.nn44.battleship.model.Cell;
import pl.nn44.battleship.model.Grid;

import java.util.Arrays;
import java.util.Optional;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class GridSerializer implements Serializer<Grid, String> {

  private final String allowedCodes = String.format("%d%d", Cell.Type.EMPTY.getCode(), Cell.Type.SHIP.getCode());
  private final Pattern allowedGridPattern = Pattern.compile("[" + allowedCodes + "](,[" + allowedCodes + "])*");

  private final GameRules gameRules;

  public GridSerializer(GameRules gameRules) {
    this.gameRules = gameRules;
  }

  @Override
  public String serialize(Grid obj) {
    return Arrays.stream(obj.getCells())
        .boxed()
        .map(String::valueOf)
        .collect(Collectors.joining(","));
  }

  @Override
  public Optional<Grid> deserialize(String ser) {
    if (!allowedGridPattern.matcher(ser).matches()) {
      return Optional.empty();
    }

    String[] split = ser.split(",");
    int[] codes = Arrays.stream(split).mapToInt(Integer::parseInt).toArray();

    int gridSizeTotal = gameRules.getGridSize().getRows() * gameRules.getGridSize().getCols();
    if (codes.length != gridSizeTotal) {
      return Optional.empty();
    }

    Grid grid = new Grid(gameRules.getGridSize(), codes);
    return Optional.of(grid);

  }
}
