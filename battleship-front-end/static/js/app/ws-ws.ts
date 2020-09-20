import {Environment} from './environment';
import {OnWsEvent} from './ws-onwsevent';

export class Ws {
  private ws!: WebSocket;
  private readonly onWsEvent: OnWsEvent;

  public constructor(onWsEvent: OnWsEvent) {
    this.onWsEvent = onWsEvent;
  }

  public init(): void {
    const protocol: string = location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = Environment.BACKEND || protocol + '//' + window.location.host + '/ws';
    this.ws = new WebSocket(wsUrl);
    this.ws.onopen = (ev: Event) => this.onWsEvent.onOpen(ev);
    this.ws.onmessage = (ev: MessageEvent) => this.onWsEvent.onMessage(ev);
    this.ws.onclose = (ev: CloseEvent) => this.onWsEvent.onClose(ev);
    this.ws.onerror = (ev: Event) => this.onWsEvent.onError(ev);
  }

  public send(msg: string): void {
    this.ws.send(msg);
    this.onWsEvent.onSend(msg);
  }
}
