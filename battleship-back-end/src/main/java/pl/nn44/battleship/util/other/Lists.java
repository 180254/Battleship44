package pl.nn44.battleship.util.other;

import com.google.common.collect.ImmutableMultiset;

import java.util.List;

public class Lists {

    // credits: friends @ stackoverflow
    // url: http://stackoverflow.com/a/37210041
    // license: cc by-sa 3.0
    // license url: https://creativecommons.org/licenses/by-sa/3.0/
    public static <T> boolean equalsIgnoreOrder(List<T> a, List<T> b) {
        return a == b || ImmutableMultiset.copyOf(a).equals(ImmutableMultiset.copyOf(b));
    }

}
