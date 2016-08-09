package pl.nn44.battleship.model;

import com.google.common.base.MoreObjects;
import com.google.common.base.Objects;
import com.google.common.collect.ImmutableList;
import pl.nn44.battleship.utils.other.Lists;

import java.util.List;

public class Ship {

    private final List<Coord> coords;

    public Ship(List<Coord> coords) {
        this.coords = ImmutableList.copyOf(coords);
    }

    public List<Coord> getCoords() {
        return coords;
    }

    public int getSize() {
        return coords.size();
    }

    // ---------------------------------------------------------------------------------------------------------------

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Ship ship = (Ship) o;
        return Lists.equalsIgnoreOrder(coords, ship.coords);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(coords);
    }

    @Override
    public String toString() {
        return MoreObjects.toStringHelper(this)
                .add("coords", coords)
                .toString();
    }
}
