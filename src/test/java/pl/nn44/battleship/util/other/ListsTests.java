package pl.nn44.battleship.util.other;

import org.junit.Test;

import java.util.Arrays;
import java.util.List;

public class ListsTests {

    @Test
    public void equalsIgnoreOrder_true() {
        List<String> a = Arrays.asList("1", "2", "2", "1", "00", "9", "1'");
        List<String> b = Arrays.asList("1", "1", "1'", "00", "9", "2", "2");
        org.junit.Assert.assertTrue(Lists.equalsIgnoreOrder(a, b));
    }


    @Test
    public void equalsIgnoreOrder_false() {
        List<String> a = Arrays.asList("1", "2", "2", "1", "00", "9", "1'");
        List<String> b = Arrays.asList("1", "1", "1'", "00", "9", "2", "1");
        org.junit.Assert.assertFalse(Lists.equalsIgnoreOrder(a, b));
    }
}
