package selenium.helper;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.remote.RemoteWebDriver;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

// selenium tests on more than one tab
// code is/may be not general: tested on chrome 53
public class TabHelper {

  private final RemoteWebDriver driver;

  public TabHelper(RemoteWebDriver driver) {
    this.driver = driver;
  }

  public void create() {
    int size = handles().size();
    while (handles().size() != size + 1) {
      driver.executeScript("window.open('');");
    }

    driver.switchTo().window(
        handles().get(size)
    );
  }

  public void switchTo(int index) {
    String windowNumber = Integer.toString(index + 1);

    sendKeys(Keys.CONTROL + windowNumber);

    driver.switchTo().window(
        handles().get(index)
    );
  }

  public void clear() {
    driver.get("about:blank");
  }

  private void sendKeys(String keys) {
    driver
        .findElement(By.cssSelector("body"))
        .sendKeys(keys);
  }

  private List<String> handles() {
    Set<String> handles = driver.getWindowHandles();
    return new ArrayList<>(handles);
  }
}
