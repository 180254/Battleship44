package pl.nn44.battleship.service;

import pl.nn44.battleship.model.Game;
import pl.nn44.battleship.model.Player;
import pl.nn44.battleship.service.Locker.Unlocker;
import pl.nn44.battleship.util.IdGenerator;

import java.time.Duration;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.*;

public class MatchMakingService {

  private final Set<Player> playersQueue = ConcurrentHashMap.newKeySet();

  private final Locker locker;
  private final IdGenerator idGenerator;
  private final MetricsService metricsService;
  private final Duration attemptInitialDelay;
  private final Duration attemptPeriod;
  private final Duration timeout;

  private final ScheduledThreadPoolExecutor scheduledThreadPoolExecutor;

  public MatchMakingService(Locker locker,
                            IdGenerator idGenerator,
                            MetricsService metricsService,
                            int corePoolSize,
                            Duration attemptInitialDelay,
                            Duration attemptPeriod,
                            Duration timeout) {
    this.locker = locker;
    this.idGenerator = idGenerator;
    this.metricsService = metricsService;
    this.attemptInitialDelay = attemptInitialDelay;
    this.attemptPeriod = attemptPeriod;
    this.timeout = timeout;
    this.scheduledThreadPoolExecutor = new ScheduledThreadPoolExecutor(corePoolSize);

    metricsService.registerDeliverableMetric(
        "matchMakingService.threadPool.currentSize", scheduledThreadPoolExecutor::getPoolSize);
    metricsService.registerDeliverableMetric(
        "matchMakingService.playersQueue.currentSize", playersQueue::size);
  }

  public CompletableFuture<Game> makeGameAsync(Player player) {
    long startTime = System.currentTimeMillis();

    playersQueue.add(player);
    CompletableFuture<Game> gameFuture = new CompletableFuture<>();

    ScheduledFuture<?> makeGameScheduledFuture
        = scheduledThreadPoolExecutor.scheduleAtFixedRate(
        () -> makeGameInternal(player).ifPresent(gameFuture::complete),
        attemptInitialDelay.toMillis(), attemptPeriod.toMillis(), TimeUnit.MILLISECONDS);

    ScheduledFuture<?> makeGameTimeoutScheduledFuture
        = scheduledThreadPoolExecutor.schedule(
        () -> gameFuture.completeExceptionally(new TimeoutException()),
        timeout.toMillis(), TimeUnit.MILLISECONDS);

    gameFuture.whenComplete((game, throwable) -> {
      makeGameScheduledFuture.cancel(false);
      makeGameTimeoutScheduledFuture.cancel(false);
      playersQueue.remove(player);

      String metricCounterKey;
      if (throwable != null) {
        String throwableSimpleName = throwable.getClass().getSimpleName();
        metricCounterKey = "matchMakingService.makeGameAsync.completedExceptionally." + throwableSimpleName;
      } else if (game == null) {
        metricCounterKey = "matchMakingService.makeGameAsync.completedNull";
      } else {
        metricCounterKey = "matchMakingService.makeGameAsync.completedOk";
      }
      metricsService.incrementCounter(metricCounterKey);

      long elapsedTime = System.currentTimeMillis() - startTime;
      metricsService.recordElapsedTime(
          "matchMakingService.makeGameAsync.avgTimeMs", elapsedTime, TimeUnit.MILLISECONDS);
    });

    return gameFuture;
  }

  @SuppressWarnings("PMD.AvoidBranchingStatementAsLastInLoop") // hm, i like it
  private Optional<Game> makeGameInternal(Player player) {
    Optional<Game> result = Optional.empty();
    long startTime = System.currentTimeMillis();

    Optional<Unlocker> playerUnlocker = Optional.empty();
    Optional<Unlocker> otherPlayerUnlocker = Optional.empty();

    try {
      for (Player otherPlayer : playersQueue) {
        if (!matchMakingMatches(player, otherPlayer)) {
          continue;
        }

        // predicate ok, lock players
        playerUnlocker = locker.tryLock(player, 1, TimeUnit.MILLISECONDS);
        if (playerUnlocker.isEmpty()) {
          continue;
        }
        otherPlayerUnlocker = locker.tryLock(player, 1, TimeUnit.MILLISECONDS);
        if (otherPlayerUnlocker.isEmpty()) {
          playerUnlocker.get().unlock();
          continue;
        }

        // locked players, check predicate once more
        if (!matchMakingMatches(player, otherPlayer)) {
          playerUnlocker.get().unlock();
          otherPlayerUnlocker.get().unlock();
          continue;
        }

        Game game = new Game(idGenerator, player);
        game.cloneGameRules(player.getGame().getGameRules());
        player.setGame(game);

        game.setPlayer(1, otherPlayer);
        otherPlayer.setGame(game);
        result = Optional.of(game);
        break;
      }

      long elapsedTime = System.currentTimeMillis() - startTime;
      metricsService.recordElapsedTime(
          "matchMakingService.makeGameInternal.avgTimeMs", elapsedTime, TimeUnit.MILLISECONDS);
      return result;

    } finally {
      playerUnlocker.ifPresent(Unlocker::unlock);
      otherPlayerUnlocker.ifPresent(Unlocker::unlock);
    }
  }

  private boolean matchMakingMatches(Player player1, Player player2) {
    Game game1 = player1.getGame();
    Game game2 = player2.getGame();

    if (game1 == null || game2 == null) {
      return false;
    }

    if (game1.getState() == Game.State.IN_PROGRESS || game2.getState() == Game.State.IN_PROGRESS) {
      return false;
    }

    return game1.getGameRules().equals(game2.getGameRules());
  }
}
