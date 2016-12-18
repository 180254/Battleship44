package selenium.helper;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class ElementHelper {

    private final WebDriver driver;

    public ElementHelper(WebDriver driver) {
        this.driver = driver;
    }

    public WebElement id_one(String id) {
        return driver.findElement(By.id(id));
    }

    public List<WebElement> id_list(String id) {
        return driver.findElements(By.id(id));
    }

    public WebElement css_one(String css) {
        return driver.findElement(By.cssSelector(css));
    }

    public List<WebElement> css_list(String css) {
        return driver.findElements(By.cssSelector(css));
    }

    public WebElement class_one(String clazz) {
        return driver.findElement(By.className(clazz));
    }

    public List<WebElement> class_list(String clazz) {
        return driver.findElements(By.className(clazz));
    }

    public WebElement tr_one(String trId) {
        return driver.findElement(By.cssSelector("*[data-i18n-path='" + trId + "']"));
    }

    public List<WebElement> tr_list(String trId) {
        return driver.findElements(By.cssSelector("*[data-i18n-path='" + trId + "']"));
    }

    public WebElement cell_one(String grid, int row, int col) {
        return driver.findElement(By.cssSelector(String.format(
                "#%s > table > tr:nth-child(%d) > td:nth-child(%d)", grid, row + 1, col + 1
        )));
    }

    public List<WebElement> cell_list(String grid, int row, int col) {
        return driver.findElements(By.cssSelector(String.format(
                "#%s > table > tr:nth-child(%d) > td:nth-child(%d)", grid, row - 1, col - 1
        )));
    }

    public WebElement flag_one(String lang) {
        return driver.findElement(By.cssSelector(String.format(
                "img[alt='%s']", lang
        )));
    }

    public List<WebElement> flag_list(String lang) {
        return driver.findElements(By.cssSelector(String.format(
                "img[alt='%s']", lang
        )));
    }
}
