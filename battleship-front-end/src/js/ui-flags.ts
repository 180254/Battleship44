import {Logger, LoggerFactory} from './logger';
import {Document2} from './document2';
import {Translator} from './ui-i18n';
import {htmlStrings} from './html-strings';

export class UiFlags {
  private readonly logger: Logger = LoggerFactory.getLogger(UiFlags);

  private readonly translator: Translator;
  private readonly document2: Document2;

  public constructor(translator: Translator, document2: Document2) {
    this.translator = translator;
    this.document2 = document2;
  }

  public initFlags(): void {
    this.translator
      .getLangSelector()
      .getLangFinder()
      .server()
      .forEach(langTag => {
        const flag: HTMLElement = document.createElement('img');
        flag.setAttribute('role', 'button');
        flag.setAttribute('alt', langTag.lang);
        flag.setAttribute('src', 'flags/{0}.png'.format(langTag.region!.toLowerCase()));
        flag.setAttribute('class', htmlStrings.flags.clazz.default);

        this.document2.addEventListener(flag, 'click', () => {
          this.translator.getLangSetter().setLang(langTag);
          this.translator.init(
            () => this.logger.error('lang.change fail={0}', langTag),
            () => this.logger.trace('lang.change ok={0}', langTag)
          );
        });

        const flags: HTMLElement = document.querySelector<HTMLElement>(
          htmlStrings.flags.selector.container
        )!;
        flags.append(flag);

        this.logger.trace('init={0}', langTag);
      });
  }
}
