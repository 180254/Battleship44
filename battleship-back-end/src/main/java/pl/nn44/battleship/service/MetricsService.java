package pl.nn44.battleship.service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Supplier;
import java.util.stream.Collectors;

public class MetricsService {

  private final Map<String, Supplier<?>> deliverable = new ConcurrentHashMap<>();
  private final Map<String, AtomicInteger> countable = new ConcurrentHashMap<>();
  private final Map<String, Set<Integer>> inimitable = new ConcurrentHashMap<>();

  public Map<String, Object> getMetrics() {
    Map<String, Object> metrics = new TreeMap<>();

    metrics.put("deliverable", deliverable
        .entrySet().stream().map((entry) -> Map.entry(entry.getKey(), entry.getValue().get()))
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (v1, v2) -> v1, TreeMap::new)));

    metrics.put("countable", countable
        .entrySet().stream()
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (v1, v2) -> v1, TreeMap::new)));

    metrics.put("inimitable", inimitable
        .keySet().stream().map(key -> Map.entry(key, inimitable.get(key).size()))
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (v1, v2) -> v1, TreeMap::new)));

    return metrics;
  }

  public void registerDeliverable(String key, Supplier<?> value) {
    deliverable.put(key, value);
  }

  public void increment(String key) {
    countable.computeIfAbsent(key, (key1) -> new AtomicInteger()).incrementAndGet();
  }

  public void maybeUnique(String key, Object object) {
    inimitable
        .computeIfAbsent(key, key1 -> Collections.newSetFromMap(new ConcurrentHashMap<>()))
        .add(Objects.hash(object));
  }
}
