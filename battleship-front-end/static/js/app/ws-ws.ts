import {Environment} from './environment';

declare global {
  export interface WebSocket {
    // custom onsend handler
    onsend: ((this: WebSocket, ev: string) => void) | null;
  }
}

export class Ws {
  private ws!: WebSocket;

  public init(): void {
    const protocol: string = location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = Environment.BACKEND || protocol + '//' + window.location.host + '/ws';
    this.ws = new WebSocket(wsUrl);
  }

  public getWs(): WebSocket {
    return this.ws;
  }

  public send(msg: string): void {
    this.ws.send(msg);
    this.ws.onsend?.call(this.ws, msg);
  }
}
