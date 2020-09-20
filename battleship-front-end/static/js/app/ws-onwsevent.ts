import {Logger, LoggerFactory} from './logger';
import {UiMessage} from './ui-message';
import {i18nKey} from './ui-i18n';
import {htmlStrings} from './html-strings';
import {Ws} from './ws-ws';
import {UiTitle} from './ui-title';
import {GridSelection} from './game-grid';
import {OnWsMessage} from './ws-onwsmessage';
import {WsMessage} from './ws-wsmessage';
import {Url} from './url';

export class OnWsEvent {
  private readonly logger: Logger = LoggerFactory.getLogger(OnWsEvent);

  // https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
  private readonly closeReasons: Map<number, string> = new Map<number, string>([
    [1000, 'CLOSE_NORMAL'],
    [1001, 'CLOSE_GOING_AWAY'],
    [1002, 'CLOSE_PROTOCOL_ERROR'],
    [1003, 'CLOSE_UNSUPPORTED'],
    [1005, 'CLOSE_NO_STATUS'],
    [1004, '?'],
    [1006, 'CLOSE_ABNORMAL'],
    [1007, 'Unsupported Data'],
    [1008, 'Policy Violation'],
    [1009, 'CLOSE_TOO_LARGE'],
    [1010, 'Missing Extension'],
    [1011, 'Internal Error'],
    [1012, 'Service Restart'],
    [1013, 'Try Again Later'],
    [1014, '?'],
    [1015, 'TLS Handshake'],
  ]);

  private _ws!: Ws;

  private readonly onWsMessage: OnWsMessage;
  private readonly uiMessage: UiMessage;
  private readonly uiTitle: UiTitle;
  private readonly gridSelection: GridSelection;
  private readonly url: Url;

  public constructor(
    onWsMessage: OnWsMessage,
    uiMessage: UiMessage,
    uiTitle: UiTitle,
    gridSelection: GridSelection,
    url: Url
  ) {
    this.onWsMessage = onWsMessage;
    this.uiMessage = uiMessage;
    this.uiTitle = uiTitle;
    this.gridSelection = gridSelection;
    this.url = url;
  }

  public setWs(ws: Ws): void {
    this._ws = ws;
  }

  public onOpen(ev: Event): void {
    this.logger.debug('url={0}', ev.target!.url);
    const id: string = this.url.getParam('id')?.value || 'NEW';
    this._ws.send('GAME {0}'.format(id));
  }

  public onMessage(ev: MessageEvent): void {
    this.logger.debug('data={0}', ev.data);
    this.onWsMessage.process(WsMessage.Ex(ev));
  }

  public onSend(ev: string): void {
    this.logger.debug('send={0}', ev);
  }

  public onClose(ev: CloseEvent): void {
    const reason: string = ev.reason || this.closeReasons.get(ev.code) || '?';
    this.logger.debug('close={0}({1})', ev.code, reason);

    this.uiMessage.setFixed(
      i18nKey('ws.close', [String(ev.code), reason]),
      htmlStrings.message.clazz.fail
    );
    this.uiTitle.setFixedDefaultTitle();

    this.gridSelection.deactivate();
  }

  public onError(ev: Event): void {
    this.logger.debug('close={0}', ev.type);

    this.uiMessage.setFixed(i18nKey('ws.error', [ev.type]), htmlStrings.message.clazz.fail);
    this.uiTitle.setFixedDefaultTitle();

    this.gridSelection.deactivate();
  }
}
