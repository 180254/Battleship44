package pl.nn44.battleship.configuration;

import org.eclipse.jetty.websocket.api.WebSocketBehavior;
import org.eclipse.jetty.websocket.api.WebSocketPolicy;
import org.eclipse.jetty.websocket.server.WebSocketServerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.ErrorController;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.Assert;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.HandshakeHandler;
import org.springframework.web.socket.server.jetty.JettyRequestUpgradeStrategy;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;
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

    final GameProperties gm;

    @Autowired
    GameConfiguration(GameProperties gm) {
        Assert.notNull(gm);
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
    HandshakeHandler handshakeHandler() {
        WebSocketPolicy policy = new WebSocketPolicy(WebSocketBehavior.SERVER);
        policy.setMaxTextMessageSize(gm.getWs().getPolicyMaxTextMessageSize());
        policy.setMaxBinaryMessageSize(gm.getWs().getPolicyMaxBinaryMessageSize());
        policy.setIdleTimeout(gm.getWs().getPolicyIdleTimeout());

        return new DefaultHandshakeHandler(
                new JettyRequestUpgradeStrategy(
                        new WebSocketServerFactory(policy)
                )
        );
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(webSocketController(), gm.getWs().getConfHandlers())
                .setAllowedOrigins(gm.getWs().getConfAllowedOrigins())
                .setHandshakeHandler(handshakeHandler());
    }
}
