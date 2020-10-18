import * as $ from 'jquery';
import {htmlStrings} from './html-strings';

export type UiGameRulesChangeClickListener = (gameRuleName: string) => void;

export class UiGameRules {
  private readonly callbacks: Array<UiGameRulesChangeClickListener>;

  constructor() {
    this.callbacks = new Array<UiGameRulesChangeClickListener>();
  }

  public addGameRulesChangeClickListener(callback: UiGameRulesChangeClickListener): void {
    this.callbacks.push(callback);
  }

  public activateChanging(): void {
    $('[{0}]'.format(htmlStrings.game_rules.data_game_rules_change))
      .on('click', e =>
        this.callbacks.forEach(callback => {
          callback($(e.target).attr(htmlStrings.game_rules.data_game_rules_change)!);
        })
      )
      .addClass('change-enabled')
      .removeClass('change-disabled');
  }

  public deactivateChanging(): void {
    $('[{0}]'.format(htmlStrings.game_rules.data_game_rules_change))
      .off('click')
      .addClass('change-disabled')
      .removeClass('change-enabled');
  }
}
