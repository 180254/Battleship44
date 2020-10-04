package pl.nn44.battleship.service;

import java.util.Map;
import java.util.TreeMap;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class MetricsService {

  private final Map<String, Supplier<?>> deliverableMetrics = new ConcurrentHashMap<>();
  private final Map<String, AtomicInteger> countableMetrics = new ConcurrentHashMap<>();

  public Map<String, Object> getMetrics() {
    Stream<Map.Entry<String, Object>> deliverableMetricStream = deliverableMetrics
        .entrySet().stream().map((entry) -> Map.entry(entry.getKey(), entry.getValue().get()));
    Stream<Map.Entry<String, AtomicInteger>> countableMetricsStream = countableMetrics
        .entrySet().stream();

    return Stream.concat(deliverableMetricStream, countableMetricsStream)
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (v1, v2) -> v1, TreeMap::new));
  }

  public void registerDeliverable(String key, Supplier<?> value) {
    deliverableMetrics.put(key, value);
  }

  public void increment(String key) {
    countableMetrics.computeIfAbsent(key, (key1) -> new AtomicInteger()).incrementAndGet();
  }
}
