import {UiMessage, UiMessageTimeout} from './ui-message';
import {LangFinder, LangSelector, LangSetter, LangTagComparer} from './ui-langs';
import {Translator} from './ui-i18n';
import {Grids, GridSelection} from './game-grid';
import {Url} from './url';
import {GridSerializer} from './game-grid-serializer';
import {UiTitle} from './ui-title';
import {UiFlags} from './ui-flags';
import {Document2Event} from './document2-event';
import {Assert} from './assert';
import {Random} from './random';
import {OnWsMessage} from './ws-onwsmessage';
import {OnWsEvent} from './ws-onwsevent';
import {Starter} from './ws-starter';
import {Ws} from './ws-ws';

declare global {
  // extend EventTarget; url is given in event on WebSocket open
  interface EventTarget {
    readonly url?: string;
  }
}

class Context {
  public assert: Assert = new Assert();
  public random: Random = new Random();
  public documentEvent: Document2Event = new Document2Event(this.random);
  public url: Url = new Url();
  public grids: Grids = new Grids();
  public selection: GridSelection = new GridSelection(this.grids);
  public langTagComparer: LangTagComparer = new LangTagComparer();
  public langFinder: LangFinder = new LangFinder();
  public langSelector: LangSelector = new LangSelector(this.langFinder, this.langTagComparer);
  public langSetter: LangSetter = new LangSetter();
  public translator: Translator = new Translator(this.langSelector, this.langSetter);
  public timeout: UiMessageTimeout = new UiMessageTimeout();
  public uiMessage: UiMessage = new UiMessage(this.random, this.translator);
  public uiTitle: UiTitle = new UiTitle(this.translator);
  public uiFlags: UiFlags = new UiFlags(this.translator);
  public gridSerializer: GridSerializer = new GridSerializer();
  public gridSelection: GridSelection = new GridSelection(this.grids);
  public documentEvents: Document2Event = new Document2Event(this.random);
}

const context: Context = new Context();

class SingletonGame {
  private _onMessage: OnWsMessage = new OnWsMessage(
    context.uiMessage,
    context.grids,
    context.translator,
    context.gridSelection,
    context.documentEvents,
    context.uiTitle,
    context.gridSerializer,
    context.timeout,
    context.url
  );
  private _onEvent: OnWsEvent = new OnWsEvent(
    this._onMessage,
    context.uiMessage,
    context.uiTitle,
    context.gridSelection,
    context.url
  );
  private _ws: Ws = new Ws(this._onEvent);
  public starter: Starter = new Starter(
    this._ws,
    context.translator,
    context.uiTitle,
    context.uiFlags,
    context.grids,
    context.uiMessage
  );

  public constructor() {
    this._onMessage.setWs(this._ws);
    this._onEvent.setWs(this._ws);
  }
}

export const iGame: SingletonGame = new SingletonGame();
