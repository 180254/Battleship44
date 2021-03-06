package pl.nn44.battleship.gamerules;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConstructorBinding;

import javax.annotation.concurrent.Immutable;
import java.util.StringJoiner;

@ConfigurationProperties(prefix = "game.rules.grid-size", ignoreInvalidFields = false, ignoreUnknownFields = false)
@ConstructorBinding
@Immutable
public class GridSize {

  private final int rows;
  private final int cols;

  public GridSize(int rows, int cols) {
    this.rows = rows;
    this.cols = cols;
  }

  public int getRows() {
    return rows;
  }

  public int getCols() {
    return cols;
  }

  @Override
  public String toString() {
    return new StringJoiner(", ", GridSize.class.getSimpleName() + "[", "]")
        .add("rows=" + rows)
        .add("cols=" + cols)
        .toString();
  }
}
