package pl.nn44.battleship.util;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.springframework.util.unit.DataSize;

import java.io.IOException;

public class DataSizeSerializer extends JsonSerializer<DataSize> {

  @Override
  public void serialize(DataSize value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
    gen.writeStartObject();
    gen.writeFieldName("bytes");
    gen.writeObject(value.toBytes());
    gen.writeEndObject();
  }
}
