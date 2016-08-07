package pl.nn44.battleship.service;

import pl.nn44.battleship.model.Cell;

import java.util.List;
import java.util.stream.Collectors;

public class CellSerializerImpl implements CellSerializer {

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
}
