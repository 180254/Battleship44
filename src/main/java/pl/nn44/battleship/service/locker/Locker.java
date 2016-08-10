package pl.nn44.battleship.service.locker;

import pl.nn44.battleship.model.Game;
import pl.nn44.battleship.model.Player;

public interface Locker {

    interface Sync {
        void unlock();
    }

    Locker.Sync lock(Player player);

    Locker.Sync lock(Game player);
}
