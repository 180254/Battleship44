package pl.nn44.battleship.util.other;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import pl.nn44.battleship.util.Strings;

public class StringsTests {

  @Test
  public void safeSubstringTest1_whole() {
    String subStr = Strings.safeSubstring("ala", 0, 3);
    Assertions.assertEquals("ala", subStr);
  }

  @Test
  public void safeSubstringTest2_whole() {
    String subStr = Strings.safeSubstring("ala", 0);
    Assertions.assertEquals("ala", subStr);
  }

  @Test
  public void safeSubstringTest1_some() {
    String subStr = Strings.safeSubstring("ala123", 1, 4);
    Assertions.assertEquals("la1", subStr);
  }

  @Test
  public void safeSubstringTest2_some() {
    String subStr = Strings.safeSubstring("ala123", 2);
    Assertions.assertEquals("a123", subStr);
  }

  @Test
  public void safeSubstringTest1_beginTooBig() {
    String subStr = Strings.safeSubstring("ala", 3, 4);
    Assertions.assertEquals("", subStr);
  }


  @Test
  public void safeSubstringTest2_beginTooBig() {
    String subStr = Strings.safeSubstring("ala", 3);
    Assertions.assertEquals("", subStr);
  }

  @Test
  public void safeSubstringTest1_endTooBig() {
    String subStr = Strings.safeSubstring("ala", 0, 3);
    Assertions.assertEquals("ala", subStr);

  }
}
