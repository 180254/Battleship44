import {Level, Logger, LoggerFactory} from './logger';
import {Environment} from './environment';
import {i18nKey, Translator} from './ui-i18n';
import {Ws} from './ws-ws';
import {UiTitle} from './ui-title';
import {UiFlags} from './ui-flags';
import {Grids} from './game-grid';
import {UiMessage} from './ui-message';

export class Starter {
  private readonly logger: Logger = LoggerFactory.getLogger(Starter);
  private readonly ws: Ws;
  private readonly translator: Translator;
  private readonly uiTitle: UiTitle;
  private readonly uiFlags: UiFlags;
  private readonly grids: Grids;
  private readonly uiMessage: UiMessage;

  public constructor(
    ws: Ws,
    translator: Translator,
    uiTitle: UiTitle,
    uiFlags: UiFlags,
    grids: Grids,
    uiMessage: UiMessage
  ) {
    this.ws = ws;
    this.translator = translator;
    this.uiTitle = uiTitle;
    this.uiFlags = uiFlags;
    this.grids = grids;
    this.uiMessage = uiMessage;
  }

  public init(): void {
    Logger.LEVEL =
      Environment.MODE === 'development' ? Level.TRACE : Level.WARN;

    this.translator.init(
      () => {
        this.logger.error('translator.init error');
      },
      () => {
        this.uiTitle.setFixedTitle(this.uiTitle.standardTitleI18nKey);
        this.uiFlags.initFlags();
        this.grids.init();

        'WebSocket' in window
          ? this.ws.init()
          : this.uiMessage.setFixed(i18nKey('ws.unable'));
      }
    );
  }
}
