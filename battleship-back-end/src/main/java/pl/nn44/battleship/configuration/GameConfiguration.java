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

  final GameProperties gm;

  @Autowired
  GameConfiguration(GameProperties gm) {
    LOGGER.info("{}", gm);
    Assert.notNull(gm, "GameProperties must not be null.");
    this.gm = gm;
  }

  @Bean
  ErrorController errorController() {
    return new Error0Controller();
  }

  @Bean
  GameController webSocketController() {

    Random random = new SecureRandom();
    Locker locker = new LockerImpl(gm.getImpl().getLocksNo());
    IdGenerator idGenerator = new BigIdGenerator(random, gm.getImpl().getIdLen());
    FleetVerifier fleetVerifier = FleetVerifierFactory.forTypeFromGm(gm);
    Serializer<Grid, String> gridSerializer = new GridSerializer(gm);
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
    container.setMaxTextMessageBufferSize(gm.getWs().getPolicyMaxTextMessageSize());
    container.setMaxBinaryMessageBufferSize(gm.getWs().getPolicyMaxBinaryMessageSize());
    container.setMaxSessionIdleTimeout(gm.getWs().getPolicyIdleTimeoutMs());
    return container;
  }

  @Override
  public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
    registry.addHandler(webSocketController(), gm.getWs().getConfHandlers())
        .setAllowedOrigins(gm.getWs().getConfAllowedOrigins());
  }

  @Bean
  ServletCustomizer servletCustomizer() {
    return new ServletCustomizer();
  }
}
