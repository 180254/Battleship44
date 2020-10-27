import {UiMessage, UiMessageTimeout} from './ui-message';
import {LangFinder, LangSelector, LangSetter, LangTagComparer} from './ui-langs';
import {Translator} from './ui-i18n';
import {Grids, GridSelection} from './game-grid';
import {Url} from './url';
import {GridSerializer} from './game-grid-serializer';
import {UiFlags} from './ui-flags';
import {UiGameRules} from './ui-gamerules';
import {UiThemes} from './ui-themes';
import {UiTitle} from './ui-title';
import {Document2Event} from './document2-event';
import {Random} from './random';
import {OnWsMessage, SessionContext} from './ws-onwsmessage';
import {OnWsEvent} from './ws-onwsevent';
import {GameStarter} from './app-game-starter';
import {Ws} from './ws-ws';

class Game {
  // private readonly assert: Assert = new Assert();
  private readonly random: Random = new Random();
  private readonly document2Event: Document2Event = new Document2Event(this.random);
  private readonly grids: Grids = new Grids();
  private readonly gridSelection: GridSelection = new GridSelection(this.grids);
  private readonly gridSerializer: GridSerializer = new GridSerializer();
  private readonly langTagComparer: LangTagComparer = new LangTagComparer();
  private readonly langFinder: LangFinder = new LangFinder();
  private readonly langSelector: LangSelector = new LangSelector(
    this.langTagComparer,
    this.langFinder
  );
  private readonly langSetter: LangSetter = new LangSetter();
  private readonly translator: Translator = new Translator(this.langSelector, this.langSetter);
  private readonly uiFlags: UiFlags = new UiFlags(this.translator);
  private readonly uiGameRules = new UiGameRules();
  private readonly uiMessage: UiMessage = new UiMessage(this.random, this.translator);
  private readonly uiMessageTimeout: UiMessageTimeout = new UiMessageTimeout();
  private readonly uiThemes: UiThemes = new UiThemes();
  private readonly uiTitle: UiTitle = new UiTitle(this.translator);
  private readonly url: Url = new Url();
  private readonly sessionContext: SessionContext = new SessionContext();

  private readonly ws: Ws = new Ws();

  private readonly onWsMessage: OnWsMessage = new OnWsMessage(
    this.ws,
    this.document2Event,
    this.gridSelection,
    this.gridSerializer,
    this.grids,
    this.translator,
    this.uiGameRules,
    this.uiMessage,
    this.uiMessageTimeout,
    this.uiTitle,
    this.url,
    this.sessionContext
  );

  private onWsEvent: OnWsEvent = new OnWsEvent(
    this.ws,
    this.gridSelection,
    this.onWsMessage,
    this.uiMessage,
    this.uiTitle,
    this.url
  );

  private gameStarter: GameStarter = new GameStarter(
    this.ws,
    this.grids,
    this.translator,
    this.uiFlags,
    this.uiMessage,
    this.uiTitle,
    this.url
  );

  public init(): void {
    this.uiThemes.init();
    this.onWsMessage.init();
    this.onWsEvent.init();
    this.gameStarter.init();
  }
}

const iGame: Game = new Game();
iGame.init();
