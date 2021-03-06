package pl.nn44.battleship.util.id;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import pl.nn44.battleship.util.BigIdGenerator;

import java.util.Random;
import java.util.regex.Pattern;

public class BigIdGeneratorTests {

  private static final int MIN_LEN = 1;
  private static final int MAX_LEN = 100;//10_000;

  private final Random random = new Random();
  private final Pattern pattern = Pattern.compile("[a-zA-Z0-9]+");

  @Test
  public void nextIdTest_lengthShouldBeAsExpected() {
    for (int i = MIN_LEN; i < MAX_LEN; i++) {
      BigIdGenerator idGenerator = new BigIdGenerator(random, i);
      String nextId = idGenerator.nextId();

      String msg = "len = " + i + ", id = " + nextId;
      Assertions.assertEquals(i, nextId.length(), msg);
    }
  }

  @Test
  public void nextIdTest_shouldBeAlphaNum() {
    for (int i = MIN_LEN; i < MAX_LEN; i++) {
      BigIdGenerator idGenerator = new BigIdGenerator(random, i);
      String nextId = idGenerator.nextId();

      String msg = "len = " + i + ", id = " + nextId;
      Assertions.assertTrue(pattern.matcher(nextId).matches(), msg);
    }
  }
}
