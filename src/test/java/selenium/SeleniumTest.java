package selenium;

import org.jetbrains.annotations.NotNull;
import org.junit.*;
import org.junit.runners.MethodSorters;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.Wait;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.Properties;
import java.util.concurrent.TimeUnit;

@Ignore("selenium test. ignored. " +
        "note: not everything is asserted. " +
        "some things need to be checked by tester while watching test execution")
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class SeleniumTest {

    static final String APP_URL = "http://localhost/";
    static final String CHROME_DRIVER_PATH = "C:\\chromedriver.exe";

    static WebDriver driver;
    final Wait<WebDriver> wait;
    final TabHelper th;

    public SeleniumTest() {
        Properties props = System.getProperties();
        props.setProperty("webdriver.chrome.driver", CHROME_DRIVER_PATH);

        driver = new ChromeDriver();
        driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);

        wait = new WebDriverWait(driver, 30);
        th = new TabHelper(driver);
    }

    private static void sleep(int millisecond) {
        try {
            Thread.sleep(millisecond);
        } catch (InterruptedException ignored) {
        }
    }

    @AfterClass
    public static void afterClass() {
        driver.quit();
        sleep(1500);
    }

    @After
    public void after() {
        th.reset();

    }

    @Test
    public void a00_itLoads() {
        driver.get(APP_URL);

        wait.until((@NotNull WebDriver wd) ->
                !wd.findElement(By.id("info-game-url")).getText().equals("?_text_?"));
    }

    @Test
    public void a01_itChangeLang() {
        driver.get(APP_URL);

        WebElement enFlag = driver.findElement(By.cssSelector("img[alt='en']"));
        WebElement plFlag = driver.findElement(By.cssSelector("img[alt='pl']"));

        enFlag.click();
        sleep(1000);

        plFlag.click();
        sleep(1000);

        enFlag.click();
        sleep(1000);
    }
}
