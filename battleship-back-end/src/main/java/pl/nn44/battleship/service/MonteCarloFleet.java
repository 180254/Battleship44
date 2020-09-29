package pl.nn44.battleship.service;

import pl.nn44.battleship.gamerules.FleetMode;
import pl.nn44.battleship.gamerules.FleetSizes;
import pl.nn44.battleship.gamerules.GameRules;
import pl.nn44.battleship.gamerules.GridSize;
import pl.nn44.battleship.model.Coord;
import pl.nn44.battleship.model.Grid;
import pl.nn44.battleship.model.Ship;

import javax.annotation.Nullable;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.*;

public class MonteCarloFleet {

  private ExecutorService executorService;
  private ScheduledExecutorService cancelerService;

  private final GameRules gameRules;
  private final Random random;

  public MonteCarloFleet(GameRules gameRules, Random random) {
    this.executorService = new ThreadPoolExecutor(
        1, 8,
        60L, TimeUnit.SECONDS,
        new SynchronousQueue<>());
    this.cancelerService = Executors.newSingleThreadScheduledExecutor();
    this.gameRules = gameRules;
    this.random = random;
  }

  public static void main(String[] args) {
    GameRules gameRules = new GameRules(
        new GridSize(10, 10),
        FleetMode.CURVED,
        FleetSizes.RUSSIAN,
        false,
        false);
    Random random = new Random();
    MonteCarloFleet monteCarloFleet = new MonteCarloFleet(gameRules, random);

    int samples = 0;
    double sum = 0;
    double min = Integer.MAX_VALUE;
    double max = 0;

    while (true) {
      long startTime = System.currentTimeMillis();
      Grid randomFleet = monteCarloFleet.randomFleet();
      long stopTime = System.currentTimeMillis();
      long time = stopTime - startTime;

      samples++;
      sum += time;
      if (time < min) {
        min = time;
      }
      if (time > max) {
        max = time;
      }

      if (samples % 1000 == 0) {
        System.out.printf("avg %.2f, min: %.2f, max: %.2f%n", sum / samples, min, max);
      }
    }

  }

  public CompletableFuture<Grid> maybeRandomFleet() {
    CompletableFuture<Grid> futureGrid = CompletableFuture.supplyAsync(this::randomFleet, executorService);
    cancelerService.schedule(() -> futureGrid.cancel(true), 10, TimeUnit.MILLISECONDS);
    return futureGrid;
  }

  private Grid randomFleet() {
    List<Integer> availableShipSizes = gameRules.getFleetSizes().getAvailableShipSizes();

    List<Ship> doneShips = new ArrayList<>(availableShipSizes.size());
    List<Integer> doneShipSizes = new ArrayList<>(availableShipSizes.size());

    Grid grid = null;
    for (int shipSize : availableShipSizes) {
      doneShipSizes.add(shipSize);

      while (true) {
        Ship ship = null;
        if (Thread.interrupted()) {
          return null;
        }

        while (ship == null) {
          if (Thread.interrupted()) {
            return null;
          }
          ship = randomShip(shipSize);
        }

        doneShips.add(ship);
        grid = new Grid(gameRules.getGridSize(), doneShips);
        FleetVerifier fleetVerifier = FleetVerifierFactory.forRules(gameRules, doneShipSizes);
        if (fleetVerifier.verify(grid)) {
          break;
        } else {
          doneShips.remove(doneShips.size() - 1);
        }
      }


    }
    return grid;

  }

  @Nullable
  private Ship randomShip(int size) {
    Coord coord = randomCoord();
    if (!coord.isProper(gameRules.getGridSize())) {
      return null;
    }
    List<Coord> shipCoords = new ArrayList<>(size);
    shipCoords.add(coord);

    Direction direction = randomDirection();

    for (int i = 0; i < size - 1; i++) {
      coord = direction.move(coord);
      if (!coord.isProper(gameRules.getGridSize())) {
        return null;
      }

      shipCoords.add(coord);
    }

    return new Ship(shipCoords);
  }

  private Coord randomCoord() {
    return Coord.create(
        random.nextInt(gameRules.getGridSize().getRows()),
        random.nextInt(gameRules.getGridSize().getCols()));
  }

  private Direction randomDirection() {
    Direction[] values = Direction.values();
    return values[random.nextInt(values.length)];
  }

  enum Direction {
    UP(1, 0),
    DOWN(-1, 0),
    LEFT(0, -1),
    RIGHT(0, 1);

    private final int rowShift;
    private final int colShift;

    Direction(int rowShift, int colShift) {
      this.rowShift = rowShift;
      this.colShift = colShift;
    }

    public Coord move(Coord coord) {
      return Coord.create(coord.getRow() + rowShift, coord.getCol() + colShift);
    }
  }
}
