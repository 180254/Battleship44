package selenium;

import org.junit.jupiter.api.*;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.Wait;
import org.openqa.selenium.support.ui.WebDriverWait;
import selenium.helper.ElementHelper;
import selenium.helper.GeneralHelper;
import selenium.helper.TabHelper;

import javax.annotation.Nonnull;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Disabled(
    "selenium test" +
        "- ignored while building" +
        "- NOT a unit test. this is not even a 'real' test" +
        "- run whole test class, test are interdependent" +
        "- this test contains automated game flows/cases" +
        "- need to be verified by tester" +
        "- watch execution and verify if it seems to work" +
        "- race conditions are included"
)
@TestMethodOrder(MethodOrderer.MethodName.class)
public class SeleniumTest {

  static final String APP_URL = "http://localhost:8090/";

  static RemoteWebDriver driver;
  static Wait<WebDriver> wait;
  static TabHelper tabHelper;
  static ElementHelper elementHelper;
  static GeneralHelper generalHelper;

  @BeforeAll
  public static void beforeClass() {
    driver = new ChromeDriver();
    driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);

    wait = new WebDriverWait(driver, 30);
    tabHelper = new TabHelper(driver);
    elementHelper = new ElementHelper(driver);
    generalHelper = new GeneralHelper(elementHelper);
  }

  @AfterAll
  public static void afterClass() {
    driver.quit();
  }

  @AfterEach
  public void after() {
    generalHelper.sleep(500);
  }

  @Test
  public void a01_runs() {
    driver.get(APP_URL);

    wait.until((@Nonnull WebDriver wd) ->
        !elementHelper.oneById("info-game-url").getText().equals("?_text_?"));

    tabHelper.create();
    tabHelper.switchTo(0);
  }

  @Test
  public void a02_changesLang() {
    WebElement enFlag = elementHelper.oneFlag("en");
    WebElement plFlag = elementHelper.oneFlag("pl");

    enFlag.click();
    generalHelper.sleep(1000);

    plFlag.click();
    generalHelper.sleep(1000);

    enFlag.click();
    generalHelper.sleep(1000);
  }

  @Test
  public void a03_changesTheme() {
    WebElement themeSwitcher = elementHelper.oneById("theme-switcher");

    themeSwitcher.click();
    generalHelper.sleep(1000);

    themeSwitcher.click();
    generalHelper.sleep(1000);

    themeSwitcher.click();
    generalHelper.sleep(1000);
  }

  @Test
  public void a04_putsRandomFleet() {
    WebElement randomFleet = elementHelper.oneById("random-ship-selection");

    randomFleet.click();
    generalHelper.sleep(1000);

    randomFleet.click();
    generalHelper.sleep(1000);
  }

  @Test
  public void a05_changesGameRules() {
    List<WebElement> gameRulesChangers = elementHelper.listByCss("[data-game-rules-change]");
    WebElement randomFleet = elementHelper.oneById("random-ship-selection");

    for (WebElement gameRulesChanger : gameRulesChangers) {
      gameRulesChanger.click();
      randomFleet.click();
      generalHelper.sleep(1000);
    }

    driver.get(APP_URL);
    generalHelper.sleep(1000);
  }

  @Test
  public void a06_gridVerificationFail1() {
    elementHelper.oneCell("grid-shoot", 0, 1).click();

    elementHelper.oneById("ok-ship-selection").click();
    wait.until((@Nonnull WebDriver wd) -> elementHelper.listByI18n("put.fail").size() > 0);

    elementHelper.oneCell("grid-shoot", 0, 1).click(); //r
  }

  @Test
  public void a07_gridVerificationFail2() {
    generalHelper.clickProperShips();
    elementHelper.oneCell("grid-shoot", 8, 8).click();

    elementHelper.oneById("ok-ship-selection").click();
    wait.until((@Nonnull WebDriver wd) -> elementHelper.listByI18n("put.fail").size() > 0);

    elementHelper.oneCell("grid-shoot", 8, 8).click(); //r
    generalHelper.clickProperShips(); //r
  }

  @Test
  public void a08_acceptsProperGrid() {
    generalHelper.clickProperShips();

    elementHelper.oneById("ok-ship-selection").click();
    wait.until((@Nonnull WebDriver wd) -> elementHelper.listByI18n("tour.awaiting").size() > 0);
  }

  @Test
  public void a09_msgSecondUserGoneNoGame() {
    String gameUrl = elementHelper.oneById("info-game-url").getText();

    tabHelper.switchTo(1);
    driver.get(gameUrl);
    wait.until((@Nonnull WebDriver wd) -> elementHelper.listByCss("#grid-shoot td").size() > 0);

    tabHelper.clear();
    tabHelper.switchTo(0);
    wait.until((@Nonnull WebDriver wd) -> elementHelper.listByI18n("end.opp_gone").size() > 0);

    generalHelper.sleep(1000);
  }

  @Test
  public void a10_msgSecondUserGameInProgress() {
    String gameUrl = elementHelper.oneById("info-game-url").getText();

    tabHelper.switchTo(1);
    driver.get(gameUrl);
    wait.until((@Nonnull WebDriver wd) -> elementHelper.listByCss("#grid-shoot table").size() > 0);

    generalHelper.clickProperShips();
    elementHelper.oneById("ok-ship-selection").click();
    wait.until((@Nonnull WebDriver wd) -> elementHelper.listByI18n("tour.shoot_me").size() > 0
        || elementHelper.listByI18n("tour.shoot_opp").size() > 0);
  }

  @Test
  public void a11_blinkingTitleIsTranslated() {
    WebElement enFlag = elementHelper.oneFlag("en");
    WebElement plFlag = elementHelper.oneFlag("pl");

    enFlag.click();
    generalHelper.sleep(1000);

    plFlag.click();
    generalHelper.sleep(2000);

    enFlag.click();
    generalHelper.sleep(1000);
  }

  @Test
  public void a12_msgUserGoneGameInterrupted() {
    tabHelper.clear();
    tabHelper.switchTo(0);
    wait.until((@Nonnull WebDriver wd) -> elementHelper.listByI18n("end.next_game").size() > 0);
    generalHelper.sleep(2000);
    elementHelper.oneById("ok-game-next").click();
  }

  @Test
  public void a13_gameFlowWorks() {
    String gameUrl = elementHelper.oneById("info-game-url").getText();

    tabHelper.switchTo(1);
    driver.get(gameUrl);
    wait.until((@Nonnull WebDriver wd) -> elementHelper.listByCss("#grid-shoot table").size() > 0);

    for (int i = 0; i < 5; i++) {
      System.out.println("GAME=" + i);

      tabHelper.switchTo(0);
      generalHelper.clickProperShips();
      elementHelper.oneById("ok-ship-selection").click();

      tabHelper.switchTo(1);
      generalHelper.clickProperShips();
      elementHelper.oneById("ok-ship-selection").click();

      wait.until((@Nonnull WebDriver wd) -> elementHelper.listByI18n("tour.shoot_me").size() > 0
          || elementHelper.listByI18n("tour.shoot_opp").size() > 0);

      if (i == 0) { // one bad click
        if (elementHelper.listByI18n("tour.shoot_me").size() > 0) {
          elementHelper.oneCell("grid-shoot", 5, 5).click();
        } else {
          tabHelper.switchTo(0);
          elementHelper.oneCell("grid-shoot", 5, 5).click();
          tabHelper.switchTo(1);
        }
      }

      if (elementHelper.listByI18n("tour.shoot_me").size() <= 0) {
        tabHelper.switchTo(0);
      }
      generalHelper.clickProperShips();

      for (int s = 0; s < 2; s++) {
        tabHelper.switchTo(s);
        wait.until((@Nonnull WebDriver wd) -> elementHelper.listByI18n("end.next_game").size() > 0);
        elementHelper.oneById("ok-game-next").click();
      }
    }
  }
}
