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
        const $flag: JQuery = $(document.createElement('img'));
        $flag.attr('role', 'button');
        $flag.attr('alt', langTag.lang);
        $flag.attr('src', 'flags/{0}.png'.format(langTag.region!.toLowerCase()));
        $flag.attr('class', htmlStrings.flags.clazz.default);

        $flag.on('click', () => {
          this.translator.getLangSetter().setLang(langTag);
          this.translator.init(
            () => this.logger.error('lang.change fail={0}', langTag),
            () => this.logger.trace('lang.change ok={0}', langTag)
          );
        });

        $(htmlStrings.flags.id).append($flag);
        this.logger.trace('init={0}', langTag);
      });
  }
}
