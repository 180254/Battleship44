package pl.nn44.battleship.service.fleet.impl;

import pl.nn44.battleship.model.Grid;
import pl.nn44.battleship.service.fleet.FleetVerifier;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class CurvedFleetVerifier implements FleetVerifier {

    private final Integer[] SHIP_SIZES = {
            4,
            3, 3,
            2, 2, 2,
            1, 1, 1, 1
    };

    @Override
    public boolean verify(Grid grid) {
        List<Integer> availShipSize = new ArrayList<>(Arrays.asList(SHIP_SIZES));

        return true;
    }
}
