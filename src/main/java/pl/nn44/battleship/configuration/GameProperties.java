package pl.nn44.battleship.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@ConfigurationProperties(prefix = "game")
@Component
public class GameProperties {

    private GridSize gridSize;
    private FleetType fleetType;
    private Impl impl;

    public GridSize getGridSize() {
        return gridSize;
    }

    public void setGridSize(GridSize gridSize) {
        this.gridSize = gridSize;
    }

    public FleetType getFleetType() {
        return fleetType;
    }

    public void setFleetType(FleetType fleetType) {
        this.fleetType = fleetType;
    }

    public Impl getImpl() {
        return impl;
    }

    public void setImpl(Impl impl) {
        this.impl = impl;
    }

    // ---------------------------------------------------------------------------------------------------------------

    public static class FleetType {

        private Mode mode;
        private Sizes sizes;

        public enum Mode {
            CURVED,
            STRAIGHT;
        }

        public enum Sizes {
            RUSSIAN,
            CLASSIC_ONE,
            CLASSIC_TWO,
        }

        public Mode getMode() {
            return mode;
        }

        public void setMode(Mode mode) {
            this.mode = mode;
        }

        public Sizes getSizes() {
            return sizes;
        }

        public void setSizes(Sizes sizes) {
            this.sizes = sizes;
        }
    }

    // ---------------------------------------------------------------------------------------------------------------

    public static class GridSize {

        private int rows;
        private int cols;

        public int getRows() {
            return rows;
        }

        public void setRows(int rows) {
            this.rows = rows;
        }

        public int getCols() {
            return cols;
        }

        public void setCols(int cols) {
            this.cols = cols;
        }
    }

    // ---------------------------------------------------------------------------------------------------------------

    public static class Impl {

        private int idLen;
        private int locksNo;

        public int getIdLen() {
            return idLen;
        }

        public void setIdLen(int idLen) {
            this.idLen = idLen;
        }

        public int getLocksNo() {
            return locksNo;
        }

        public void setLocksNo(int locksNo) {
            this.locksNo = locksNo;
        }
    }
}
