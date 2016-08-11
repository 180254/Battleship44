package pl.nn44.battleship.util.other;

import org.junit.Test;

public class AssertTests {

    @Test
    public void notNull_0() {
        Assert.notNull("-", "-");
    }

    @Test(expected = IllegalArgumentException.class)
    public void notNull_1() {
        Assert.notNull(null, "-");
    }

    @Test
    public void ensureThat_0() {
        Assert.ensureThat(2 > 1, "-", "-");
    }

    @Test(expected = IllegalArgumentException.class)
    public void ensureThat_1() {
        Assert.ensureThat(2 <= 1, "-", "-");
    }
}
