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
import java.util.concurrent.TimeUnit;

@Disabled("selenium test." +
    "- ignored while building." +
    "- NOT a unit test. this is not even a 'real' test." +
    "- run whole test class, test are interdependent." +
    "- this test contains automated game flows/cases." +
    "- need to be verified by tester." +
    "- watch execution and verify if it seems to work." +
    "- race condition included.")
@TestMethodOrder(MethodOrderer.Alphanumeric.class)
public class AppTest {

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
    generalHelper.sleep(2000);
  }

  @Test
  public void a01_runs() {
    driver.get(APP_URL);

    wait.until((@Nonnull WebDriver wd) ->
        !elementHelper.id_one("info-game-url").getText().equals("?_text_?"));

    tabHelper.create();
    tabHelper.switchTo(0);
  }

  @Test
  public void a02_changesLang() {
    WebElement enFlag = elementHelper.flag_one("en");
    WebElement plFlag = elementHelper.flag_one("pl");

    enFlag.click();
    generalHelper.sleep(1000);

    plFlag.click();
    generalHelper.sleep(1000);

    enFlag.click();
    generalHelper.sleep(1000);
  }

  @Test
  public void a03_gridVerificationFail1() {
    elementHelper.cell_one("grid-shoot", 0, 1).click();

    elementHelper.id_one("ok-ship-selection").click();
    wait.until((@Nonnull WebDriver wd) -> elementHelper.i18n_list("put.fail").size() > 0);

    elementHelper.cell_one("grid-shoot", 0, 1).click(); //r
  }

  @Test
  public void a04_gridVerificationFail2() {
    generalHelper.clickProperShips();
    elementHelper.cell_one("grid-shoot", 8, 8).click();

    elementHelper.id_one("ok-ship-selection").click();
    wait.until((@Nonnull WebDriver wd) -> elementHelper.i18n_list("put.fail").size() > 0);

    elementHelper.cell_one("grid-shoot", 8, 8).click(); //r
    generalHelper.clickProperShips(); //r
  }

  @Test
  public void a05_acceptsProperGrid() {
    generalHelper.clickProperShips();

    elementHelper.id_one("ok-ship-selection").click();
    wait.until((@Nonnull WebDriver wd) -> elementHelper.i18n_list("tour.awaiting").size() > 0);
  }

  @Test
  public void a06_msgSecondUserGoneNoGame() {
    String gameUrl = elementHelper.id_one("info-game-url").getText();

    tabHelper.switchTo(1);
    driver.get(gameUrl);
    wait.until((@Nonnull WebDriver wd) -> elementHelper.css_list("#grid-shoot td").size() > 0);

    tabHelper.clear();
    tabHelper.switchTo(0);
    wait.until((@Nonnull WebDriver wd) -> elementHelper.i18n_list("end.opp_gone").size() > 0);
  }

  @Test
  public void a07_msgSecondUserGameInProgress() {
    String gameUrl = elementHelper.id_one("info-game-url").getText();

    tabHelper.switchTo(1);
    driver.get(gameUrl);
    wait.until((@Nonnull WebDriver wd) -> elementHelper.css_list("#grid-shoot table").size() > 0);

    generalHelper.clickProperShips();
    elementHelper.id_one("ok-ship-selection").click();
    wait.until((@Nonnull WebDriver wd) -> elementHelper.i18n_list("tour.shoot_me").size() > 0
        || elementHelper.i18n_list("tour.shoot_opp").size() > 0);
  }

  @Test
  public void a08_blinkingTitleIsTranslated() {
    WebElement enFlag = elementHelper.flag_one("en");
    WebElement plFlag = elementHelper.flag_one("pl");

    enFlag.click();
    generalHelper.sleep(2000);

    plFlag.click();
    generalHelper.sleep(2000);

    enFlag.click();
    generalHelper.sleep(2000);
  }

  @Test
  public void a09_msgUserGoneGameInterrupted() {
    tabHelper.clear();
    tabHelper.switchTo(0);
    wait.until((@Nonnull WebDriver wd) -> elementHelper.i18n_list("end.next_game").size() > 0);
    elementHelper.id_one("ok-game-next").click();
  }

  @Test
  public void a10_gameFlowWorks() {
    String gameUrl = elementHelper.id_one("info-game-url").getText();

    tabHelper.switchTo(1);
    driver.get(gameUrl);
    wait.until((@Nonnull WebDriver wd) -> elementHelper.css_list("#grid-shoot table").size() > 0);

    for (int i = 0; i < 5; i++) {
      System.out.println("GAME=" + i);

      tabHelper.switchTo(0);
      generalHelper.clickProperShips();
      elementHelper.id_one("ok-ship-selection").click();

      tabHelper.switchTo(1);
      generalHelper.clickProperShips();
      elementHelper.id_one("ok-ship-selection").click();

      wait.until((@Nonnull WebDriver wd) -> elementHelper.i18n_list("tour.shoot_me").size() > 0
          || elementHelper.i18n_list("tour.shoot_opp").size() > 0);

      if (i == 0) { // one bad click
        if (elementHelper.i18n_list("tour.shoot_me").size() > 0) {
          elementHelper.cell_one("grid-shoot", 5, 5).click();
        } else {
          tabHelper.switchTo(0);
          elementHelper.cell_one("grid-shoot", 5, 5).click();
          tabHelper.switchTo(1);
        }
      }

      if (elementHelper.i18n_list("tour.shoot_me").size() <= 0) {
        tabHelper.switchTo(0);
      }
      generalHelper.clickProperShips();

      for (int s = 0; s < 2; s++) {
        tabHelper.switchTo(s);
        wait.until((@Nonnull WebDriver wd) -> elementHelper.i18n_list("end.next_game").size() > 0);
        elementHelper.id_one("ok-game-next").click();
      }
    }
  }
}
