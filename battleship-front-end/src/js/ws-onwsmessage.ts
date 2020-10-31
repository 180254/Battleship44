import {Cell, Grids, GridSelection} from './game-grid';
import {Consumer} from './functional-interfaces';
import {Document2} from './document2';
import {GridSerializer} from './game-grid-serializer';
import {I18nKey, i18nKey, Translator} from './ui-i18n';
import {Logger} from './logger';
import {UiGameRules} from './ui-gamerules';
import {UiMessage, UiMessageTimeout} from './ui-message';
import {UiTitle} from './ui-title';
import {Url, UrlParam} from './url';
import {WsMessage} from './ws-wsmessage';
import {Ws} from './ws-ws';
import {htmlStrings} from './html-strings';

export class SessionContext {
  public numberOfPlayersInGame = 1;
  public gridAlreadySet = false;
}

export class OnWsMessage {
  private readonly logger: Logger = new Logger(OnWsMessage);

  private funcs!: Map<string, Consumer<string>>;

  private readonly ws: Ws;
  private readonly document2: Document2;
  private readonly gridSelection: GridSelection;
  private readonly gridSerializer: GridSerializer;
  private readonly grids: Grids;
  private readonly translator: Translator;
  private readonly uiGameRules: UiGameRules;
  private readonly uiMessage: UiMessage;
  private readonly uiMessageTimeout: UiMessageTimeout;
  private readonly uiTitle: UiTitle;
  private readonly url: Url;
  private readonly sessionContext: SessionContext;

  public constructor(
    ws: Ws,
    document2: Document2,
    gridSelection: GridSelection,
    gridSerializer: GridSerializer,
    grids: Grids,
    translator: Translator,
    uiGameRules: UiGameRules,
    uiMessage: UiMessage,
    uiMessageTimeout: UiMessageTimeout,
    uiTitle: UiTitle,
    url: Url,
    sessionContext: SessionContext
  ) {
    this.ws = ws;
    this.document2 = document2;
    this.gridSelection = gridSelection;
    this.gridSerializer = gridSerializer;
    this.grids = grids;
    this.translator = translator;
    this.uiGameRules = uiGameRules;
    this.uiMessage = uiMessage;
    this.uiMessageTimeout = uiMessageTimeout;
    this.uiTitle = uiTitle;
    this.url = url;
    this.sessionContext = sessionContext;
  }

  public process(msg: WsMessage): void {
    const callback: Consumer<string> | undefined = this.funcs.get(msg.command);

    if (callback !== undefined) {
      callback(msg.payload);
    } else {
      this.logger.error('unknown={0}', msg);
    }
  }

  public init(): void {
    this.funcs = new Map<string, Consumer<string>>([
      [
        'HI_.',
        payload => {
          this.uiMessage.addFleeting(i18nKey('pre.hi', payload), this.uiMessageTimeout.fast);
        },
      ],

      [
        'GAME',
        payload => {
          if (payload.startsWith('OK')) {
            this.process(WsMessage.Sub('GAME', payload, 'OK'));
          } else if (payload.startsWith('FAIL')) {
            this.process(WsMessage.Sub('GAME', payload, 'FAIL'));
          } else {
            this.logger.error('unknown_func={0},{1}', 'GAME', payload);
          }
        },
      ],

      [
        'GAME OK',
        payload => {
          this.sessionContext.gridAlreadySet = false;
          this.grids.opponent.classList.add(htmlStrings.grid.clazz.inactive);
          this.grids.shoot.classList.remove(htmlStrings.grid.clazz.inactive);

          if (payload) {
            const gameUrl: HTMLElement = document.querySelector<HTMLElement>(
              htmlStrings.info.selector.game_url
            )!;

            this.translator.removeTranslation(gameUrl);

            const urlParams: UrlParam[] = [
              this.url.getParam('d'),
              new UrlParam('id', payload),
            ].filter(urlParam => urlParam !== null) as UrlParam[];
            gameUrl.textContent = this.url.buildUrlWithParams(...urlParams);

            const infoPlayersGame: HTMLElement = document.querySelector<HTMLElement>(
              htmlStrings.info.selector.players_game
            )!;
            infoPlayersGame.textContent = '1';
          }

          this.grids.reset();
          this.gridSelection.activate();

          this.uiMessage.setFixed(i18nKey('put.info'));

          const messageConstElement: HTMLElement = document.querySelector<HTMLElement>(
            htmlStrings.message.selector.const
          )!;

          messageConstElement.append(' ');
          this.uiMessage.addFixedLink(
            i18nKey('put.random'),
            htmlStrings.message.ok.id.random_ship_selection
          );
          const randomShipSelection: HTMLElement = document.querySelector<HTMLElement>(
            htmlStrings.message.ok.selector.random_ship_selection
          )!;
          randomShipSelection.addEventListener('click', () => {
            this.ws.send('GRID RANDOM');
          });

          messageConstElement.append(' ');
          this.uiMessage.addFixedLink(
            i18nKey('put.done'),
            htmlStrings.message.ok.id.ship_selection
          );
          const shipSelection: HTMLElement = document.querySelector<HTMLElement>(
            htmlStrings.message.ok.selector.ship_selection
          )!;
          shipSelection.addEventListener('click', () => {
            this.ws.send('GRID {0}'.format(this.gridSelection.collect()));
          });

          if (
            this.sessionContext.numberOfPlayersInGame === 1 &&
            !this.sessionContext.gridAlreadySet
          ) {
            this.uiGameRules.activateChanging();
          }
        },
      ],

      [
        'GAME FAIL',
        payload => {
          this.uiMessage.setFixed(i18nKey('fail.fail', payload));
        },
      ],

      [
        'GAME-RULES',
        payload => {
          const gameRules = payload.split(',');
          for (const gameRule of gameRules) {
            const gameRuleSplit = gameRule.split('=', 2);
            const gameRuleKey = gameRuleSplit[0];
            const gameRuleValue = gameRuleSplit[1];

            this.translator.translateElement(
              document.querySelector<HTMLElement>('#game-rules-{0}-value'.format(gameRuleKey))!,
              new I18nKey('game-rules.{0}.{1}'.format(gameRuleKey, gameRuleValue))
            );
          }
        },
      ],

      [
        'GRID',
        payload => {
          if (payload.startsWith('OK')) {
            this.process(WsMessage.Sub('GRID', payload, 'OK'));
          } else if (payload.startsWith('FAIL')) {
            this.process(WsMessage.Sub('GRID', payload, 'FAIL'));
          } else if (payload.startsWith('RANDOM')) {
            this.process(WsMessage.Sub('GRID', payload, 'RANDOM'));
          } else {
            this.logger.error('unknown_func={0},{1}', 'GRID', payload);
          }
        },
      ],

      [
        'GRID OK',
        () => {
          this.sessionContext.gridAlreadySet = true;
          this.grids.opponent.classList.remove(htmlStrings.grid.clazz.inactive);
          this.grids.shoot.classList.add(htmlStrings.grid.clazz.inactive);

          this.uiMessage.setFixed(i18nKey('tour.awaiting'));
          this.uiGameRules.deactivateChanging();

          this.gridSelection.deactivate();
          this.gridSelection.moveToLeft();
        },
      ],

      [
        'GRID FAIL',
        () => {
          this.uiMessage.addFleeting(
            i18nKey('put.fail'),
            this.uiMessageTimeout.default,
            htmlStrings.message.clazz.fail
          );
        },
      ],

      [
        'GRID RANDOM',
        payload => {
          const fleet: number[] = payload.split(',').map(value => Number(value));
          this.grids.putFleet(fleet);
        },
      ],

      [
        'TOUR',
        payload => {
          if (payload.startsWith('START')) {
            this.process(WsMessage.Sub('TOUR', payload, 'START'));
          } else if (payload.startsWith('YOU')) {
            this.process(WsMessage.Sub('TOUR', payload, 'YOU'));
          } else if (payload.startsWith('HE')) {
            this.process(WsMessage.Sub('TOUR', payload, 'HE'));
          } else {
            this.logger.error('unknown_func={0},{1}', 'TOUR', payload);
          }
        },
      ],

      [
        'TOUR START',
        () => {
          // none here
        },
      ],

      [
        'TOUR YOU',
        () => {
          this.grids.shoot.classList.remove(htmlStrings.grid.clazz.inactive);

          this.uiMessage.setFixed(i18nKey('tour.shoot_me'), htmlStrings.message.clazz.important);
          this.uiTitle.setBlinkingTitle(i18nKey('title.shoot_me'), false);

          this.grids.shootCells.forEach(element => {
            element.classList.add(htmlStrings.cell.clazz.shootable);
          });

          const clickNamespaced: string = 'click.{0}'.format(this.document2.getRandomNamespace());
          this.grids.shootCells.forEach(element => {
            this.document2.addEventListener(element, clickNamespaced, () => {
              this.document2.removeEventListeners(undefined, clickNamespaced);
              const pos: string = this.gridSerializer.cellSerializer(Cell.FromElement(element));
              this.ws.send('SHOT {0}'.format(pos));
            });
          });
        },
      ],

      [
        'TOUR HE',
        () => {
          this.grids.shoot.classList.add(htmlStrings.grid.clazz.inactive);
          this.grids.shootCells.forEach(element => {
            element.classList.remove(htmlStrings.cell.clazz.shootable);
          });

          this.uiMessage.setFixed(i18nKey('tour.shoot_opp'));
          this.uiTitle.setFixedTitle(i18nKey('title.shoot_opp'));
        },
      ],

      [
        'YOU_',
        payload => {
          const cells: Cell[] = this.gridSerializer.cellsDeserializer(payload);

          const clazzMap: Map<string, string> = new Map([
            ['ship', htmlStrings.cell.clazz.ship],
            ['ship_sunk', htmlStrings.cell.clazz.ship_sunk],
            ['empty', htmlStrings.cell.clazz.empty],
          ]);

          cells.forEach(cell => {
            this.grids.setCellClass(this.grids.shootCells, cell, clazzMap.get(cell.clazz!), false);
          });
        },
      ],

      [
        'HE__',
        payload => {
          const cells: Cell[] = this.gridSerializer.cellsDeserializer(payload);

          cells.forEach(cell => {
            this.grids.setCellClass(
              this.grids.opponentCells,
              cell,
              htmlStrings.cell.clazz.opp_shoot,
              true
            );
          });
        },
      ],

      [
        'WON_',
        payload => {
          this.grids.opponent.classList.add(htmlStrings.grid.clazz.inactive);
          this.grids.shoot.classList.add(htmlStrings.grid.clazz.inactive);

          const winning: HTMLElement =
            payload === 'YOU'
              ? document.querySelector<HTMLElement>(htmlStrings.info.selector.winning_me)!
              : document.querySelector<HTMLElement>(htmlStrings.info.selector.winning_opp)!;
          winning.textContent = (Number.parseInt(winning.textContent || '0') + 1).toString();

          payload === 'YOU'
            ? this.uiMessage.setFixed(i18nKey('end.won_me'))
            : this.uiMessage.setFixed(i18nKey('end.won_opp'));

          this.uiMessage.addFixedLink(
            i18nKey('end.next_game'),
            htmlStrings.message.ok.id.game_next
          );
          const nextGame: HTMLElement = document.querySelector<HTMLElement>(
            htmlStrings.message.ok.selector.game_next
          )!;
          nextGame.addEventListener('click', () => {
            this.process(new WsMessage('', 'GAME OK', ''));
          });

          this.uiTitle.setFixedDefaultTitle();
        },
      ],

      [
        '1PLA',
        payload => {
          this.sessionContext.numberOfPlayersInGame = 1;

          const infoPlayersGame: HTMLElement = document.querySelector<HTMLElement>(
            htmlStrings.info.selector.players_game
          )!;
          infoPlayersGame.textContent = '1';

          const interrupted: boolean = payload === 'game-interrupted';

          interrupted
            ? this.uiMessage.setFixed(i18nKey('end.opp_gone'))
            : this.uiMessage.addFleeting(i18nKey('end.opp_gone'), this.uiMessageTimeout.slow);

          if (interrupted) {
            this.grids.shootCells.forEach(element => {
              element.classList.remove(htmlStrings.cell.clazz.shootable);
              this.document2.removeEventListeners(element, 'click');
            });

            this.uiMessage.addFixedLink(
              i18nKey('end.next_game'),
              htmlStrings.message.ok.id.game_next
            );
            const nextGame: HTMLElement = document.querySelector<HTMLElement>(
              htmlStrings.message.ok.selector.game_next
            )!;
            nextGame.addEventListener('click', () =>
              this.process(new WsMessage('', 'GAME OK', ''))
            );

            this.grids.opponent.classList.add(htmlStrings.grid.clazz.inactive);
            this.grids.shoot.classList.add(htmlStrings.grid.clazz.inactive);

            this.uiTitle.setFixedDefaultTitle();
          }

          if (!this.sessionContext.gridAlreadySet) {
            this.uiGameRules.activateChanging();
          }
        },
      ],

      [
        '2PLA',
        () => {
          this.sessionContext.numberOfPlayersInGame = 2;

          const infoPlayersGame: HTMLElement = document.querySelector<HTMLElement>(
            htmlStrings.info.selector.players_game
          )!;
          infoPlayersGame.textContent = '2';

          this.uiMessage.addFleeting(i18nKey('tour.two_players'), this.uiMessageTimeout.slow);

          const gameRulesChangers: NodeListOf<HTMLElement> = document.querySelectorAll(
            htmlStrings.game_rules.selector.data_game_rules_change
          );
          gameRulesChangers.forEach(element => {
            this.document2.removeEventListeners(element, 'click');
            element.classList.replace(
              htmlStrings.game_rules.clazz.change_enabled,
              htmlStrings.game_rules.clazz.change_disabled
            );
          });
        },
      ],

      [
        'PONG',
        () => {
          // none here
        },
      ],

      [
        'STAT',
        payload => {
          const infoStat: {[key: string]: string} = {
            players: htmlStrings.info.selector.players_global,
          };

          const stats: string[] = payload.split(',');

          stats.forEach(stat => {
            const [key, value]: string[] = stat.split('=');
            const infoStatElement: HTMLElement = document.querySelector<HTMLElement>(
              infoStat[key]
            )!;

            infoStatElement.textContent = value;
            this.translator.removeTranslation(infoStatElement);
          });
        },
      ],

      [
        '400',
        payload => {
          this.uiMessage.setFixed(i18nKey('fail.fail', '400 ' + payload));
          this.logger.error('400={0}', payload);
        },
      ],
    ]);

    this.uiGameRules.addGameRulesChangeClickListener(gameRuleName => {
      this.ws.send('GAME-RULES {0}=next'.format(gameRuleName));
    });
  }
}
