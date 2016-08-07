package pl.nn44.battleship.utils;

public class Strings {

    public static String safeSubstring(String str, int beginIndex, int endIndex) {
        if (str.length() <= beginIndex) return "";
        if (str.length() >= endIndex) return "";
        return str.substring(beginIndex, endIndex);
    }

    public static String safeSubstring(String str, int beginIndex) {
        if (str.length() <= beginIndex) return "";
        return str.substring(beginIndex);
    }
}
