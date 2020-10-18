package pl.nn44.battleship.service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.LongAdder;
import java.util.function.Supplier;
import java.util.stream.Collectors;

public class MetricsService {

  private final Map<String, Supplier<?>> deliverable = new ConcurrentHashMap<>();
  private final Map<String, LongAdder> countable = new ConcurrentHashMap<>();
  private final Map<String, Set<Integer>> inimitable = new ConcurrentHashMap<>();
  private final Map<String, LongAdder> timeableTotal = new ConcurrentHashMap<>();
  private final Map<String, LongAdder> timeableCounter = new ConcurrentHashMap<>();

  public Map<String, Object> getMetricsSnapshot() {
    Map<String, Object> metrics = new TreeMap<>();

    metrics.put("deliverable", deliverable
        .entrySet().stream()
        .map((entry) -> Map.entry(entry.getKey(), entry.getValue().get()))
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (v1, v2) -> v1, TreeMap::new)));

    metrics.put("countable", countable
        .entrySet().stream()
        .map((entry) -> Map.entry(entry.getKey(), entry.getValue().sum()))
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (v1, v2) -> v1, TreeMap::new)));

    metrics.put("inimitable", inimitable
        .keySet().stream()
        .map(key -> Map.entry(key, inimitable.get(key).size()))
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (v1, v2) -> v1, TreeMap::new)));

    metrics.put("timeable", timeableCounter
        .keySet().stream()
        .map(key -> Map.entry(key, timeableTotal.get(key).sum() / timeableCounter.get(key).doubleValue()))
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (v1, v2) -> v1, TreeMap::new)));
    return metrics;
  }

  public void registerDeliverableMetric(String key, Supplier<?> value) {
    deliverable.put(key, value);
  }

  public void incrementCounter(String key) {
    countable.computeIfAbsent(key, (key1) -> new LongAdder()).increment();
  }

  public void countUniqueValues(String key, Object value) {
    inimitable
        .computeIfAbsent(key, key1 -> Collections.newSetFromMap(new ConcurrentHashMap<>()))
        .add(Objects.hash(value));
  }

  public void recordElapsedTime(String key, long duration, TimeUnit timeUnit) {
    timeableTotal.computeIfAbsent(key, (key1) -> new LongAdder()).add(timeUnit.toMillis(duration));
    timeableCounter.computeIfAbsent(key, (key1) -> new LongAdder()).increment();
  }
}
