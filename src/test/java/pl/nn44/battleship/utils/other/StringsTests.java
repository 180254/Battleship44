package pl.nn44.battleship.utils.other;

import org.junit.Test;

public class StringsTests {

    @Test
    public void safeSubstringTest1_whole() {
        String subStr = Strings.safeSubstring("ala", 0, 3);
        org.junit.Assert.assertEquals("ala", subStr);
    }

    @Test
    public void safeSubstringTest2_whole() {
        String subStr = Strings.safeSubstring("ala", 0);
        org.junit.Assert.assertEquals("ala", subStr);
    }

    @Test
    public void safeSubstringTest1_some() {
        String subStr = Strings.safeSubstring("ala123", 1, 4);
        org.junit.Assert.assertEquals("la1", subStr);
    }

    @Test
    public void safeSubstringTest2_some() {
        String subStr = Strings.safeSubstring("ala123", 2);
        org.junit.Assert.assertEquals("a123", subStr);
    }

    @Test
    public void safeSubstringTest1_beginTooBig() {
        String subStr = Strings.safeSubstring("ala", 3, 4);
        org.junit.Assert.assertEquals("", subStr);
    }


    @Test
    public void safeSubstringTest2_beginTooBig() {
        String subStr = Strings.safeSubstring("ala", 3);
        org.junit.Assert.assertEquals("", subStr);
    }

    @Test
    public void safeSubstringTest1_endTooBig() {
        String subStr = Strings.safeSubstring("ala", 0, 3);
        org.junit.Assert.assertEquals("ala", subStr);

    }

}