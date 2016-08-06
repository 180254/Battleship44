package pl.nn44.battleship.utils;


import java.math.BigInteger;
import java.security.SecureRandom;

// credits: friends @ stackoverflow
// url: http://stackoverflow.com/a/41156
// license: cc by-sa 3.0
// license url: https://creativecommons.org/licenses/by-sa/3.0/
// changes[0] - wrapped in class
// changes[1] - customizable number of characters in result id
public class IdGeneratorImpl implements IdGenerator {

    private final static int BIT_PER_CHARACTER = 5;
    private final SecureRandom random = new SecureRandom();

    private final int numberOfChars;

    public IdGeneratorImpl(int numberOfChars) {
        this.numberOfChars = numberOfChars;
    }

    @Override
    public String nextId() {
        return new BigInteger(numberOfChars * BIT_PER_CHARACTER, random).toString(32);
    }
}
