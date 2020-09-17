package pl.nn44.battleship.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.StringJoiner;

@ConfigurationProperties(prefix = "game")
@Component
public class GameProperties {

  private GridSize gridSize;
  private FleetType fleetType;
  private Impl impl;
  private Ws ws;

  public GridSize getGridSize() {
    return gridSize;
  }

  public void setGridSize(GridSize gridSize) {
    this.gridSize = gridSize;
  }

  public FleetType getFleetType() {
    return fleetType;
  }

  public void setFleetType(FleetType fleetType) {
    this.fleetType = fleetType;
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

  public static class FleetType {

    private Mode mode;
    private Sizes sizes;

    public Mode getMode() {
      return mode;
    }

    public void setMode(Mode mode) {
      this.mode = mode;
    }

    public Sizes getSizes() {
      return sizes;
    }

    public void setSizes(Sizes sizes) {
      this.sizes = sizes;
    }

    public enum Mode {
      CURVED,
      STRAIGHT
    }

    public enum Sizes {
      RUSSIAN,
      CLASSIC_ONE,
      CLASSIC_TWO,
    }

    @Override
    public String toString() {
      return new StringJoiner(", ", FleetType.class.getSimpleName() + "[", "]")
          .add("mode=" + mode)
          .add("sizes=" + sizes)
          .toString();
    }
  }

  public static class GridSize {

    private int rows;
    private int cols;

    public int getRows() {
      return rows;
    }

    public void setRows(int rows) {
      this.rows = rows;
    }

    public int getCols() {
      return cols;
    }

    public void setCols(int cols) {
      this.cols = cols;
    }

    @Override
    public String toString() {
      return new StringJoiner(", ", GridSize.class.getSimpleName() + "[", "]")
          .add("rows=" + rows)
          .add("cols=" + cols)
          .toString();
    }
  }

  public static class Impl {

    private int idLen;
    private int locksNo;

    public int getIdLen() {
      return idLen;
    }

    public void setIdLen(int idLen) {
      this.idLen = idLen;
    }

    public int getLocksNo() {
      return locksNo;
    }

    public void setLocksNo(int locksNo) {
      this.locksNo = locksNo;
    }

    @Override
    public String toString() {
      return new StringJoiner(", ", Impl.class.getSimpleName() + "[", "]")
          .add("idLen=" + idLen)
          .add("locksNo=" + locksNo)
          .toString();
    }
  }

  public static class Ws {

    private String[] confHandlers;
    private String[] confAllowedOrigins;
    private int policyMaxTextMessageSize;
    private int policyMaxBinaryMessageSize;
    private long policyIdleTimeoutMs;

    public String[] getConfHandlers() {
      return confHandlers;
    }

    public void setConfHandlers(String[] confHandlers) {
      this.confHandlers = confHandlers;
    }

    public String[] getConfAllowedOrigins() {
      return confAllowedOrigins;
    }

    public void setConfAllowedOrigins(String[] confAllowedOrigins) {
      this.confAllowedOrigins = confAllowedOrigins;
    }

    public int getPolicyMaxTextMessageSize() {
      return policyMaxTextMessageSize;
    }

    public void setPolicyMaxTextMessageSize(int policyMaxTextMessageSize) {
      this.policyMaxTextMessageSize = policyMaxTextMessageSize;
    }

    public int getPolicyMaxBinaryMessageSize() {
      return policyMaxBinaryMessageSize;
    }

    public void setPolicyMaxBinaryMessageSize(int policyMaxBinaryMessageSize) {
      this.policyMaxBinaryMessageSize = policyMaxBinaryMessageSize;
    }

    public long getPolicyIdleTimeoutMs() {
      return policyIdleTimeoutMs;
    }

    public void setPolicyIdleTimeoutMs(long policyIdleTimeoutMs) {
      this.policyIdleTimeoutMs = policyIdleTimeoutMs;
    }

    @Override
    public String toString() {
      return new StringJoiner(", ", Ws.class.getSimpleName() + "[", "]")
          .add("confHandlers=" + Arrays.toString(confHandlers))
          .add("confAllowedOrigins=" + Arrays.toString(confAllowedOrigins))
          .add("policyMaxTextMessageSize=" + policyMaxTextMessageSize)
          .add("policyMaxBinaryMessageSize=" + policyMaxBinaryMessageSize)
          .add("policyIdleTimeoutMs=" + policyIdleTimeoutMs)
          .toString();
    }
  }

  @Override
  public String toString() {
    return new StringJoiner(", ", GameProperties.class.getSimpleName() + "[", "]")
        .add("gridSize=" + gridSize)
        .add("fleetType=" + fleetType)
        .add("impl=" + impl)
        .add("ws=" + ws)
        .toString();
  }
}
