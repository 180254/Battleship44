package pl.nn44.battleship.util;

public class Strings {

  public static int indexOf(String str, int ch, int noSuchCharacterIndex) {
    int index = str.indexOf(' ');
    if (index == -1) {
      index = noSuchCharacterIndex;
    }
    return index;
  }


  public static String safeSubstring(String str, int beginIndex, int endIndex) {
    int beginIndex2 = Math.min(beginIndex, str.length());
    int endIndex2 = Math.min(endIndex, str.length());

    return str.substring(beginIndex2, endIndex2);
  }

  public static String safeSubstring(String str, int beginIndex) {
    int beginIndex2 = Math.min(beginIndex, str.length());

    return str.substring(beginIndex2);
  }
}
