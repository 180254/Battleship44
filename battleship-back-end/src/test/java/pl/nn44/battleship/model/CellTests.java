package pl.nn44.battleship.model;

import org.junit.Assert;
import org.junit.Test;

public class CellTests {

    @Test
    public void cellByCodeTest() {
        Cell.Type[] cellTypes = Cell.Type.values();

        for (Cell.Type type : cellTypes) {
            Cell.Type typeByCode = Cell.Type.getByCode(type.getCode());
            Assert.assertSame(type, typeByCode);
        }
    }
}
