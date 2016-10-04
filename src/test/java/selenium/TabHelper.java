package selenium;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

// helper methods tested on chrome 53
public class TabHelper {

    private final WebDriver driver;

    public TabHelper(WebDriver driver) {
        this.driver = driver;
    }

    public void create() {
        int size = handles().size();
        while (handles().size() != size + 1) { // wtf #0
            sendKeys(Keys.CONTROL + "t");
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

    public void reset() {
        List<String> handles = handles();

        while (handles.size() != 1) {
            String handle = handles.get(0);
            driver.switchTo().window(handle);

            sendKeys(Keys.CONTROL + "w");
            handles = handles(); // wtf #1
        }
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
