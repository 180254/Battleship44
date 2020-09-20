package pl.nn44.battleship;


import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@SpringBootTest
@ExtendWith(SpringExtension.class)
@Disabled("Exception: Not running on Jetty, WebSocket support unavailable") // !?
public class ApplicationTests {

  @Test
  public void contextLoads() {

  }
}
