package pl.nn44.battleship.service.serializer;

import java.util.Optional;

public interface Serializer<T, R> {

  R serialize(T obj);

  Optional<T> deserialize(R ser);
}
