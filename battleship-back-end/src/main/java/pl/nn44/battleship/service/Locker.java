package pl.nn44.battleship.service;

import pl.nn44.battleship.model.Game;
import pl.nn44.battleship.model.Player;

public interface Locker {

  Unlocker lock(Player player);

  Unlocker lock(Game player);

  interface Unlocker {
    void unlock();
  }
}
