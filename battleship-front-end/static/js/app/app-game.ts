import {Timeout, UiMessage} from './ui-message';
import {
  LangFinder,
  LangSelector,
  LangSetter,
  LangTagComparer,
} from './ui-langs';
import {Translator} from './ui-i18n';
import {Grids, GridSelection} from './game-grid';
import {Url} from './url';
import {
  CellDeserializer,
  CellsDeserializer,
  CellSerializer,
} from './game-grid-serializer';
import {UiTitle} from './ui-title';
import {UiFlags} from './ui-flags';
import {DocumentEvent} from './document-event';
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
  public documentEvent: DocumentEvent = new DocumentEvent(this.random);
  public url: Url = new Url();
  public grids: Grids = new Grids();
  public selection: GridSelection = new GridSelection(this.grids);
  public langTagComparer: LangTagComparer = new LangTagComparer();
  public langFinder: LangFinder = new LangFinder();
  public langSelector: LangSelector = new LangSelector(
    this.langFinder,
    this.langTagComparer
  );
  public langSetter: LangSetter = new LangSetter(this.langSelector);
  public translator: Translator = new Translator(
    this.langSelector,
    this.langSetter
  );
  public timeout: Timeout = new Timeout();
  public uiMessage: UiMessage = new UiMessage(this.random, this.translator);
  public uiTitle: UiTitle = new UiTitle(this.translator);
  public uiFlags: UiFlags = new UiFlags(this.documentEvent, this.translator);
  public cellSerializer: CellSerializer = new CellSerializer();
  public cellDeserializer: CellDeserializer = new CellDeserializer();
  public cellsDeserializer: CellsDeserializer = new CellsDeserializer(
    this.cellDeserializer
  );
  public gridSelection: GridSelection = new GridSelection(this.grids);
  public documentEvents: DocumentEvent = new DocumentEvent(this.random);
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
    context.cellSerializer,
    context.cellDeserializer,
    context.cellsDeserializer
  );
  private _onEvent: OnWsEvent = new OnWsEvent(
    this._onMessage,
    context.uiMessage,
    context.uiTitle,
    context.gridSelection
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
