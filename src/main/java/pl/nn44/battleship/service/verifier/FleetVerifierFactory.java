package pl.nn44.battleship.service.verifier;

public class FleetVerifierFactory {

    public static FleetVerifier curvedRussian() {

        return new CurvedFleetVerifier(new int[]{
                4,
                3, 3,
                2, 2, 2,
                1, 1, 1, 1
        });
    }
}
