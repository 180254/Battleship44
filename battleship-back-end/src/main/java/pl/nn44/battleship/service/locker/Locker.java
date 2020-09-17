package pl.nn44.battleship.service.locker;

import pl.nn44.battleship.model.Game;
import pl.nn44.battleship.model.Player;

public interface Locker {

  Locker.Sync lock(Player player);

  Locker.Sync lock(Game player);

  interface Sync {
    void unlock();
  }
}
