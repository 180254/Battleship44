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
  // https://www.iana.org/assignments/websocket/websocket.xml#close-code-number
  // https://searchfox.org/mozilla-central/source/__GENERATED__/dist/include/nsIWebSocketChannel.h#96
  // https://chromium.googlesource.com/chromium/src/net/+/refs/heads/master/websockets/websocket_channel.cc#144
  private readonly closeReasons: Map<number, string> = new Map<number, string>([
    [1000, 'NormalClosure'],
    [1001, 'GoingAway'],
    [1002, 'ProtocolError'],
    [1003, 'UnsupportedData'],
    [1004, 'SomethingWentWrong'],
    [1005, 'NoStatusRcvd'],
    [1006, 'AbnormalClosure'],
    [1007, 'InvalidFramePayloadData'],
    [1008, 'PolicyViolation'],
    [1009, 'MessageTooBig'],
    [1010, 'ExtensionMissing'],
    [1011, 'InternalError'],
    [1012, 'ServiceRestart'],
    [1013, 'TryAgainLater'],
    [1014, 'BadGateway'],
    [1015, 'TlsFailed'],
  ]);

  private readonly ws: Ws;

  private readonly gridSelection: GridSelection;
  private readonly onWsMessage: OnWsMessage;
  private readonly uiMessage: UiMessage;
  private readonly uiTitle: UiTitle;
  private readonly url: Url;

  public constructor(
    ws: Ws,
    gridSelection: GridSelection,
    onWsMessage: OnWsMessage,
    uiMessage: UiMessage,
    uiTitle: UiTitle,
    url: Url
  ) {
    this.ws = ws;
    this.gridSelection = gridSelection;
    this.uiMessage = uiMessage;
    this.uiTitle = uiTitle;
    this.url = url;
    this.onWsMessage = onWsMessage;
  }

  public init(): void {
    this.ws.addEventListener(['open', (ev: Event) => this.onOpen(ev)]);
    this.ws.addEventListener(['message', (ev: MessageEvent) => this.onMessage(ev)]);
    this.ws.addEventListener(['close', (ev: CloseEvent) => this.onClose(ev)]);
    this.ws.addEventListener(['error', (ev: Event) => this.onError(ev)]);
    this.ws.addEventListener(['send', (ev: MessageEvent) => this.onSend(ev)]);
  }

  public onOpen(ev: Event): void {
    this.logger.debug('url={0}', ev.target!.url);
    const id: string = this.url.getParam('id')?.value || 'NEW';
    this.ws.send('GAME {0}'.format(id));
  }

  public onMessage(ev: MessageEvent): void {
    this.logger.debug('data={0}', ev.data);
    this.onWsMessage.process(WsMessage.Ex(ev));
  }

  public onClose(ev: CloseEvent): void {
    const reason: string = ev.reason || this.closeReasons.get(ev.code) || '';
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

  public onSend(ev: MessageEvent): void {
    this.logger.debug('send={0}', ev.data);
  }
}
