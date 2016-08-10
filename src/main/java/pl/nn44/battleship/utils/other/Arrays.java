package pl.nn44.battleship.utils.other;

public class Arrays {

    // credits: friends @ stackoverflow
    // url: http://stackoverflow.com/a/4962420
    // license: cc by-sa 3.0
    // license url: https://creativecommons.org/licenses/by-sa/3.0/
    public static <T> int indexOf(T needle, T[] haystack) {
        for (int i = 0; i < haystack.length; i++) {

            if (haystack[i] != null && haystack[i].equals(needle)
                    || needle == null && haystack[i] == null) {

                return i;
            }
        }

        return -1;
    }
}
