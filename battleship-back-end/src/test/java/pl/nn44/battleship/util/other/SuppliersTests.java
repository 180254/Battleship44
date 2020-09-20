package pl.nn44.battleship.util.other;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Supplier;

public class SuppliersTests {

  @Test
  public void memoizeTest_shouldBeComputedOnce() {
    AtomicInteger counter = new AtomicInteger(0);

    Supplier<Object> supp = () -> {
      counter.incrementAndGet();
      return new Object();
    };

    Supplier<Object> memSupp = Suppliers.memoize(supp);

    Object[] results = new Object[10];
    for (int i = 0; i < 10; i++) {
      results[i] = memSupp.get();
    }

    for (int i = 0; i < 9; i++) {
      Assertions.assertSame(results[i], results[i + 1]);
    }


    Assertions.assertEquals(1, counter.get());
  }
}
