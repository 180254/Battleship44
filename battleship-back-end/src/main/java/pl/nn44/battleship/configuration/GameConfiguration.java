package pl.nn44.battleship.configuration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.server.MimeMappings;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.boot.web.servlet.server.ConfigurableServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.Assert;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean;
import pl.nn44.battleship.controller.Error0Controller;
import pl.nn44.battleship.controller.GameController;
import pl.nn44.battleship.model.Cell;
import pl.nn44.battleship.model.Coord;
import pl.nn44.battleship.model.Grid;
import pl.nn44.battleship.service.*;
import pl.nn44.battleship.util.BigIdGenerator;
import pl.nn44.battleship.util.IdGenerator;

import java.security.SecureRandom;
import java.util.List;
import java.util.Random;

@Configuration
@EnableWebSocket
@EnableConfigurationProperties
// http://docs.spring.io/spring/docs/current/spring-framework-reference/html/websocket.html
public class GameConfiguration implements WebSocketConfigurer {

  private static final Logger LOGGER = LoggerFactory.getLogger(GameConfiguration.class);

  public final GameProperties gameProperties;

  @Autowired
  public GameConfiguration(GameProperties gameProperties) {
    LOGGER.info("{}", gameProperties);
    Assert.notNull(gameProperties, "GameProperties must not be null.");
    this.gameProperties = gameProperties;
  }

  @Bean
  public ErrorController errorController() {
    return new Error0Controller();
  }

  @Bean
  public GameController webSocketController() {

    Random random = new SecureRandom();
    Locker locker = new LockerImpl();
    IdGenerator idGenerator = new BigIdGenerator(random, gameProperties.getImpl().getIdLen());
    FleetVerifier fleetVerifier = FleetVerifierFactory.forRules(gameProperties.getRules());
    Serializer<Grid, String> gridSerializer = new GridSerializer(gameProperties.getRules().getGridSize());
    Serializer<Coord, String> coordSerializer = new CoordSerializer();
    Serializer<List<Cell>, String> cellSerializer = new CellSerializer();
    MonteCarloFleet monteCarloFleet = new MonteCarloFleet(gameProperties.getRules(), random);

    return new GameController(
        gameProperties.getRules(),
        random,
        locker,
        idGenerator,
        fleetVerifier,
        gridSerializer,
        coordSerializer,
        cellSerializer,
        monteCarloFleet);
  }

  @Bean
  public ServletServerContainerFactoryBean createWebSocketContainer() {

    ServletServerContainerFactoryBean container = new ServletServerContainerFactoryBean();
    container.setMaxTextMessageBufferSize(
        (int) gameProperties.getWs().getPolicyMaxTextMessageBufferSize().toBytes());
    container.setMaxBinaryMessageBufferSize(
        (int) gameProperties.getWs().getPolicyMaxBinaryMessageBufferSize().toBytes());
    container.setMaxSessionIdleTimeout(
        gameProperties.getWs().getPolicyIdleTimeout().toMillis());
    return container;
  }

  @Override
  public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
    registry.addHandler(webSocketController(), gameProperties.getWs().getConfHandlers())
        .setAllowedOrigins(gameProperties.getWs().getConfAllowedOrigins());
  }

  @Bean
  public WebServerFactoryCustomizer<ConfigurableServletWebServerFactory> servletCustomizer() {
    return factory -> {
      MimeMappings mappings = new MimeMappings(MimeMappings.DEFAULT);
      mappings.add("map", "application/json");
      factory.setMimeMappings(mappings);
    };
  }
}
