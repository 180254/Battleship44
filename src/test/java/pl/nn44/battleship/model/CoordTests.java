package pl.nn44.battleship.model;

import org.hamcrest.Description;
import org.hamcrest.Matcher;
import org.hamcrest.TypeSafeMatcher;
import org.junit.Assert;
import org.junit.Test;

import java.util.List;

public class CoordTests {

    private final String has4 = "has 4 neighbours";

    private Matcher<Coord> isInNeighbourList(List<Coord> coords) {
        return new TypeSafeMatcher<Coord>() {
            @Override
            protected boolean matchesSafely(Coord item) {
                return coords.contains(item);
            }

            @Override
            public void describeTo(Description description) {
                description.appendValue("actual coord in list");
                description.appendValue(coords);
            }
        };
    }

    @Test
    public void checkNeighbours00() {
        List<Coord> neighbours = new Coord(0, 0).neighbours();

        Assert.assertSame(has4, 4, neighbours.size());
        Assert.assertThat(new Coord(-1, 0), isInNeighbourList(neighbours));
        Assert.assertThat(new Coord(1, 0), isInNeighbourList(neighbours));
        Assert.assertThat(new Coord(0, -1), isInNeighbourList(neighbours));
        Assert.assertThat(new Coord(0, 1), isInNeighbourList(neighbours));
    }

    @Test
    public void checkNeighbours64() {
        List<Coord> neighbours = new Coord(6, 4).neighbours();

        Assert.assertSame(has4, 4, neighbours.size());
        Assert.assertThat(new Coord(5, 4), isInNeighbourList(neighbours));
        Assert.assertThat(new Coord(7, 4), isInNeighbourList(neighbours));
        Assert.assertThat(new Coord(6, 3), isInNeighbourList(neighbours));
        Assert.assertThat(new Coord(6, 5), isInNeighbourList(neighbours));
    }
}
