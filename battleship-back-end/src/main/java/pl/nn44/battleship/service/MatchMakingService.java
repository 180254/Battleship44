package pl.nn44.battleship.service;

import pl.nn44.battleship.model.Game;
import pl.nn44.battleship.model.Player;
import pl.nn44.battleship.service.Locker.Unlocker;
import pl.nn44.battleship.util.IdGenerator;

import java.time.Duration;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.*;

public class MatchMakingService {

  private final Map<Player, CompletableFuture<Game>> playersQueue = new ConcurrentHashMap<>();

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

    CompletableFuture<Game> gameFuture = new CompletableFuture<>();
    playersQueue.put(player, gameFuture);

    ScheduledFuture<?> makeGameScheduledFuture
        = scheduledThreadPoolExecutor.scheduleAtFixedRate(
        () -> makeGameInternal(player).ifPresent(newGame -> {
          playersQueue.get(newGame.getPlayer0()).complete(newGame.getGame());
          playersQueue.get(newGame.getPlayer1()).complete(newGame.getGame());
        }),
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
        metricCounterKey = "matchMakingService.makeGameAsync." + throwableSimpleName;
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
  private Optional<NewGame> makeGameInternal(Player player) {
    Optional<NewGame> result = Optional.empty();
    long startTime = System.currentTimeMillis();

    Optional<Unlocker> playerUnlocker = Optional.empty();
    Optional<Unlocker> otherPlayerUnlocker = Optional.empty();

    try {
      for (Player otherPlayer : playersQueue.keySet()) {
        if (player == otherPlayer) {
          continue;
        }

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

        NewGame newGame = new NewGame(game, player, otherPlayer);
        result = Optional.of(newGame);
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

  public static class NewGame {
    private final Game game;
    private final Player player0;
    private final Player player1;

    public NewGame(Game game, Player player0, Player player1) {
      this.game = game;
      this.player0 = player0;
      this.player1 = player1;
    }

    public Game getGame() {
      return game;
    }

    public Player getPlayer0() {
      return player0;
    }

    public Player getPlayer1() {
      return player1;
    }
  }
}
