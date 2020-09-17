package pl.nn44.battleship.service.serializer;

import pl.nn44.battleship.model.Cell;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public class CellSerializer implements Serializer<List<Cell>, String> {

  public String serialize(Cell cell) {
    return String.format(
        "[%s,%d,%d]",
        cell.getType().name(),
        cell.getCoord().getRow(),
        cell.getCoord().getCol()
    );
  }

  @Override
  public String serialize(List<Cell> cells) {
    return cells.stream()
        .map(this::serialize)
        .collect(Collectors.joining(","));
  }

  @Override
  public Optional<List<Cell>> deserialize(String ser) {
    throw new UnsupportedOperationException();
  }
}
