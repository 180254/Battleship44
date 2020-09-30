package pl.nn44.battleship.service.serializer;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import pl.nn44.battleship.gamerules.GameRules;
import pl.nn44.battleship.gamerules.GridSize;
import pl.nn44.battleship.model.Grid;
import pl.nn44.battleship.service.GridSerializer;

import java.util.Optional;

public class GridSerializerTests {

  private GameRules gameRules(int rows, int cols) {
    GameRules gameRules = new GameRules();
    gameRules.setGridSize(new GridSize(rows, cols));
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

  @Test
  public void serializeAndDeserialize_matches() {
    GridSerializer gridSerializer = new GridSerializer(gameRules(2, 3));
    Grid grid = new Grid(new GridSize(2, 3), new int[]{0, 1, 1, 0, 0, 0});

    String serialize = gridSerializer.serialize(grid);
    Optional<Grid> deserialize = gridSerializer.deserialize(serialize);

    Assertions.assertTrue(deserialize.isPresent());
    Assertions.assertArrayEquals(grid.getCells(), deserialize.get().getCells());
  }
}
