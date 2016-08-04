package pl.nn44.battleship.model;

import org.hamcrest.Description;
import org.hamcrest.Matcher;
import org.hamcrest.TypeSafeMatcher;
import org.junit.Assert;
import org.junit.Test;

import java.util.List;

public class CoordTests {

    private Matcher<Coord> isNeighbourOf(Coord coord, List<Coord> neighbours) {

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
    public void checkNeighboursPlus_00() {
        Coord coord = new Coord(0, 0);
        List<Coord> neighboursPlus = coord.neighboursPlus();
        Matcher<Coord> isNeighbourPlus = isNeighbourOf(coord, neighboursPlus);

        Assert.assertSame("has 4 neighboursPlus", 4, neighboursPlus.size());
        Assert.assertThat(new Coord(-1, 0), isNeighbourPlus);
        Assert.assertThat(new Coord(1, 0), isNeighbourPlus);
        Assert.assertThat(new Coord(0, -1), isNeighbourPlus);
        Assert.assertThat(new Coord(0, 1), isNeighbourPlus);
    }

    @Test
    public void checkNeighboursPlus_64() {
        Coord coord = new Coord(6, 4);
        List<Coord> neighboursPlus = coord.neighboursPlus();
        Matcher<Coord> isNeighbourPlus = isNeighbourOf(coord, neighboursPlus);

        Assert.assertSame("has 4 neighboursPlus", 4, neighboursPlus.size());
        Assert.assertThat(new Coord(5, 4), isNeighbourPlus);
        Assert.assertThat(new Coord(7, 4), isNeighbourPlus);
        Assert.assertThat(new Coord(6, 3), isNeighbourPlus);
        Assert.assertThat(new Coord(6, 5), isNeighbourPlus);
    }

    @Test
    public void checkNeighboursX_00() {
        Coord coord = new Coord(0, 0);
        List<Coord> neighboursX = coord.neighboursX();
        Matcher<Coord> isNeighbourX = isNeighbourOf(coord, neighboursX);

        Assert.assertSame("has 4 neighboursX", 4, neighboursX.size());
        Assert.assertThat(new Coord(-1, -1), isNeighbourX);
        Assert.assertThat(new Coord(-1, 1), isNeighbourX);
        Assert.assertThat(new Coord(1, -1), isNeighbourX);
        Assert.assertThat(new Coord(1, 1), isNeighbourX);
    }

    @Test
    public void checkNeighboursX_64() {
        Coord coord = new Coord(6, 4);
        List<Coord> neighboursX = coord.neighboursX();
        Matcher<Coord> isNeighbourX = isNeighbourOf(coord, neighboursX);

        Assert.assertSame("has 4 neighboursX", 4, neighboursX.size());
        Assert.assertThat(new Coord(5, 3), isNeighbourX);
        Assert.assertThat(new Coord(7, 3), isNeighbourX);
        Assert.assertThat(new Coord(5, 5), isNeighbourX);
        Assert.assertThat(new Coord(7, 5), isNeighbourX);
    }

}
