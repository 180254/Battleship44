package pl.nn44.battleship.configuration;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.util.unit.DataSize;
import pl.nn44.battleship.gamerules.GameRules;
import pl.nn44.battleship.util.DataSizeSerializer;

import java.time.Duration;
import java.util.Arrays;
import java.util.StringJoiner;

@ConfigurationProperties(prefix = "game", ignoreInvalidFields = false, ignoreUnknownFields = false)
public class GameProperties {

  private GameRules rules;
  private Impl impl;
  private Ws ws;

  public GameRules getRules() {
    return rules;
  }

  public void setRules(GameRules rules) {
    this.rules = rules;
  }

  public Impl getImpl() {
    return impl;
  }

  public void setImpl(Impl impl) {
    this.impl = impl;
  }

  public Ws getWs() {
    return ws;
  }

  public void setWs(Ws ws) {
    this.ws = ws;
  }

  @Override
  public String toString() {
    return new StringJoiner(", ", GameProperties.class.getSimpleName() + "[", "]")
        .add("rules=" + rules)
        .add("impl=" + impl)
        .add("ws=" + ws)
        .toString();
  }

  public static class Impl {

    private BigIdGeneratorConfig bigIdGeneratorConfig;
    private LockerImplConfig lockerImplConfig;
    private MonteCarloFleetConfig monteCarloFleetConfig;
    private MatchMakingServiceConfig matchMakingServiceConfig;

    public BigIdGeneratorConfig getBigIdGeneratorConfig() {
      return bigIdGeneratorConfig;
    }

    public void setBigIdGeneratorConfig(BigIdGeneratorConfig bigIdGeneratorConfig) {
      this.bigIdGeneratorConfig = bigIdGeneratorConfig;
    }

    public LockerImplConfig getLockerImplConfig() {
      return lockerImplConfig;
    }

    public void setLockerImplConfig(LockerImplConfig lockerImplConfig) {
      this.lockerImplConfig = lockerImplConfig;
    }

    public MonteCarloFleetConfig getMonteCarloFleetConfig() {
      return monteCarloFleetConfig;
    }

    public void setMonteCarloFleetConfig(MonteCarloFleetConfig monteCarloFleetConfig) {
      this.monteCarloFleetConfig = monteCarloFleetConfig;
    }

    public MatchMakingServiceConfig getMatchMakingServiceConfig() {
      return matchMakingServiceConfig;
    }

    public void setMatchMakingServiceConfig(MatchMakingServiceConfig matchMakingServiceConfig) {
      this.matchMakingServiceConfig = matchMakingServiceConfig;
    }

    @Override
    public String toString() {
      return new StringJoiner(", ", Impl.class.getSimpleName() + "[", "]")
          .add("bigIdGeneratorConfig=" + bigIdGeneratorConfig)
          .add("lockerImplConfig=" + lockerImplConfig)
          .add("monteCarloFleetConfig=" + monteCarloFleetConfig)
          .add("matchMakingServiceConfig=" + matchMakingServiceConfig)
          .toString();
    }
  }

  public static class Ws {

    private String[] confHandlers;
    private String[] confAllowedOrigins;
    private DataSize policyMaxTextMessageBufferSize;
    private DataSize policyMaxBinaryMessageBufferSize;
    private Duration policyIdleTimeout;

    public String[] getConfHandlers() {
      return Arrays.copyOf(confHandlers, confHandlers.length);
    }

    public void setConfHandlers(String[] confHandlers) {
      this.confHandlers = Arrays.copyOf(confHandlers, confHandlers.length);
    }

    public String[] getConfAllowedOrigins() {
      return Arrays.copyOf(confAllowedOrigins, confAllowedOrigins.length);
    }

    public void setConfAllowedOrigins(String[] confAllowedOrigins) {
      this.confAllowedOrigins = Arrays.copyOf(confAllowedOrigins, confAllowedOrigins.length);
    }

    @JsonSerialize(using = DataSizeSerializer.class)
    public DataSize getPolicyMaxTextMessageBufferSize() {
      return policyMaxTextMessageBufferSize;
    }

    public void setPolicyMaxTextMessageBufferSize(DataSize policyMaxTextMessageBufferSize) {
      this.policyMaxTextMessageBufferSize = policyMaxTextMessageBufferSize;
    }

    @JsonSerialize(using = DataSizeSerializer.class)
    public DataSize getPolicyMaxBinaryMessageBufferSize() {
      return policyMaxBinaryMessageBufferSize;
    }

    public void setPolicyMaxBinaryMessageBufferSize(DataSize policyMaxBinaryMessageBufferSize) {
      this.policyMaxBinaryMessageBufferSize = policyMaxBinaryMessageBufferSize;
    }

    public Duration getPolicyIdleTimeout() {
      return policyIdleTimeout;
    }

    public void setPolicyIdleTimeout(Duration policyIdleTimeout) {
      this.policyIdleTimeout = policyIdleTimeout;
    }

    @Override
    public String toString() {
      return new StringJoiner(", ", Ws.class.getSimpleName() + "[", "]")
          .add("confHandlers=" + Arrays.toString(confHandlers))
          .add("confAllowedOrigins=" + Arrays.toString(confAllowedOrigins))
          .add("policyMaxTextMessageBufferSize=" + policyMaxTextMessageBufferSize)
          .add("policyMaxBinaryMessageBufferSize=" + policyMaxBinaryMessageBufferSize)
          .add("policyIdleTimeout=" + policyIdleTimeout)
          .toString();
    }
  }

  public static class BigIdGeneratorConfig {

    private int chars;

    public int getChars() {
      return chars;
    }

    public void setChars(int chars) {
      this.chars = chars;
    }

    @Override
    public String toString() {
      return new StringJoiner(", ", BigIdGeneratorConfig.class.getSimpleName() + "[", "]")
          .add("chars=" + chars)
          .toString();
    }
  }

  public static class LockerImplConfig {

    private int initialCapacity;

    public int getInitialCapacity() {
      return initialCapacity;
    }

    public void setInitialCapacity(int initialCapacity) {
      this.initialCapacity = initialCapacity;
    }

    @Override
    public String toString() {
      return new StringJoiner(", ", LockerImplConfig.class.getSimpleName() + "[", "]")
          .add("initialCapacity=" + initialCapacity)
          .toString();
    }
  }

  public static class MonteCarloFleetConfig {

    private int corePoolSize;
    private int maximumPoolSize;
    private Duration keepAliveTime;
    private Duration timeout;

    public int getCorePoolSize() {
      return corePoolSize;
    }

    public void setCorePoolSize(int corePoolSize) {
      this.corePoolSize = corePoolSize;
    }

    public int getMaximumPoolSize() {
      return maximumPoolSize;
    }

    public void setMaximumPoolSize(int maximumPoolSize) {
      this.maximumPoolSize = maximumPoolSize;
    }

    public Duration getKeepAliveTime() {
      return keepAliveTime;
    }

    public void setKeepAliveTime(Duration keepAliveTime) {
      this.keepAliveTime = keepAliveTime;
    }

    public Duration getTimeout() {
      return timeout;
    }

    public void setTimeout(Duration timeout) {
      this.timeout = timeout;
    }

    @Override
    public String toString() {
      return new StringJoiner(", ", MonteCarloFleetConfig.class.getSimpleName() + "[", "]")
          .add("corePoolSize=" + corePoolSize)
          .add("maximumPoolSize=" + maximumPoolSize)
          .add("keepAliveTime=" + keepAliveTime)
          .add("timeout=" + timeout)
          .toString();
    }
  }

  public static class MatchMakingServiceConfig {

    private int corePoolSize;
    private Duration attemptInitialDelay;
    private Duration attemptPeriod;
    private Duration timeout;

    public int getCorePoolSize() {
      return corePoolSize;
    }

    public void setCorePoolSize(int corePoolSize) {
      this.corePoolSize = corePoolSize;
    }

    public Duration getAttemptInitialDelay() {
      return attemptInitialDelay;
    }

    public void setAttemptInitialDelay(Duration attemptInitialDelay) {
      this.attemptInitialDelay = attemptInitialDelay;
    }

    public Duration getAttemptPeriod() {
      return attemptPeriod;
    }

    public void setAttemptPeriod(Duration attemptPeriod) {
      this.attemptPeriod = attemptPeriod;
    }

    public Duration getTimeout() {
      return timeout;
    }

    public void setTimeout(Duration timeout) {
      this.timeout = timeout;
    }

    @Override
    public String toString() {
      return new StringJoiner(", ", MatchMakingServiceConfig.class.getSimpleName() + "[", "]")
          .add("corePoolSize=" + corePoolSize)
          .add("attemptInitialDelay=" + attemptInitialDelay)
          .add("attemptPeriod=" + attemptPeriod)
          .add("timeout=" + timeout)
          .toString();
    }
  }
}
