package pl.nn44.battleship.service.serializer;

import pl.nn44.battleship.model.Grid;

public class GridSerializer implements Serializer<Grid, String> {

    @Override
    public String serialize(Grid obj) {
        throw new UnsupportedOperationException("not supported");
    }

    @Override
    public Grid deserialize(String ser) {
        return null;
    }
}
