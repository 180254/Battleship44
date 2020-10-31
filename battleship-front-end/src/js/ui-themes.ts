import * as Cookies from 'js-cookie';
import {Logger, LoggerFactory} from './logger';
import {htmlStrings} from './html-strings';

class Theme {
  public readonly clazz: string;
  public readonly switcherContent: string;

  constructor(clazz: string, switcherContent: string) {
    this.clazz = clazz;
    this.switcherContent = switcherContent;
  }
}

export class UiThemes {
  private readonly logger: Logger = LoggerFactory.getLogger(UiThemes);
  private readonly cookieName = 'theme';

  private readonly themes: Theme[] = [
    // switcher contents: http://xahlee.info/comp/unicode_games_cards.html
    new Theme('theme-classic', '&#x1f032;'),
    new Theme('theme-light', '&#x1f039;'),
    new Theme('theme-dark', '&#x1f03a;'),
  ];

  private themeIndex = 0;

  activate(nextThemeIndex: number): void {
    if (this.themeIndex === nextThemeIndex) {
      return;
    }

    const themeHolder: HTMLElement = document.querySelector<HTMLElement>(
      htmlStrings.theme.selector.holder
    )!;
    themeHolder.classList.replace(
      this.themes[this.themeIndex].clazz,
      this.themes[nextThemeIndex].clazz
    );

    const themeSwitcher: HTMLElement = document.querySelector<HTMLElement>(
      htmlStrings.theme.selector.switcher
    )!;
    themeSwitcher.innerHTML = this.themes[nextThemeIndex].switcherContent;

    Cookies.set(this.cookieName, nextThemeIndex.toString(), {sameSite: 'Strict'});

    this.logger.trace('theme={0}', this.themes[nextThemeIndex].clazz);
    this.themeIndex = nextThemeIndex;
  }

  public init(): void {
    const themeSwitcher: HTMLElement = document.querySelector<HTMLElement>(
      htmlStrings.theme.selector.switcher
    )!;
    themeSwitcher.addEventListener('click', () => {
      this.activate((this.themeIndex + 1) % this.themes.length);
    });

    const themeCookieIndex = Number.parseInt(Cookies.get(this.cookieName)!);
    if (
      !Number.isNaN(themeCookieIndex) &&
      themeCookieIndex >= 0 &&
      themeCookieIndex < this.themes.length
    ) {
      this.activate(themeCookieIndex);
    }
  }
}
