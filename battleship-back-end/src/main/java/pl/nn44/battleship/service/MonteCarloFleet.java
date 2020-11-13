package pl.nn44.battleship.service;

import pl.nn44.battleship.gamerules.FleetMode;
import pl.nn44.battleship.gamerules.GameRules;
import pl.nn44.battleship.model.Coord;
import pl.nn44.battleship.model.Grid;
import pl.nn44.battleship.model.Ship;

import javax.annotation.Nullable;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.*;

public class MonteCarloFleet {

  private final ThreadPoolExecutor executorService;
  private final ScheduledExecutorService cancelerService;
  private final GameRules gameRules;
  private final Random random;
  private final MetricsService metricsService;

  public MonteCarloFleet(GameRules gameRules, Random random, MetricsService metricsService) {
    // based on Executors.newCachedThreadPool()
    this.executorService = new ThreadPoolExecutor(
        1, 8,
        60L, TimeUnit.SECONDS,
        new SynchronousQueue<>());
    this.cancelerService = Executors.newSingleThreadScheduledExecutor();
    this.gameRules = gameRules;
    this.random = random;
    this.metricsService = metricsService;

    metricsService.registerDeliverableMetric("monteCarloFleet.currentPoolSize", executorService::getPoolSize);
  }

  public CompletableFuture<Grid> maybeRandomFleet() {
    CompletableFuture<Grid> futureGrid = CompletableFuture.supplyAsync(this::randomFleet, executorService);

    futureGrid.whenComplete((grid, throwable) -> {
      String metricCounterKey;

      if (throwable != null) {
        String throwableSimpleName = throwable.getClass().getSimpleName();
        metricCounterKey = "monteCarloFleet.completedExceptionally." + throwableSimpleName;
      } else if (grid == null) {
        metricCounterKey = "monteCarloFleet.completedNull";
      } else {
        metricCounterKey = "monteCarloFleet.completedOk";
      }

      metricsService.incrementCounter(metricCounterKey);
    });

    cancelerService.schedule(() -> futureGrid.cancel(true), 100, TimeUnit.MILLISECONDS);
    return futureGrid;
  }

  @Nullable
  private Grid randomFleet() {
    long startTime = System.currentTimeMillis();
    List<Integer> availableShipSizes = gameRules.getFleetSizes().getAvailableShipSizes();

    List<Ship> doneShips = new ArrayList<>(availableShipSizes.size());
    List<Integer> doneShipSizes = new ArrayList<>(availableShipSizes.size());

    Grid grid = null;
    for (int shipSize : availableShipSizes) {
      if (Thread.interrupted()) {
        return null;
      }
      doneShipSizes.add(shipSize);

      while (true) {
        if (Thread.interrupted()) {
          return null;
        }

        Ship ship = null;
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

    long elapsedTime = System.currentTimeMillis() - startTime;
    metricsService.recordElapsedTime("monteCarloFleet.avgTimeMs", elapsedTime, TimeUnit.MILLISECONDS);
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
      if (gameRules.getFleetMode() == FleetMode.CURVED) {
        direction = randomDirection();
      }

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
