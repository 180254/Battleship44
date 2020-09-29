package pl.nn44.battleship.gamerules;

public final class GameRulesBuilder {

  private GridSize gridSize;
  private FleetMode fleetMode;
  private FleetSizes fleetSizes;
  private boolean fleetCanTouchEachOtherDiagonally;
  private boolean showFieldsForSureEmpty;

  private GameRulesBuilder() {
  }

  public static GameRulesBuilder aGameRules() {
    return new GameRulesBuilder();
  }

  public static GameRulesBuilder aGameRules(GameRules gameRules) {
    return new GameRulesBuilder()
        .withGridSize(gameRules.getGridSize())
        .withFleetMode(gameRules.getFleetMode())
        .withFleetSizes(gameRules.getFleetSizes())
        .withFleetCanTouchEachOtherDiagonally(gameRules.isFleetCanTouchEachOtherDiagonally())
        .withShowFieldsForSureEmpty(gameRules.isShowFieldsForSureEmpty());
  }


  public GameRulesBuilder withGridSize(GridSize gridSize) {
    this.gridSize = gridSize;
    return this;
  }

  public GameRulesBuilder withFleetMode(FleetMode fleetMode) {
    this.fleetMode = fleetMode;
    return this;
  }

  public GameRulesBuilder withFleetSizes(FleetSizes fleetSizes) {
    this.fleetSizes = fleetSizes;
    return this;
  }

  public GameRulesBuilder withFleetCanTouchEachOtherDiagonally(boolean fleetCanTouchEachOtherDiagonally) {
    this.fleetCanTouchEachOtherDiagonally = fleetCanTouchEachOtherDiagonally;
    return this;
  }

  public GameRulesBuilder withShowFieldsForSureEmpty(boolean showFieldsForSureEmpty) {
    this.showFieldsForSureEmpty = showFieldsForSureEmpty;
    return this;
  }

  public GameRulesBuilder but() {
    return aGameRules()
        .withGridSize(gridSize)
        .withFleetMode(fleetMode)
        .withFleetSizes(fleetSizes)
        .withFleetCanTouchEachOtherDiagonally(fleetCanTouchEachOtherDiagonally)
        .withShowFieldsForSureEmpty(showFieldsForSureEmpty);
  }

  public GameRules build() {
    return new GameRules(gridSize, fleetMode, fleetSizes, fleetCanTouchEachOtherDiagonally, showFieldsForSureEmpty);
  }
}
