package pl.nn44.battleship.util.id;

import com.google.common.base.Strings;
import com.google.common.math.IntMath;

import java.math.BigInteger;
import java.math.RoundingMode;
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

    private final static int NUMBER_BASE = 32;
    private final static int BIT_PER_CHAR = IntMath.log2(NUMBER_BASE, RoundingMode.UNNECESSARY);

    private final Random random;
    private final int chars;
    private final int bits;

    public BigIdGenerator(Random random, int chars) {
        this.random = random;
        this.chars = chars;
        this.bits = chars * BIT_PER_CHAR;
    }

    @Override
    public String nextId() {
        String nextId = new BigInteger(bits, random).toString(NUMBER_BASE);
        return Strings.padStart(nextId, chars, '0');
    }
}
