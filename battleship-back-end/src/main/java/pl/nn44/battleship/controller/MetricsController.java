package pl.nn44.battleship.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.nn44.battleship.service.MetricsService;

@RestController
public class MetricsController {

  private final MetricsService metricsService;

  public MetricsController(MetricsService metricsService) {
    this.metricsService = metricsService;
  }

  @RequestMapping(value = "/metrics", produces = MediaType.APPLICATION_JSON_VALUE)
  public Object metrics() {
    return metricsService.getMetricsSnapshot();
  }
}
