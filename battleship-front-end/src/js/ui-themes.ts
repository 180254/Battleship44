import * as $ from 'jquery';
import {htmlStrings} from './html-strings';
import {Logger, LoggerFactory} from './logger';
import * as Cookies from 'js-cookie';

export class UiThemes {
  private readonly logger: Logger = LoggerFactory.getLogger(UiThemes);

  private readonly classes: string[] = ['theme-classic', 'theme-light', 'theme-dark'];
  // http://xahlee.info/comp/unicode_games_cards.html
  private readonly switcherContents: string[] = ['&#x1f032;', '&#x1f039;', '&#x1f03a;'];

  private readonly cookieName = 'theme';

  private themeIndex = 0;

  activate(nextThemeIndex: number): void {
    if (this.themeIndex === nextThemeIndex) {
      return;
    }

    $(htmlStrings.themeSwitcher.id_theme_holder)
      .addClass(this.classes[nextThemeIndex])
      .removeClass(this.classes[this.themeIndex]);

    $(htmlStrings.themeSwitcher.id_switcher).html(this.switcherContents[nextThemeIndex]);

    Cookies.set(this.cookieName, nextThemeIndex.toString(), {sameSite: 'Strict'});

    this.logger.trace('theme={0}', this.classes[nextThemeIndex]);
    this.themeIndex = nextThemeIndex;
  }

  public init(): void {
    $(htmlStrings.themeSwitcher.id_switcher).on('click', () => {
      this.activate((this.themeIndex + 1) % this.classes.length);
    });

    const themeCookieIndex = Number.parseInt(Cookies.get(this.cookieName)!);
    if (
      !Number.isNaN(themeCookieIndex) &&
      themeCookieIndex >= 0 &&
      themeCookieIndex < this.classes.length
    ) {
      this.activate(themeCookieIndex);
    }
  }
}
