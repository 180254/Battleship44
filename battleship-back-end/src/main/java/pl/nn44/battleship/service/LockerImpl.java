package pl.nn44.battleship.service;

import org.springframework.util.ConcurrentReferenceHashMap;
import org.springframework.util.ConcurrentReferenceHashMap.ReferenceType;
import pl.nn44.battleship.model.Game;
import pl.nn44.battleship.model.Player;
import pl.nn44.battleship.util.FastLock;

import javax.annotation.Nullable;
import java.util.Arrays;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class LockerImpl implements Locker {

  private final Lock fastLock;
  private final Map<Object, Lock> locks;

  public LockerImpl(MetricsService metricsService, int initialCapacity) {
    this.fastLock = new FastLock();
    this.locks = new ConcurrentReferenceHashMap<>(initialCapacity, ReferenceType.WEAK);
    metricsService.registerDeliverableMetric("locker.locks.currentSize", locks::size);
  }

  @Override
  public Unlocker lock(@Nullable Player player) {
    Lock[] locks = new Lock[2];

    locks[0] = getLockObject(player);
    locks[1] = player != null ? getLockObject(player.getGame()) : fastLock;

    acquireLocks(locks);
    return () -> releaseLocks(locks);
  }

  @Override
  public Optional<Unlocker> tryLock(@Nullable Player player, long time, TimeUnit unit) {
    Lock[] locks = new Lock[2];

    locks[0] = getLockObject(player);
    locks[1] = player != null ? getLockObject(player.getGame()) : fastLock;

    if (!tryAcquireLocks(locks, time, unit)) {
      return Optional.empty();
    }
    return Optional.of(() -> releaseLocks(locks));
  }

  @Override
  public Unlocker lock(@Nullable Game game) {
    Lock lock = getLockObject(game);
    acquireLocks(new Lock[]{lock});
    return lock::unlock;
  }

  @Override
  public Optional<Unlocker> tryLock(@Nullable Game game, long time, TimeUnit unit) {
    Lock lock = getLockObject(game);
    if (!tryAcquireLocks(new Lock[]{lock}, time, unit)) {
      return Optional.empty();
    }
    return Optional.of(lock::unlock);
  }

  private Lock getLockObject(Object obj) {
    return obj != null
        ? locks.computeIfAbsent(obj, (key) -> new ReentrantLock(false))
        : fastLock;
  }

  private void acquireLocks(Lock[] locks) {
    for (Lock lock : locks) {
      lock.lock();
    }
  }

  private boolean tryAcquireLocks(Lock[] locks, long time, TimeUnit unit) {
    int i = 0;
    try {
      for (Lock lock : locks) {
        if (!lock.tryLock(time, unit)) {
          releaseLocks(Arrays.copyOfRange(locks, 0, i));
          return false;
        }
        i++;
      }
      return true;
    } catch (InterruptedException e) {
      releaseLocks(Arrays.copyOfRange(locks, 0, i));
      return false;
    }
  }

  private void releaseLocks(Lock[] locks) {
    for (int i = locks.length - 1; i >= 0; i--) {
      Lock lock = locks[i];
      lock.unlock();
    }
  }
}
