package pl.nn44.battleship.service.serializer;

import pl.nn44.battleship.configuration.GameProperties;
import pl.nn44.battleship.model.Cell;
import pl.nn44.battleship.model.Grid;
import pl.nn44.battleship.service.other.GridFactory;

import java.util.Arrays;
import java.util.Optional;
import java.util.regex.Pattern;

public class GridSerializer implements Serializer<Grid, String> {

  private final String validCodes = String.format("%d%d", Cell.Type.EMPTY.getCode(), Cell.Type.SHIP.getCode());
  private final Pattern pattern = Pattern.compile("[" + validCodes + "](,[" + validCodes + "])*");

  private final GameProperties gameProps;
  private final int gameSize;

  public GridSerializer(GameProperties gameProps) {
    this.gameProps = gameProps;

    GameProperties.GridSize gridSize = gameProps.getGridSize();
    this.gameSize = gridSize.getRows() * gridSize.getCols();
  }

  @Override
  public String serialize(Grid obj) {
    throw new UnsupportedOperationException();
  }

  @Override
  public Optional<Grid> deserialize(String ser) {
    if (!pattern.matcher(ser).matches()) {
      return Optional.empty();
    }

    String[] split = ser.split(",");
    int[] codes = Arrays.stream(split).mapToInt(Integer::parseInt).toArray();

    if (codes.length != gameSize) {
      return Optional.empty();
    }

    Grid grid = GridFactory.sizeFromEnv(gameProps, codes);
    return Optional.of(grid);

  }
}
