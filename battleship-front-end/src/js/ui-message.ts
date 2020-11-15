import {Css} from './css';
import {I18nKey, Translator} from './ui-i18n';
import {Logger, LoggerFactory} from './logger';
import {Random} from './random';
import {htmlStrings} from './html-strings';

export class UiMessageTimeout {
  public readonly fast: number = 2000;
  public readonly default: number = 3000;
  public readonly slow: number = 5000;
}

export class UiMessage {
  private readonly logger: Logger = LoggerFactory.getLogger(UiMessage);

  private readonly css: Css;
  private readonly random: Random;
  private readonly translator: Translator;

  public constructor(css: Css, random: Random, translator: Translator) {
    this.css = css;
    this.random = random;
    this.translator = translator;
  }

  public setFixed(i18nKey: I18nKey, clazz?: string): void {
    this.set(i18nKey, undefined, clazz);
    this.logger.trace('{0},{1}', i18nKey, clazz);
  }

  public addFleeting(i18nKey: I18nKey, timeout: number, clazz?: string): void {
    this.set(i18nKey, timeout, clazz);
    this.logger.trace('{0},{1},{2}', i18nKey, timeout, clazz);
  }

  public addFixedLink(i18nKey: I18nKey, id: string, clazz?: string): void {
    const link: HTMLAnchorElement = document.createElement('a');
    link.setAttribute('role', 'button');
    link.setAttribute('id', id);
    link.classList.add('like-href');
    if (clazz !== undefined) {
      link.classList.add(clazz);
    }

    this.translator.translateElement(link, i18nKey);

    const messagesConst: HTMLElement = document.getElementById(htmlStrings.message.id.const)!;
    messagesConst.append(link);

    this.logger.trace('{0},{1},{2}', i18nKey, id, clazz);
  }

  private set(i18nKey: I18nKey, timeout?: number, clazz?: string): void {
    const outerId: string =
      timeout !== undefined ? '{0}'.format(this.random.str(7, 'a')) : htmlStrings.message.id.const;

    const outer: HTMLSpanElement = document.createElement('span');
    outer.setAttribute('id', outerId);
    outer.classList.add('msg');
    if (clazz !== undefined) {
      outer.classList.add(clazz);
    }

    const inner: HTMLSpanElement = document.createElement('span');
    this.translator.translateElement(inner, i18nKey);
    outer.append(inner);

    const msgContainer: HTMLElement = document.getElementById(htmlStrings.message.id.container)!;
    const msgConst: HTMLElement = document.getElementById(htmlStrings.message.id.const)!;

    if (timeout) {
      msgContainer.append(outer);
      this.css.fadeOut(outer, timeout);
    } else {
      msgConst.remove();
      msgContainer.append(outer);
    }
  }
}
