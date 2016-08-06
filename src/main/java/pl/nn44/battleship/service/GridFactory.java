package pl.nn44.battleship.service;

import org.springframework.core.env.Environment;
import pl.nn44.battleship.model.Grid;

public class GridFactory {

    public static Grid sizeFromEnv(Environment env, int[] cells) {
        return new Grid(
                env.getProperty("grid.size.rows", int.class),
                env.getProperty("grid.size.cols", int.class),
                cells
        );
    }
}
