package pl.nn44.battleship.service.serializer;

public interface Serializer<T, R> {

    R serialize(T obj);

    T deserialize(R ser);
}
