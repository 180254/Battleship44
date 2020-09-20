import {Level, Logger, LoggerFactory} from './logger';
import {Environment} from './environment';
import {i18nKey, Translator} from './ui-i18n';
import {Ws} from './ws-ws';
import {UiTitle} from './ui-title';
import {UiFlags} from './ui-flags';
import {Grids} from './game-grid';
import {UiMessage} from './ui-message';
import {Url} from './url';

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
      () => {
        this.logger.error('translator.init error');
      },
      () => {
        this.uiTitle.setFixedDefaultTitle();
        this.uiFlags.initFlags();
        this.grids.init();

        'WebSocket' in window ? this.ws.init() : this.uiMessage.setFixed(i18nKey('ws.unable'));
      }
    );
  }
}
