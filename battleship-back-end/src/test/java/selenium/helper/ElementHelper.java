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

  public WebElement oneById(String id) {
    return driver.findElement(By.id(id));
  }

  public List<WebElement> listById(String id) {
    return driver.findElements(By.id(id));
  }

  public WebElement oneByCss(String css) {
    return driver.findElement(By.cssSelector(css));
  }

  public List<WebElement> listByCss(String css) {
    return driver.findElements(By.cssSelector(css));
  }

  public WebElement oneByClass(String clazz) {
    return driver.findElement(By.className(clazz));
  }

  public List<WebElement> ListByClass(String clazz) {
    return driver.findElements(By.className(clazz));
  }

  public WebElement oneByI18n(String i18n) {
    return driver.findElement(By.cssSelector("*[data-i18n-path='" + i18n + "']"));
  }

  public List<WebElement> listByI18n(String i18n) {
    return driver.findElements(By.cssSelector("*[data-i18n-path='" + i18n + "']"));
  }

  public WebElement oneCell(String grid, int row, int col) {
    return driver.findElement(By.cssSelector(String.format(
        "#%s > table > tr:nth-child(%d) > td:nth-child(%d)", grid, row + 1, col + 1
    )));
  }

  public List<WebElement> listOfCell(String grid, int row, int col) {
    return driver.findElements(By.cssSelector(String.format(
        "#%s > table > tr:nth-child(%d) > td:nth-child(%d)", grid, row - 1, col - 1
    )));
  }

  public WebElement oneFlag(String lang) {
    return driver.findElement(By.cssSelector(String.format(
        "img[alt='%s']", lang
    )));
  }

  public List<WebElement> listFlags(String lang) {
    return driver.findElements(By.cssSelector(String.format(
        "img[alt='%s']", lang
    )));
  }
}
