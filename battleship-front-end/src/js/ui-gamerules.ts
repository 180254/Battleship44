import {Document2} from './document2';
import {htmlStrings} from './html-strings';

export type UiGameRulesChangeClickListener = (gameRuleName: string) => void;

export class UiGameRules {
  private readonly document2: Document2;
  private readonly callbacks: Array<UiGameRulesChangeClickListener>;

  constructor(document: Document2) {
    this.document2 = document;
    this.callbacks = new Array<UiGameRulesChangeClickListener>();
  }

  public addGameRulesChangeClickListener(callback: UiGameRulesChangeClickListener): void {
    this.callbacks.push(callback);
  }

  public activateChanging(): void {
    const gameRulesChangers: NodeListOf<HTMLElement> = document.querySelectorAll(
      htmlStrings.game_rules.selector.data_game_rules_change
    );

    gameRulesChangers.forEach(gameRulesChanger => {
      this.document2.addEventListener(gameRulesChanger, 'click', () => {
        this.callbacks.forEach(callback => {
          callback(
            gameRulesChanger.getAttribute(htmlStrings.game_rules.attribute.data_game_rules_change)!
          );
        });
      });

      gameRulesChanger.classList.replace(
        htmlStrings.game_rules.clazz.change_disabled,
        htmlStrings.game_rules.clazz.change_enabled
      );
    });
  }

  public deactivateChanging(): void {
    const gameRulesChangers: NodeListOf<HTMLElement> = document.querySelectorAll(
      htmlStrings.game_rules.selector.data_game_rules_change
    );

    gameRulesChangers.forEach(gameRulesChanger => {
      this.document2.removeAllEventListeners(gameRulesChanger, 'click');

      gameRulesChanger.classList.replace(
        htmlStrings.game_rules.clazz.change_enabled,
        htmlStrings.game_rules.clazz.change_disabled
      );
    });
  }
}
