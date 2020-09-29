package pl.nn44.battleship.util;

import javax.annotation.Nonnull;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;

public class FastLock implements Lock {

  @Override
  public void lock() {

  }

  @Override
  public void lockInterruptibly() {

  }

  @Override
  public boolean tryLock() {
    return true;
  }

  @Override
  public boolean tryLock(long time, @Nonnull TimeUnit unit) {
    return true;
  }

  @Override
  public void unlock() {
  }

  @Nonnull
  @Override
  public Condition newCondition() {
    throw new UnsupportedOperationException();
  }
}
