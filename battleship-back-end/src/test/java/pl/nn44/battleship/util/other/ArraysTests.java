package pl.nn44.battleship.util.other;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class ArraysTests {

    @Test
    public void indexOf_atBeginning() {
        Integer[] array = {4, 0, 3, 1};
        Integer find = 4;

        int pos = Arrays.indexOf(find, array);
        Assertions.assertEquals(0, pos);
    }

    @Test
    public void indexOf_atAnd() {
        Integer[] array = {4, 0, 3, 1};
        Integer find = 1;

        int pos = Arrays.indexOf(find, array);
        Assertions.assertEquals(3, pos);
    }

    @Test
    public void indexOf_some() {
        Integer[] array = {4, 0, 3, 1};
        Integer find = 0;

        int pos = Arrays.indexOf(find, array);
        Assertions.assertEquals(1, pos);

    }

    @Test
    public void indexOf_notFound() {
        Integer[] array = {4, 0, 3, 1};
        Integer find = 40;

        int pos = Arrays.indexOf(find, array);
        Assertions.assertEquals(-1, pos);
    }

    @Test
    public void indexOf_null() {
        Integer[] array = {4, 0, 5, null, 3, 1};

        int pos = Arrays.indexOf(null, array);
        Assertions.assertEquals(3, pos);
    }
}
