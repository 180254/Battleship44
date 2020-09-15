package pl.nn44.battleship.service.serializer;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import pl.nn44.battleship.model.Coord;

import java.util.Optional;

public class CoordSerializerTests {

    private final CoordSerializer coordSerializer = new CoordSerializer();

    @Test
    public void deserialize_proper1() {
        String coordStr = "[6,44]";
        Optional<Coord> coord = coordSerializer.deserialize(coordStr);

        Assertions.assertTrue(coord.isPresent());
        Assertions.assertEquals(Coord.c(6, 44), coord.get());
    }

    @Test
    public void deserialize_proper2() {
        String coordStr = "[106,4]";
        Optional<Coord> coord = coordSerializer.deserialize(coordStr);

        Assertions.assertTrue(coord.isPresent());
        Assertions.assertEquals(Coord.c(106, 4), coord.get());
    }

    @Test
    public void deserialize_missingValue1() {
        String coordStr = "[106,]";
        Optional<Coord> coord = coordSerializer.deserialize(coordStr);
        Assertions.assertFalse(coord.isPresent());
    }

    @Test
    public void deserialize_missingValue2() {
        String coordStr = "[,2]";
        Optional<Coord> coord = coordSerializer.deserialize(coordStr);
        Assertions.assertFalse(coord.isPresent());
    }

    @Test
    public void deserialize_spaceIsNotSupported() {
        String coordStr = "[2, 2]";
        Optional<Coord> coord = coordSerializer.deserialize(coordStr);
        Assertions.assertFalse(coord.isPresent());
    }


    @Test
    public void deserialize_strInsteadOfNumber() {
        String coordStr = "[sfs,2]";
        Optional<Coord> coord = coordSerializer.deserialize(coordStr);
        Assertions.assertFalse(coord.isPresent());
    }

    @Test
    public void deserialize_empty() {
        Optional<Coord> coord = coordSerializer.deserialize("");
        Assertions.assertFalse(coord.isPresent());
    }

    @Test
    public void deserialize_totallyInvalid() {
        Optional<Coord> coord = coordSerializer.deserialize("fsdf4rfdg");
        Assertions.assertFalse(coord.isPresent());
    }
}
