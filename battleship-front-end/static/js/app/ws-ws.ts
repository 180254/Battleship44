import {Environment} from './environment';

export type WsEventListener =
  | ['open', (ev: Event) => void]
  | ['message', (ev: MessageEvent) => void]
  | ['close', (ev: CloseEvent) => void]
  | ['error', (ev: Event) => void]
  | ['send', (ev: MessageEvent) => void];

export class Ws {
  private ws!: WebSocket;
  private readonly eventListeners: Array<WsEventListener> = new Array<WsEventListener>();

  public init(): void {
    const protocol: string = location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = Environment.BACKEND || protocol + '//' + window.location.host + '/ws';
    this.ws = new WebSocket(wsUrl);

    for (const [event, callback] of this.eventListeners) {
      this.ws.addEventListener(event, callback as never);
    }
  }

  public addEventListener(wsEventListener: WsEventListener): void {
    this.eventListeners.push(wsEventListener);
  }

  public send(msg: string): void {
    this.ws.send(msg);
    this.ws.dispatchEvent(new MessageEvent('send', {data: msg}));
  }
}
