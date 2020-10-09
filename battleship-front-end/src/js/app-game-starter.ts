import {Level, Logger, LoggerFactory} from './logger';
import {Environment} from './environment';
import {i18nKey, Translator} from './ui-i18n';
import {Ws} from './ws-ws';
import {UiTitle} from './ui-title';
import {UiFlags} from './ui-flags';
import {Grids} from './game-grid';
import {UiMessage} from './ui-message';
import {Url} from './url';
import {LangTag} from './ui-langs';
import * as $ from 'jquery';
import {htmlStrings} from './html-strings';

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
        this.grids.init();

        // should be sent by server.
        $(htmlStrings.info.id_ship_sizes).text('4 | 3, 3 | 2, 2, 2 | 1, 1, 1, 1');

        'WebSocket' in window ? this.ws.init() : this.uiMessage.setFixed(i18nKey('ws.unable'));
      }
    );
  }
}
