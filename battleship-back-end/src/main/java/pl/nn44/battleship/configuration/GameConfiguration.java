package pl.nn44.battleship.configuration;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.server.MimeMappings;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.boot.web.servlet.server.ConfigurableServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean;
import pl.nn44.battleship.controller.Error0Controller;
import pl.nn44.battleship.controller.GameController;
import pl.nn44.battleship.controller.MetricsController;
import pl.nn44.battleship.gamerules.GameRules;
import pl.nn44.battleship.gamerules.GridSize;
import pl.nn44.battleship.model.Cell;
import pl.nn44.battleship.model.Coord;
import pl.nn44.battleship.model.Grid;
import pl.nn44.battleship.service.*;
import pl.nn44.battleship.util.BigIdGenerator;
import pl.nn44.battleship.util.IdGenerator;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Random;

@Configuration
@EnableWebSocket
@EnableConfigurationProperties({GameProperties.class, GameRules.class, GridSize.class})
// http://docs.spring.io/spring/docs/current/spring-framework-reference/html/websocket.html
public class GameConfiguration {

  @Bean
  public MetricsService metricsService() {
    return new MetricsService();
  }

  @Bean
  public MetricsController metricsController(MetricsService metricsService) {
    return new MetricsController(metricsService);
  }

  @Bean
  public ErrorController errorController() {
    return new Error0Controller();
  }

  @Bean
  public GameController gameController(GameProperties gameProperties, MetricsService metricsService) {
    Instant applicationStartTime = Instant.now();
    metricsService.registerDeliverableMetric("uptime", () -> Duration.between(applicationStartTime, Instant.now()));
    metricsService.registerDeliverableMetric("gameProperties", () -> gameProperties);

    Random random = new Random();
    Locker locker = new LockerImpl(
        metricsService,
        gameProperties.getImpl().getLockerImplConfig().getInitialCapacity()
    );
    IdGenerator idGenerator = new BigIdGenerator(
        random,
        gameProperties.getImpl().getBigIdGeneratorConfig().getChars()
    );
    MatchMakingService matchMakingService = new MatchMakingService(
        locker,
        idGenerator,
        gameProperties.getImpl().getMatchMakingServiceConfig().getCorePoolSize(),
        gameProperties.getImpl().getMatchMakingServiceConfig().getAttemptInitialDelay(),
        gameProperties.getImpl().getMatchMakingServiceConfig().getAttemptPeriod(),
        gameProperties.getImpl().getMatchMakingServiceConfig().getTimeout()
    );
    Serializer<Grid, String> gridSerializer = new GridSerializer(gameProperties.getRules());
    Serializer<Coord, String> coordSerializer = new CoordSerializer();
    Serializer<List<Cell>, String> cellSerializer = new CellSerializer();

    return new GameController(
        gameProperties,
        gameProperties.getRules(),
        random,
        locker,
        idGenerator,
        metricsService,
        matchMakingService,
        gridSerializer,
        coordSerializer,
        cellSerializer
    );
  }

  @Bean
  public ServletServerContainerFactoryBean createWebSocketContainer(GameProperties gameProperties) {
    ServletServerContainerFactoryBean container = new ServletServerContainerFactoryBean();
    container.setMaxTextMessageBufferSize(
        (int) gameProperties.getWs().getPolicyMaxTextMessageBufferSize().toBytes());
    container.setMaxBinaryMessageBufferSize(
        (int) gameProperties.getWs().getPolicyMaxBinaryMessageBufferSize().toBytes());
    container.setMaxSessionIdleTimeout(
        gameProperties.getWs().getPolicyIdleTimeout().toMillis());
    return container;
  }

  @Bean
  public WebSocketConfigurer webSocketConfigurer(GameProperties gameProperties, GameController gameController) {
    return registry ->
        registry.addHandler(gameController, gameProperties.getWs().getConfHandlers())
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
