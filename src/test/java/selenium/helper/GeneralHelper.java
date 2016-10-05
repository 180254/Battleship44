package selenium.helper;

// random helper methods
public class GeneralHelper {

    private final ElementHelper eh;

    public GeneralHelper(ElementHelper eh) {
        this.eh = eh;
    }

    public void clickProperShips() {
        eh.cell_one("grid-shoot", 0, 0).click();
        eh.cell_one("grid-shoot", 1, 0).click();
        eh.cell_one("grid-shoot", 2, 0).click();
        eh.cell_one("grid-shoot", 3, 0).click();
        eh.cell_one("grid-shoot", 0, 2).click();
        eh.cell_one("grid-shoot", 1, 2).click();
        eh.cell_one("grid-shoot", 2, 2).click();
        eh.cell_one("grid-shoot", 0, 4).click();
        eh.cell_one("grid-shoot", 1, 4).click();
        eh.cell_one("grid-shoot", 2, 4).click();
        eh.cell_one("grid-shoot", 5, 0).click();
        eh.cell_one("grid-shoot", 6, 0).click();
        eh.cell_one("grid-shoot", 5, 2).click();
        eh.cell_one("grid-shoot", 6, 2).click();
        eh.cell_one("grid-shoot", 5, 4).click();
        eh.cell_one("grid-shoot", 6, 4).click();
        eh.cell_one("grid-shoot", 8, 0).click();
        eh.cell_one("grid-shoot", 8, 2).click();
        eh.cell_one("grid-shoot", 8, 4).click();
        eh.cell_one("grid-shoot", 8, 6).click();
    }

    public void sleep(int milliseconds) {
        try {
            Thread.sleep(milliseconds);
        } catch (InterruptedException ignored) {
        }
    }
}
