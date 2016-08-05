package pl.nn44.battleship.utils;

public class Assert {

    public static void notNull(Object obj, String paramName) {
        if (obj == null) {
            String exMsg = String.format("null parameter: %s", paramName);
            throw new IllegalArgumentException(exMsg);
        }
    }

    public static void ensureThat(boolean expression, String paramName, String cause) {
        if (!expression) {
            String exMsg = String.format("bad param: %s, cause: %s", paramName, cause);
            throw new IllegalArgumentException(exMsg);
        }
    }
}