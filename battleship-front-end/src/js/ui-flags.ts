import {Logger, LoggerFactory} from './logger';
import {Translator} from './ui-i18n';
import {htmlStrings} from './html-strings';

export class UiFlags {
  private readonly logger: Logger = LoggerFactory.getLogger(UiFlags);

  private readonly translator: Translator;

  public constructor(translator: Translator) {
    this.translator = translator;
  }

  public initFlags(): void {
    this.translator
      .getLangSelector()
      .getLangFinder()
      .server()
      .forEach(langTag => {
        const flag: HTMLImageElement = document.createElement('img');
        flag.setAttribute('role', 'button');
        flag.setAttribute('alt', langTag.lang);
        flag.setAttribute('src', 'flags/{0}.png'.format(langTag.region!.toLowerCase()));
        flag.setAttribute('class', htmlStrings.flags.clazz.default);

        flag.addEventListener('click', () => {
          this.translator.getLangSetter().setLang(langTag);
          this.translator.init(
            () => this.logger.error('lang.change fail={0}', langTag),
            () => this.logger.trace('lang.change ok={0}', langTag)
          );
          const documentRoot: HTMLHtmlElement = document.getElementsByTagName('html')[0];
          documentRoot.setAttribute('lang', langTag.lang);
        });

        const flags: HTMLElement = document.getElementById(htmlStrings.flags.id.container)!;
        flags.append(flag);

        this.logger.trace('init={0}', langTag);
      });
  }
}
