package pl.nn44.battleship.configuration;

import org.springframework.boot.web.server.MimeMappings;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.boot.web.servlet.server.ConfigurableServletWebServerFactory;

public class ServletCustomizer implements WebServerFactoryCustomizer<ConfigurableServletWebServerFactory> {
  public void customize(ConfigurableServletWebServerFactory factory) {
    MimeMappings mappings = new MimeMappings(MimeMappings.DEFAULT);
    mappings.add("map", "application/json");
    factory.setMimeMappings(mappings);
  }
}
