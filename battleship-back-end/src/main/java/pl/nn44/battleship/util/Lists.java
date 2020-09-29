package pl.nn44.battleship.util;

import javax.annotation.Nullable;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class Lists {

  public static <T> List<T> sortedReverseOrder(List<T> data) {
    return data.stream().sorted(Collections.reverseOrder()).collect(Collectors.toUnmodifiableList());
  }
}
