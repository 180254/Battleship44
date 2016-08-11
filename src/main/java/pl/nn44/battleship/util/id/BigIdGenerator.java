package pl.nn44.battleship.util.id;

import pl.nn44.battleship.util.other.Strings;

import java.math.BigInteger;
import java.util.Random;

// credits: friends @ stackoverflow
// url: http://stackoverflow.com/a/41156
// license: cc by-sa 3.0
// license url: https://creativecommons.org/licenses/by-sa/3.0/
// changes: 180254 @ GitHub
// changes[0] - wrapped in class
// changes[1] - random as strategy
// changes[1] - customizable number of characters in result id (instead of bits)
public class BigIdGenerator implements IdGenerator {

    private final static int BIT_PER_CHARACTER = 5;

    private final Random random;
    private final int numberOfChars;
    private final int bits;

    public BigIdGenerator(Random random, int numberOfChars) {
        this.random = random;
        this.numberOfChars = numberOfChars;
        this.bits = (numberOfChars + 2) * BIT_PER_CHARACTER;
    }

    @Override
    public String nextId() {
        String nextId = new BigInteger(bits, random).toString(32);
        return Strings.safeSubstring(nextId, 0, numberOfChars);
    }
}