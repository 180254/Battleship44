package pl.nn44.battleship.model;

import com.google.common.base.MoreObjects;
import pl.nn44.battleship.DoVerify;

import java.util.Arrays;

public enum CellType {

    EMPTY(0), SHIP(1),
    HIT(2), MISS(3), VERIFIED_EMPTY(4);

    private int code;

    CellType(int code) {
        this.code = code;
    }

    public int getCode() {
        return code;
    }

    @DoVerify(true)
    public static CellType getByCode(int code) {
        CellType[] allCells = CellType.values();
        return Arrays.stream(allCells)
                .filter(cell -> cell.code == code)
                .findAny()
                .orElseThrow(() -> new IllegalArgumentException("bad code"));
    }

    @Override
    public String toString() {
        return MoreObjects.toStringHelper(this)
                .add("name", name())
                .add("code", code)
                .toString();
    }
}
