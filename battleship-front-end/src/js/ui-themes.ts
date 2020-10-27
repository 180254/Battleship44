import * as $ from 'jquery';
import {htmlStrings} from './html-strings';
import {Logger, LoggerFactory} from './logger';

export class UiThemes {
  private readonly logger: Logger = LoggerFactory.getLogger(UiThemes);

  private readonly classes: string[] = ['theme-classic', 'theme-dark'];
  // http://xahlee.info/comp/unicode_games_cards.html
  private readonly switcherContents: string[] = ['&#x1f032;', '&#x1f039;', '&#x1f03a;'];

  private themeIndex = 0;

  currentThemeIndex(): number {
    return this.themeIndex;
  }

  nextThemeIndex(): number {
    return (this.themeIndex + 1) % this.classes.length;
  }

  public init(): void {
    $(htmlStrings.themeSwitcher.id_switcher).on('click', () => {
      $(htmlStrings.themeSwitcher.id_theme_holder)
        .addClass(this.classes[this.nextThemeIndex()])
        .removeClass(this.classes[this.currentThemeIndex()]);

      $(htmlStrings.themeSwitcher.id_switcher).html(this.switcherContents[this.nextThemeIndex()]);

      this.themeIndex = this.nextThemeIndex();
      this.logger.trace('theme={0}', this.classes[this.themeIndex]);
    });
  }
}
