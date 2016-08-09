package pl.nn44.battleship.utils.other;

import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Supplier;

public class Suppliers {

    // credits: friends @ stackoverflow
    // url: http://stackoverflow.com/a/35332514
    // license: cc by-sa 3.0
    // license url: https://creativecommons.org/licenses/by-sa/3.0/
    public static <T> Supplier<T> memoize(Supplier<T> delegate) {
        AtomicReference<T> value = new AtomicReference<>();

        return () -> {
            T val = value.get();

            if (val == null) {
                val = value.updateAndGet(
                        cur -> cur == null
                                ? delegate.get()
                                : cur
                );
            }

            return val;
        };
    }
}
