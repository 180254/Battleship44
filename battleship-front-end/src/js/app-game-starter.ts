import {Environment} from './environment';
import {Grids} from './game-grid';
import {LangTag} from './ui-langs';
import {Level, Logger, LoggerFactory} from './logger';
import {UiFlags} from './ui-flags';
import {UiMessage} from './ui-message';
import {UiTitle} from './ui-title';
import {Url} from './url';
import {Ws} from './ws-ws';
import {i18nKey, Translator} from './ui-i18n';

export class GameStarter {
  private readonly logger: Logger = LoggerFactory.getLogger(GameStarter);

  private readonly ws: Ws;
  private readonly grids: Grids;
  private readonly translator: Translator;
  private readonly uiFlags: UiFlags;
  private readonly uiMessage: UiMessage;
  private readonly uiTitle: UiTitle;
  private readonly url: Url;

  public constructor(
    ws: Ws,
    grids: Grids,
    translator: Translator,
    uiFlags: UiFlags,
    uiMessage: UiMessage,
    uiTitle: UiTitle,
    url: Url
  ) {
    this.ws = ws;
    this.grids = grids;
    this.translator = translator;
    this.uiFlags = uiFlags;
    this.uiMessage = uiMessage;
    this.uiTitle = uiTitle;
    this.url = url;
  }

  public init(): void {
    const param = this.url.getParam('d');
    const debug = Environment.MODE === 'development' || param?.value === '1';
    Logger.LEVEL = debug ? Level.TRACE : Level.WARN;

    this.translator.init(
      (err: unknown) => {
        this.logger.error('translator.init error, reason: [{0}]', err);
      },
      (langTag: LangTag) => {
        this.logger.debug('translator.init success, lang={0}', langTag);

        this.uiTitle.setFixedDefaultTitle();
        this.uiFlags.initFlags();

        'WebSocket' in window ? this.ws.init() : this.uiMessage.setFixed(i18nKey('ws.unsupported'));
      }
    );
  }
}
