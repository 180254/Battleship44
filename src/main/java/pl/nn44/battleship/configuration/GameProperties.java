package pl.nn44.battleship.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "game")
class GameProperties {

    private GridSize gridSize;
    private FleetType fleetType;

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

    private enum FleetType {
        RUSSIAN, RUSSIAN_CURVED
    }

    private static class GridSize {

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
}
