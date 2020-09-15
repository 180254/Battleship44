package pl.nn44.battleship.model;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class CellTests {

    @Test
    public void cellByCodeTest() {
        Cell.Type[] cellTypes = Cell.Type.values();

        for (Cell.Type type : cellTypes) {
            Cell.Type typeByCode = Cell.Type.getByCode(type.getCode());
            Assertions.assertSame(type, typeByCode);
        }
    }
}
