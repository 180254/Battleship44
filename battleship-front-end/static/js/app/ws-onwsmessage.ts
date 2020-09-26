import {Logger} from './logger';
import {Consumer} from './functional-interfaces';
import {i18nKey, Translator} from './ui-i18n';
import {htmlStrings} from './html-strings';
import * as $ from 'jquery';
import {Url, UrlParam} from './url';
import {Cell, Grids, GridSelection} from './game-grid';
import {UiMessage, UiMessageTimeout} from './ui-message';
import {Ws} from './ws-ws';
import {WsMessage} from './ws-wsmessage';
import {Document2Event} from './document2-event';
import {UiTitle} from './ui-title';
import {GridSerializer} from './game-grid-serializer';

export class OnWsMessage {
  private readonly logger: Logger = new Logger(OnWsMessage);

  private funcs!: Map<string, Consumer<string>>;

  private readonly ws: Ws;
  private readonly document2Event: Document2Event;
  private readonly gridSelection: GridSelection;
  private readonly gridSerializer: GridSerializer;
  private readonly grids: Grids;
  private readonly translator: Translator;
  private readonly uiMessage: UiMessage;
  private readonly uiMessageTimeout: UiMessageTimeout;
  private readonly uiTitle: UiTitle;
  private readonly url: Url;

  public constructor(
    ws: Ws,
    document2Event: Document2Event,
    gridSelection: GridSelection,
    gridSerializer: GridSerializer,
    grids: Grids,
    translator: Translator,
    uiMessage: UiMessage,
    uiMessageTimeout: UiMessageTimeout,
    uiTitle: UiTitle,
    url: Url
  ) {
    this.ws = ws;
    this.document2Event = document2Event;
    this.gridSelection = gridSelection;
    this.gridSerializer = gridSerializer;
    this.grids = grids;
    this.translator = translator;
    this.uiMessage = uiMessage;
    this.uiMessageTimeout = uiMessageTimeout;
    this.uiTitle = uiTitle;
    this.url = url;
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
          this.grids.$opponent.addClass(htmlStrings.grid.clazz.inactive);
          this.grids.$shoot.removeClass(htmlStrings.grid.clazz.inactive);

          if (payload) {
            const $gameUrl: JQuery = $(htmlStrings.info.id_game_url);

            this.translator.removeTranslation($gameUrl);

            const urlParams: UrlParam[] = [
              this.url.getParam('d'),
              new UrlParam('id', payload),
            ].filter(urlParam => urlParam !== null) as UrlParam[];
            $gameUrl.text(this.url.buildUrlWithParams(...urlParams));

            $(htmlStrings.info.id_players_game).text(1);
          }

          this.grids.reset();

          this.uiMessage.setFixed(i18nKey('put.info'));
          this.uiMessage.addFixedLink(
            i18nKey('put.done'),
            htmlStrings.message.ok.id_ship_selection
          );

          this.gridSelection.activate();
          $(htmlStrings.message.ok.id_ship_selection).on('click', () =>
            this.ws.send('GRID {0}'.format(this.gridSelection.collect()))
          );
        },
      ],

      [
        'GAME FAIL',
        payload => {
          this.uiMessage.setFixed(i18nKey('fail.fail', payload));
        },
      ],

      [
        'GRID',
        payload => {
          if (payload.startsWith('OK')) {
            this.process(WsMessage.Sub('GRID', payload, 'OK'));
          } else if (payload.startsWith('FAIL')) {
            this.process(WsMessage.Sub('GRID', payload, 'FAIL'));
          } else {
            this.logger.error('unknown_func={0},{1}', 'GRID', payload);
          }
        },
      ],

      [
        'GRID OK',
        () => {
          this.grids.$opponent.removeClass(htmlStrings.grid.clazz.inactive);
          this.grids.$shoot.addClass(htmlStrings.grid.clazz.inactive);

          this.uiMessage.setFixed(i18nKey('tour.awaiting'));

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
          this.grids.$shoot.removeClass(htmlStrings.grid.clazz.inactive);

          this.uiMessage.setFixed(i18nKey('tour.shoot_me'), htmlStrings.message.clazz.important);
          this.uiTitle.setBlinkingTitle(i18nKey('title.shoot_me'), false);

          const $cells: JQuery = this.grids.$shootCells;

          $cells.addClass(htmlStrings.cell.clazz.shootable);
          this.document2Event.onetime($cells, 'click', $td => {
            const pos: string = this.gridSerializer.cellSerializer(Cell.FromElement($td));

            this.ws.send('SHOT {0}'.format(pos));
          });
        },
      ],

      [
        'TOUR HE',
        () => {
          this.grids.$shoot.addClass(htmlStrings.grid.clazz.inactive);
          this.grids.$shootCells.removeClass(htmlStrings.cell.clazz.shootable);

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
            this.grids.setCellClass(
              this.grids.$shoot,
              cell,
              clazzMap.get(cell.clazz!) || '',
              false
            );
          });
        },
      ],

      [
        'HE__',
        payload => {
          const cells: Cell[] = this.gridSerializer.cellsDeserializer(payload);

          cells.forEach(cell => {
            this.grids.setCellClass(
              this.grids.$opponent,
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
          this.grids.$opponent.addClass(htmlStrings.grid.clazz.inactive);
          this.grids.$shoot.addClass(htmlStrings.grid.clazz.inactive);

          const winning: JQuery =
            payload === 'YOU'
              ? $(htmlStrings.info.id_winning_me)
              : $(htmlStrings.info.id_winning_opp);
          winning.text(Number.parseInt(winning.text()) + 1);

          payload === 'YOU'
            ? this.uiMessage.setFixed(i18nKey('end.won_me'))
            : this.uiMessage.setFixed(i18nKey('end.won_opp'));

          this.uiMessage.addFixedLink(
            i18nKey('end.next_game'),
            htmlStrings.message.ok.id_game_next
          );
          this.document2Event.onetime($(htmlStrings.message.ok.id_game_next), 'click', () =>
            this.process(new WsMessage('', 'GAME OK', ''))
          );

          this.uiTitle.setFixedDefaultTitle();
        },
      ],

      [
        '1PLA',
        payload => {
          $(htmlStrings.info.id_players_game).text(1);

          const interrupted: boolean = payload === 'game-interrupted';

          interrupted
            ? this.uiMessage.setFixed(i18nKey('end.opp_gone'))
            : this.uiMessage.addFleeting(i18nKey('end.opp_gone'), this.uiMessageTimeout.slow);

          if (interrupted) {
            this.grids.$shootCells.removeClass(htmlStrings.cell.clazz.shootable);
            this.grids.$shootCells.off('click'); // remove shoot action

            this.uiMessage.addFixedLink(
              i18nKey('end.next_game'),
              htmlStrings.message.ok.id_game_next
            );

            this.grids.$opponent.addClass(htmlStrings.grid.clazz.inactive);
            this.grids.$shoot.addClass(htmlStrings.grid.clazz.inactive);

            this.uiTitle.setFixedDefaultTitle();
          }

          this.document2Event.onetime($(htmlStrings.message.ok.id_game_next), 'click', () =>
            this.process(new WsMessage('', 'GAME OK', ''))
          );
        },
      ],

      [
        '2PLA',
        () => {
          $(htmlStrings.info.id_players_game).text(2);

          this.uiMessage.addFleeting(i18nKey('tour.two_players'), this.uiMessageTimeout.slow);
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
            players: htmlStrings.info.id_players_global,
          };

          const stats: string[] = payload.split(',');

          stats.forEach(stat => {
            const [key, value]: string[] = stat.split('=');
            const $infoStatKey: JQuery = $(infoStat[key]);

            $infoStatKey.text(value);
            this.translator.removeTranslation($infoStatKey);
          });
        },
      ],

      [
        '400_',
        payload => {
          this.uiMessage.setFixed(i18nKey('fail.fail', payload));

          this.logger.error('400_={0}', payload);
        },
      ],
    ]);
  }
}
