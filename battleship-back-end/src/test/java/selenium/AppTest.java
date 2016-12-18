package selenium;

import org.jetbrains.annotations.NotNull;
import org.junit.*;
import org.junit.runners.MethodSorters;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.Wait;
import org.openqa.selenium.support.ui.WebDriverWait;
import selenium.helper.ElementHelper;
import selenium.helper.GeneralHelper;
import selenium.helper.TabHelper;

import java.util.Properties;
import java.util.concurrent.TimeUnit;

@Ignore("selenium test." +
        "- ignored while building." +
        "- remember to set your CHROME_DRIVER_PATH." +
        "- NOT a unit test. this is not even a 'real' test." +
        "- run whole test class, test are interdependent." +
        "- this test contains automated game flows/cases." +
        "- need to be verified by tester." +
        "- watch execution and verify if it seems to work." +
        "- race condition included.")
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class AppTest {

    static final String APP_URL = "http://localhost/";

    // http://chromedriver.storage.googleapis.com/index.html
    static final String CHROME_DRIVER_PATH = "C:\\chromedriver.exe";

    static WebDriver driver;
    static Wait<WebDriver> wait;
    static TabHelper th;
    static ElementHelper eh;
    static GeneralHelper gh;

    @BeforeClass
    public static void beforeClass() {
        Properties props = System.getProperties();
        props.setProperty("webdriver.chrome.driver", CHROME_DRIVER_PATH);

        driver = new ChromeDriver();
        driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);

        wait = new WebDriverWait(driver, 30);
        th = new TabHelper(driver);
        eh = new ElementHelper(driver);
        gh = new GeneralHelper(eh);
    }

    @AfterClass
    public static void afterClass() {
        driver.quit();
    }

    @After
    public void after() {
        gh.sleep(2000);
    }

    @Test
    public void a01_runs() {
        driver.get(APP_URL);

        wait.until((@NotNull WebDriver wd) ->
                !eh.id_one("info-game-url").getText().equals("?_text_?"));

        th.create();
        th.switchTo(0);
    }

    @Test
    public void a02_changesLang() {
        WebElement enFlag = eh.flag_one("en");
        WebElement plFlag = eh.flag_one("pl");

        enFlag.click();
        gh.sleep(1000);

        plFlag.click();
        gh.sleep(1000);

        enFlag.click();
        gh.sleep(1000);
    }

    @Test
    public void a03_gridVerificationFail1() {
        eh.cell_one("grid-shoot", 0, 1).click();

        eh.id_one("ok-ship-selection").click();
        wait.until((@NotNull WebDriver wd) -> eh.tr_list("put.fail").size() > 0);

        eh.cell_one("grid-shoot", 0, 1).click(); //r
    }

    @Test
    public void a04_gridVerificationFail2() {
        gh.clickProperShips();
        eh.cell_one("grid-shoot", 8, 8).click();

        eh.id_one("ok-ship-selection").click();
        wait.until((@NotNull WebDriver wd) -> eh.tr_list("put.fail").size() > 0);

        eh.cell_one("grid-shoot", 8, 8).click(); //r
        gh.clickProperShips(); //r
    }

    @Test
    public void a05_acceptsProperGrid() {
        gh.clickProperShips();

        eh.id_one("ok-ship-selection").click();
        wait.until((@NotNull WebDriver wd) -> eh.tr_list("tour.awaiting").size() > 0);
    }

    @Test
    public void a06_msgSecondUserGoneNoGame() {
        String gameUrl = eh.id_one("info-game-url").getText();

        th.switchTo(1);
        driver.get(gameUrl);
        wait.until((@NotNull WebDriver wd) -> eh.id_list("grid-shoot td").size() > 0);

        th.clear();
        th.switchTo(0);
        wait.until((@NotNull WebDriver wd) -> eh.tr_list("end.opp_gone").size() > 0);
    }

    @Test
    public void a07_msgSecondUserGameInProgress() {
        String gameUrl = eh.id_one("info-game-url").getText();

        th.switchTo(1);
        driver.get(gameUrl);
        wait.until((@NotNull WebDriver wd) -> eh.id_list("grid-shoot table").size() > 0);

        gh.clickProperShips();
        eh.id_one("ok-ship-selection").click();
        wait.until((@NotNull WebDriver wd) -> eh.tr_list("tour.shoot_me").size() > 0
                || eh.tr_list("tour.shoot_opp").size() > 0);
    }

    @Test
    public void a08_blinkingTitleIsTranslated() {
        WebElement enFlag = eh.flag_one("en");
        WebElement plFlag = eh.flag_one("pl");

        enFlag.click();
        gh.sleep(2000);

        plFlag.click();
        gh.sleep(2000);

        enFlag.click();
        gh.sleep(2000);
    }

    @Test
    public void a09_msgUserGoneGameInterrupted() {
        th.clear();
        th.switchTo(0);
        wait.until((@NotNull WebDriver wd) -> eh.tr_list("end.next_game").size() > 0);
        eh.id_one("ok-game-next").click();
    }

    @Test
    public void a10_gameFlowWorks() {
        String gameUrl = eh.id_one("info-game-url").getText();

        th.switchTo(1);
        driver.get(gameUrl);
        wait.until((@NotNull WebDriver wd) -> eh.id_list("grid-shoot table").size() > 0);

        for (int i = 0; i < 5; i++) {
            System.out.println("GAME=" + i);

            th.switchTo(0);
            gh.clickProperShips();
            eh.id_one("ok-ship-selection").click();

            th.switchTo(1);
            gh.clickProperShips();
            eh.id_one("ok-ship-selection").click();

            wait.until((@NotNull WebDriver wd) -> eh.tr_list("tour.shoot_me").size() > 0
                    || eh.tr_list("tour.shoot_opp").size() > 0);

            if (i == 0) { // one bad click
                if (eh.tr_list("tour.shoot_me").size() > 0) {
                    eh.cell_one("grid-shoot", 5, 5).click();
                } else {
                    th.switchTo(0);
                    eh.cell_one("grid-shoot", 5, 5).click();
                    th.switchTo(1);
                }
            }

            if (eh.tr_list("tour.shoot_me").size() > 0) {
                gh.clickProperShips();
            } else {
                th.switchTo(0);
                gh.clickProperShips();
            }

            for (int s = 0; s < 2; s++) {
                th.switchTo(s);
                wait.until((@NotNull WebDriver wd) -> eh.tr_list("end.next_game").size() > 0);
                eh.id_one("ok-game-next").click();
            }
        }
    }
}
