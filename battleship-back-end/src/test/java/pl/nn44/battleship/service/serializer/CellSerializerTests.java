package pl.nn44.battleship.service.serializer;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import pl.nn44.battleship.model.Cell;
import pl.nn44.battleship.model.Coord;
import pl.nn44.battleship.service.CellSerializer;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class CellSerializerTests {

  private final CellSerializer cellSerializer = new CellSerializer();

  @Test
  public void serialize_empty() {
    List<Cell> cells = new ArrayList<>();
    String serialize = cellSerializer.serialize(cells);

    Assertions.assertEquals("", serialize);
  }

  @Test
  public void serialize_one() {
    Cell cell = new Cell(null, Coord.create(10, 7), Cell.Type.SHIP);
    List<Cell> cells = Collections.singletonList(cell);
    String serialize = cellSerializer.serialize(cells);

    Assertions.assertEquals("[SHIP,10,7]", serialize);
  }

  @Test
  public void serialize_two() {
    Cell cell1 = new Cell(null, Coord.create(10, 7), Cell.Type.EMPTY);
    Cell cell2 = new Cell(null, Coord.create(5, 4), Cell.Type.SHIP);

    List<Cell> cells = Arrays.asList(cell1, cell2);
    String serialize = cellSerializer.serialize(cells);

    Assertions.assertEquals("[EMPTY,10,7],[SHIP,5,4]", serialize);
  }

  @Test
  public void serialize_some() {
    Cell cell1 = new Cell(null, Coord.create(10, 7), Cell.Type.EMPTY);
    Cell cell2 = new Cell(null, Coord.create(5, 4), Cell.Type.SHIP);

    List<Cell> cells = Arrays.asList(cell1, cell2, cell1, cell1);
    String serialize = cellSerializer.serialize(cells);

    Assertions.assertEquals("[EMPTY,10,7],[SHIP,5,4],[EMPTY,10,7],[EMPTY,10,7]", serialize);
  }
}
