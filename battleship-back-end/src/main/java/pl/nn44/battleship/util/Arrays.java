package pl.nn44.battleship.util;

import javax.annotation.Nullable;
import java.util.Comparator;
import java.util.List;
import java.util.stream.IntStream;

public class Arrays {

  public static <T> int indexOf(@Nullable T needle, T[] haystack) {
    return java.util.Arrays.asList(haystack).indexOf(needle);
  }
}
