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

    private int idLen;

    public int getIdLen() {
      return idLen;
    }

    public void setIdLen(int idLen) {
      this.idLen = idLen;
    }


    @Override
    public String toString() {
      return new StringJoiner(", ", Impl.class.getSimpleName() + "[", "]")
          .add("idLen=" + idLen)
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
}
