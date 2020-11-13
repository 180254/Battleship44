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

  private final Set<Player> players = ConcurrentHashMap.newKeySet();

  private final Locker locker;
  private final IdGenerator idGenerator;
  private final Duration attemptInitialDelay;
  private final Duration attemptPeriod;
  private final Duration timeout;

  private final ScheduledThreadPoolExecutor scheduledThreadPoolExecutor;

  public MatchMakingService(Locker locker,
                            IdGenerator idGenerator,
                            int corePoolSize,
                            Duration attemptInitialDelay,
                            Duration attemptPeriod,
                            Duration timeout) {
    this.locker = locker;
    this.idGenerator = idGenerator;
    this.attemptInitialDelay = attemptInitialDelay;
    this.attemptPeriod = attemptPeriod;
    this.timeout = timeout;
    this.scheduledThreadPoolExecutor = new ScheduledThreadPoolExecutor(corePoolSize);
  }

  public CompletableFuture<Game> makeGameAsync(Player player) {
    players.add(player);
    CompletableFuture<Game> gameFuture = new CompletableFuture<>();

    ScheduledFuture<?> makeGameScheduledFuture
        = scheduledThreadPoolExecutor.scheduleAtFixedRate(
        () -> makeGame(player).ifPresent(gameFuture::complete),
        attemptInitialDelay.toMillis(), attemptPeriod.toMillis(), TimeUnit.MILLISECONDS);

    ScheduledFuture<?> makeGameTimeoutScheduledFuture
        = scheduledThreadPoolExecutor.schedule(
        () -> gameFuture.completeExceptionally(new TimeoutException()),
        timeout.toMillis(), TimeUnit.MILLISECONDS);

    gameFuture.whenComplete((game, throwable) -> {
      makeGameScheduledFuture.cancel(false);
      makeGameTimeoutScheduledFuture.cancel(false);
      players.remove(player);
    });

    return gameFuture;
  }

  @SuppressWarnings("PMD.AvoidBranchingStatementAsLastInLoop") // hm, i like it
  public Optional<Game> makeGame(Player player) {
    Optional<Unlocker> playerUnlocker = Optional.empty();
    Optional<Unlocker> otherPlayerUnlocker = Optional.empty();

    try {
      for (Player otherPlayer : players) {
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

        return Optional.of(game);
      }

      return Optional.empty();

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
