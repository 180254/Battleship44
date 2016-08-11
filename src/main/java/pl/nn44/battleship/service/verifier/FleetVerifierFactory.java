package pl.nn44.battleship.service.verifier;

import com.google.common.collect.ImmutableMap;
import pl.nn44.battleship.configuration.GameProperties;
import pl.nn44.battleship.configuration.GameProperties.FleetType;

import java.lang.reflect.InvocationTargetException;
import java.util.Map;

public class FleetVerifierFactory {

    private static Map<FleetType.Sizes, int[]> SIZES_TO_ARG =
            ImmutableMap.<FleetType.Sizes, int[]>builder()
                    .put(FleetType.Sizes.RUSSIAN, new int[]{4, 3, 3, 2, 2, 2, 1, 1, 1, 1})
                    .put(FleetType.Sizes.CLASSIC_ONE, new int[]{5, 4, 3, 3, 2})
                    .put(FleetType.Sizes.CLASSIC_TWO, new int[]{5, 4, 3, 2, 2, 1, 1})
                    .build();

    private static Map<FleetType.Mode, Class<? extends FleetVerifier>> MODES_TO_VERIFIER_CLASS =
            ImmutableMap.<FleetType.Mode, Class<? extends FleetVerifier>>builder()
                    .put(FleetType.Mode.STRAIGHT, StraightFleetVerifier.class)
                    .put(FleetType.Mode.CURVED, CurvedFleetVerifier.class)
                    .build();


    public static FleetVerifier forType(FleetType.Mode mode, FleetType.Sizes sizes) {
        try {
            return MODES_TO_VERIFIER_CLASS.get(mode)
                    .getConstructor(int[].class)
                    .newInstance((Object) SIZES_TO_ARG.get(sizes));

        } catch (NoSuchMethodException | IllegalAccessException
                | InstantiationException | InvocationTargetException e) {
            throw new AssertionError(e);
        }
    }

    public static FleetVerifier forTypeFromGm(GameProperties gm) {
        FleetType.Mode mode = gm.getFleetType().getMode();
        FleetType.Sizes sizes = gm.getFleetType().getSizes();
        return forType(mode, sizes);
    }
}
