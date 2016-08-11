package pl.nn44.battleship.util.other;

import org.jetbrains.annotations.Nullable;

public class Arrays {

    public static <T> int indexOf(@Nullable T needle, T[] haystack) {
        return java.util.Arrays.asList(haystack).indexOf(needle);
    }
}
