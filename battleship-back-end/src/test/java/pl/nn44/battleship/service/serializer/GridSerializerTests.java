package pl.nn44.battleship.service.serializer;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import pl.nn44.battleship.gamerules.GameRules;
import pl.nn44.battleship.gamerules.GridSize;
import pl.nn44.battleship.model.Grid;

import java.util.Optional;

public class GridSerializerTests {

  private GameRules gameRules(int rows, int cols) {
    GridSize gridSize = new GridSize();
    gridSize.setRows(rows);
    gridSize.setCols(cols);

    GameRules gameRules = new GameRules();
    gameRules.setGridSize(gridSize);

    return gameRules;
  }

  @Test
  public void deserialize_proper() {
    GridSerializer gridSerializer = new GridSerializer(gameRules(2, 3));
    Optional<Grid> deserialize = gridSerializer.deserialize("0,1,1,0,0,0");

    Assertions.assertTrue(deserialize.isPresent());
    Assertions.assertArrayEquals(new int[]{0, 1, 1, 0, 0, 0}, deserialize.get().getCells());
  }

  @Test
  public void deserialize_tooManyValue() {
    GridSerializer gridSerializer = new GridSerializer(gameRules(2, 3));
    Optional<Grid> deserialize = gridSerializer.deserialize("0,1,1,0,0,0,1");
    Assertions.assertFalse(deserialize.isPresent());
  }

  @Test
  public void deserialize_notEnoughValue() {
    GridSerializer gridSerializer = new GridSerializer(gameRules(2, 3));
    Optional<Grid> deserialize = gridSerializer.deserialize("0,1,1,0,0");
    Assertions.assertFalse(deserialize.isPresent());
  }

  @Test
  public void deserialize_spacesAreNotAllowed() {
    GridSerializer gridSerializer = new GridSerializer(gameRules(2, 3));
    Optional<Grid> deserialize = gridSerializer.deserialize("0,1,1, 0,0,0");
    Assertions.assertFalse(deserialize.isPresent());
  }

  @Test
  public void deserialize_totallyBad1() {
    GridSerializer gridSerializer = new GridSerializer(gameRules(2, 3));
    Optional<Grid> deserialize = gridSerializer.deserialize("fghgfhgfh");
    Assertions.assertFalse(deserialize.isPresent());
  }

  @Test
  public void deserialize_totallyBad2_minus() {
    GridSerializer gridSerializer = new GridSerializer(gameRules(2, 3));
    Optional<Grid> deserialize = gridSerializer.deserialize("0,1,-1,0,0,1");
    Assertions.assertFalse(deserialize.isPresent());
  }

  @Test
  public void deserialize_totallyBad3_test() {
    GridSerializer gridSerializer = new GridSerializer(gameRules(2, 3));
    Optional<Grid> deserialize = gridSerializer.deserialize("0,1,dfgfd,0,0,1");
    Assertions.assertFalse(deserialize.isPresent());
  }

  @Test
  public void deserialize_empty() {
    GridSerializer gridSerializer = new GridSerializer(gameRules(0, 0));
    Optional<Grid> deserialize = gridSerializer.deserialize("");
    Assertions.assertFalse(deserialize.isPresent());
  }
}
