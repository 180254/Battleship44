package pl.nn44.battleship.configuration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.servlet.error.ErrorController;
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
import pl.nn44.battleship.service.locker.Locker;
import pl.nn44.battleship.service.locker.LockerImpl;
import pl.nn44.battleship.service.serializer.CellSerializer;
import pl.nn44.battleship.service.serializer.CoordSerializer;
import pl.nn44.battleship.service.serializer.GridSerializer;
import pl.nn44.battleship.service.serializer.Serializer;
import pl.nn44.battleship.service.verifier.FleetVerifier;
import pl.nn44.battleship.service.verifier.FleetVerifierFactory;
import pl.nn44.battleship.util.id.BigIdGenerator;
import pl.nn44.battleship.util.id.IdGenerator;

import java.security.SecureRandom;
import java.util.List;
import java.util.Random;

@Configuration
@EnableWebSocket
@EnableConfigurationProperties
// http://docs.spring.io/spring/docs/current/spring-framework-reference/html/websocket.html
class GameConfiguration implements WebSocketConfigurer {

  private static final Logger LOGGER = LoggerFactory.getLogger(GameConfiguration.class);

  final GameProperties gameProperties;

  @Autowired
  GameConfiguration(GameProperties gameProperties) {
    LOGGER.info("{}", gameProperties);
    Assert.notNull(gameProperties, "GameProperties must not be null.");
    this.gameProperties = gameProperties;
  }

  @Bean
  ErrorController errorController() {
    return new Error0Controller();
  }

  @Bean
  GameController webSocketController() {

    Random random = new SecureRandom();
    Locker locker = new LockerImpl();
    IdGenerator idGenerator = new BigIdGenerator(random, gameProperties.getImpl().getIdLen());
    FleetVerifier fleetVerifier = FleetVerifierFactory.forRules(gameProperties.getRules());
    Serializer<Grid, String> gridSerializer = new GridSerializer(gameProperties.getRules());
    Serializer<Coord, String> coordSerializer = new CoordSerializer();
    Serializer<List<Cell>, String> cellSerializer = new CellSerializer();

    return new GameController(
        random,
        locker,
        idGenerator,
        fleetVerifier,
        gridSerializer,
        coordSerializer,
        cellSerializer);
  }

  @Bean
  ServletServerContainerFactoryBean createWebSocketContainer() {

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
  ServletCustomizer servletCustomizer() {
    return new ServletCustomizer();
  }
}
