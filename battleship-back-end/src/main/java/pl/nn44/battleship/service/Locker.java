package pl.nn44.battleship.service;

import pl.nn44.battleship.model.Game;
import pl.nn44.battleship.model.Player;

import javax.annotation.Nullable;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

public interface Locker {

  Unlocker lock(@Nullable Player player);

  Optional<Unlocker> tryLock(@Nullable Player player, long time, TimeUnit unit);

  Unlocker lock(@Nullable Game game);

  Optional<Unlocker> tryLock(@Nullable Game game, long time, TimeUnit unit);

  interface Unlocker {
    void unlock();
  }
}
