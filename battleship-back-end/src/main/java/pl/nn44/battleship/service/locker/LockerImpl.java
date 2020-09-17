package pl.nn44.battleship.service.locker;

import com.google.common.util.concurrent.Striped;
import pl.nn44.battleship.model.Game;
import pl.nn44.battleship.model.Player;
import pl.nn44.battleship.util.other.FastLock;

import java.util.concurrent.locks.Lock;

public class LockerImpl implements Locker {

  private final Lock fastLock = new FastLock();
  private final Striped<Lock> lockStriped;

  public LockerImpl(int locks) {
    lockStriped = Striped.lazyWeakLock(locks);
  }

  @Override
  public Locker.Sync lock(Player player) {
    Lock[] locks = new Lock[2];

    locks[0] = lockNullable(player);

    locks[1] = player != null
        ? lockNullable(player.getGame())
        : fastLock;

    return () -> LockerImpl.this.unlock(locks);

  }

  @Override
  public Locker.Sync lock(Game game) {
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
        ? lockStriped.get(obj)
        : fastLock;

    lock.lock();
    return lock;
  }
}
