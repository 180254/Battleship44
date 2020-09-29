package pl.nn44.battleship.service;

import pl.nn44.battleship.model.Coord;

import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class CoordSerializer implements Serializer<Coord, String> {

  private final Pattern pattern = Pattern.compile("\\[([0-9]+),([0-9]+)\\]");

  @Override
  public String serialize(Coord obj) {
    throw new UnsupportedOperationException();
  }

  @Override
  public Optional<Coord> deserialize(String ser) {
    Matcher matcher = pattern.matcher(ser);

    if (!matcher.matches()) {
      return Optional.empty();
    }

    int row = Integer.parseInt(matcher.group(1));
    int col = Integer.parseInt(matcher.group(2));
    Coord coord = new Coord(row, col);

    return Optional.of(coord);
  }
}
