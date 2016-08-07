package pl.nn44.battleship.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "game")
class GameProperties {

    private Grid grid;

    public Grid getGrid() {
        return grid;
    }

    public void setGrid(Grid grid) {
        this.grid = grid;
    }

    private static class Grid {

        private Size size;

        public Size getSize() {
            return size;
        }

        public void setSize(Size size) {
            this.size = size;
        }

        private static class Size {
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
}
