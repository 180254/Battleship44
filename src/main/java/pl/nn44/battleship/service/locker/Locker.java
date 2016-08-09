package pl.nn44.battleship.service.locker;

import pl.nn44.battleship.model.Game;
import pl.nn44.battleship.model.Player;

import java.util.concurrent.locks.Lock;

public interface Locker {

    Lock[] lock(Player player);

    Lock[] lock(Game player);

    void unlock(Lock[] locks);
}
