package pl.nn44.battleship.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.Assert;
import pl.nn44.battleship.controller.WebSocketController;
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
@EnableConfigurationProperties
class GameConfiguration {

    final GameProperties gm;

    @Autowired
    GameConfiguration(GameProperties gm) {
        Assert.notNull(gm);
        this.gm = gm;
    }

    @Bean
    WebSocketController webSocketController() {

        Random random = new SecureRandom();
        Locker locker = new LockerImpl(gm.getImpl().getLocksNo());
        IdGenerator idGenerator = new BigIdGenerator(random, gm.getImpl().getIdLen());
        FleetVerifier fleetVerifier = FleetVerifierFactory.forTypeFromGm(gm);
        Serializer<Grid, String> gridSerializer = new GridSerializer(gm);
        Serializer<Coord, String> coordSerializer = new CoordSerializer();
        Serializer<List<Cell>, String> cellSerializer = new CellSerializer();

        return new WebSocketController(
                random,
                locker,
                idGenerator,
                fleetVerifier,
                gridSerializer,
                coordSerializer,
                cellSerializer);
    }


}
