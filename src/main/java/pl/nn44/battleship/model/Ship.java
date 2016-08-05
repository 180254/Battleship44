package pl.nn44.battleship.model;

import com.google.common.collect.ImmutableList;

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
}
