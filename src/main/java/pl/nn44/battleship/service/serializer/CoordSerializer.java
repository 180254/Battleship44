package pl.nn44.battleship.service.serializer;

import pl.nn44.battleship.model.Coord;

public class CoordSerializer implements Serializer<Coord, String> {

    @Override
    public String serialize(Coord obj) {
        throw new UnsupportedOperationException("not supported");
    }

    @Override
    public Coord deserialize(String ser) {
        return null;
    }
}
