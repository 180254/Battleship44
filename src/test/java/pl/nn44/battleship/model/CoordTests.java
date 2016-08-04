package pl.nn44.battleship.model;

import org.hamcrest.Description;
import org.hamcrest.Matcher;
import org.hamcrest.TypeSafeMatcher;
import org.junit.Assert;
import org.junit.Test;

import java.util.List;

public class CoordTests {

    private Matcher<Coord> isNeighbourOf(Coord coord) {
        List<Coord> neighbours = coord.neighbours();

        return new TypeSafeMatcher<Coord>() {
            @Override
            protected boolean matchesSafely(Coord item) {
                return neighbours.contains(item);
            }

            @Override
            public void describeTo(Description description) {
                description.appendValue("actual coord in list");
                description.appendValue(neighbours);
            }
        };
    }

    @Test
    public void checkNeighbours00() {
        Coord coord = new Coord(0, 0);
        Matcher<Coord> isNeighbour = isNeighbourOf(coord);
        List<Coord> neighbours = coord.neighbours();

        Assert.assertSame("has 4 neighbours", 4, neighbours.size());
        Assert.assertThat(new Coord(-1, 0), isNeighbour);
        Assert.assertThat(new Coord(1, 0), isNeighbour);
        Assert.assertThat(new Coord(0, -1), isNeighbour);
        Assert.assertThat(new Coord(0, 1), isNeighbour);
    }

    @Test
    public void checkNeighbours64() {
        Coord coord = new Coord(6, 4);
        Matcher<Coord> isNeighbour = isNeighbourOf(coord);
        List<Coord> neighbours = coord.neighbours();

        Assert.assertSame("has 4 neighbours", 4, neighbours.size());
        Assert.assertThat(new Coord(5, 4), isNeighbour);
        Assert.assertThat(new Coord(7, 4), isNeighbour);
        Assert.assertThat(new Coord(6, 3), isNeighbour);
        Assert.assertThat(new Coord(6, 5), isNeighbour);
    }

}
