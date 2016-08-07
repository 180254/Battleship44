package pl.nn44.battleship.service;

import pl.nn44.battleship.model.Cell;

import java.util.List;

public interface CellSerializer {

    String serialize(List<Cell> cells);
}
