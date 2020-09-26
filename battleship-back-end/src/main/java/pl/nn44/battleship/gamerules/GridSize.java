package pl.nn44.battleship.gamerules;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.StringJoiner;

@Component
@ConfigurationProperties(prefix = "game.rules.grid-size", ignoreInvalidFields = false, ignoreUnknownFields = false)
public class GridSize {

  private int rows;
  private int cols;

  public int getRows() {
    return rows;
  }

  public void setRows(int rows) {
    this.rows = rows;
  }

  public int getCols() {
    return cols;
  }

  public void setCols(int cols) {
    this.cols = cols;
  }

  @Override
  public String toString() {
    return new StringJoiner(", ", GridSize.class.getSimpleName() + "[", "]")
        .add("rows=" + rows)
        .add("cols=" + cols)
        .toString();
  }
}
