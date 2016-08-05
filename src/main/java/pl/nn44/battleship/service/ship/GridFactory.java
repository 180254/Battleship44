package pl.nn44.battleship.service.ship;

import org.springframework.core.env.Environment;
import pl.nn44.battleship.model.Grid;

public class GridFactory {

    public static Grid sizeFromEnv(Environment env, int[] cells) {
        return new Grid(
                env.getProperty("grid.size.x", int.class),
                env.getProperty("grid.size.y", int.class),
                cells
        );
    }
}
