import {Logger, LoggerFactory} from './logger';
import {DocumentEvent} from './document-event';
import {Translator} from './ui-i18n';
import {strings} from './html-strings';

export class UiFlags {
  private readonly logger: Logger = LoggerFactory.getLogger(UiFlags);
  private readonly $flags: JQuery = $(strings.flag.id);
  private readonly documentEvent: DocumentEvent;
  private readonly translator: Translator;

  public constructor(documentEvent: DocumentEvent, translator: Translator) {
    this.documentEvent = documentEvent;
    this.translator = translator;
  }

  public initFlags(): void {
    this.translator
      .getLangSelector()
      .getLangFinder()
      .server()
      .forEach(langTag => {
        const $flag: JQuery = $(document.createElement('img'));
        $flag.attr('alt', langTag.lang);
        $flag.attr('src', 'flag/{0}.png'.format(langTag.region!.toLowerCase()));
        $flag.attr('class', strings.flag.clazz.default);

        this.documentEvent.on($flag, 'click', () => {
          this.translator.getLangSetter().setLang(langTag);
          this.translator.init(
            () => this.logger.error('lang.change fail={0}', langTag),
            () => this.logger.debug('lang.change ok={0}', langTag)
          );
        });

        this.$flags.append($flag);
        this.logger.trace('init={0}', langTag);
      });
  }
}
