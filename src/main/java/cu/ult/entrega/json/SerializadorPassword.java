package cu.ult.entrega.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;

public class SerializadorPassword extends JsonSerializer<String> {

    @Override
    public void serialize(String t, JsonGenerator jg, SerializerProvider sp) throws IOException, JsonProcessingException {
        jg.getCodec().writeValue(jg, "");
    }

}
