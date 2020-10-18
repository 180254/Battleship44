package pl.nn44.battleship.service;

import org.springframework.util.ConcurrentReferenceHashMap;
import org.springframework.util.ConcurrentReferenceHashMap.ReferenceType;
import pl.nn44.battleship.model.Game;
import pl.nn44.battleship.model.Player;
import pl.nn44.battleship.util.FastLock;

import java.util.Map;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class LockerImpl implements Locker {

  private final Lock fastLock = new FastLock();
  private final Map<Object, Lock> locks = new ConcurrentReferenceHashMap<>(16, ReferenceType.WEAK);

  public LockerImpl(MetricsService metricsService) {
    metricsService.registerDeliverableMetric("locks.currentSize", locks::size);
  }

  @Override
  public Unlocker lock(Player player) {
    Lock[] locks = new Lock[2];

    locks[0] = lockNullable(player);

    locks[1] = player != null
        ? lockNullable(player.getGame())
        : fastLock;

    return () -> unlock(locks);

  }

  @Override
  public Unlocker lock(Game game) {
    Lock lock = lockNullable(game);
    return lock::unlock;
  }

  public void unlock(Lock[] locks) {
    for (int i = locks.length - 1; i >= 0; i--) {
      Lock lock = locks[i];
      lock.unlock();
    }
  }

  public Lock lockNullable(Object obj) {
    Lock lock = obj != null
        ? locks.computeIfAbsent(obj, (key) -> new ReentrantLock(false))
        : fastLock;

    lock.lock();
    return lock;
  }
}
