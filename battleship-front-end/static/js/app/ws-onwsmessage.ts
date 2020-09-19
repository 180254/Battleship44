import {Logger} from './logger';
import {Consumer} from './functional-interfaces';
import {i18nKey, Translator} from './ui-i18n';
import {strings} from './html-strings';
import * as $ from 'jquery';
import {Url, UrlParam} from './url';
import {Cell, Grids, GridSelection} from './game-grid';
import {Timeout, UiMessage} from './ui-message';
import {Ws} from './ws-ws';
import {WsMessage} from './ws-wsmessage';
import {DocumentEvent} from './document-event';
import {UiTitle} from './ui-title';
import {
  CellDeserializer,
  CellsDeserializer,
  CellSerializer,
} from './game-grid-serializer';

export class OnWsMessage {
  private readonly _logger: Logger = new Logger(OnWsMessage);

  private _ws!: Ws;
  private readonly funcs: Map<string, Consumer<string>>;
  private readonly uiMessage: UiMessage;
  private readonly grids: Grids;
  private readonly translator: Translator;
  private readonly gridSelection: GridSelection;
  private readonly documentEvent: DocumentEvent;
  private readonly uiTitle: UiTitle;
  private readonly cellSerializer: CellSerializer;
  private readonly cellDeserializer: CellDeserializer;
  private readonly cellsDeserializer: CellsDeserializer;
  public setWs(ws: Ws): void {
    this._ws = ws;
  }

  public constructor(
    uiMessage: UiMessage,
    grids: Grids,
    translator: Translator,
    gridSelection: GridSelection,
    documentEvent: DocumentEvent,
    uiTitle: UiTitle,
    cellSerializer: CellSerializer,
    cellDeserializer: CellDeserializer,
    cellsDeserializer: CellsDeserializer
  ) {
    this.uiMessage = uiMessage;
    this.grids = grids;
    this.translator = translator;
    this.gridSelection = gridSelection;
    this.documentEvent = documentEvent;
    this.uiTitle = uiTitle;
    this.cellDeserializer = cellDeserializer;
    this.cellSerializer = cellSerializer;
    this.cellsDeserializer = cellsDeserializer;

    this.funcs = new Map<string, Consumer<string>>([
      [
        'HI_.',
        payload => {
          this.uiMessage.addFleeting(i18nKey('pre.hi', payload), Timeout.fast);
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
            this._logger.error('unknown_func={0},{1}', 'GAME', payload);
          }
        },
      ],

      [
        'GAME OK',
        payload => {
          this.grids.$opponent.addClass(strings.grid.clazz.inactive);
          this.grids.$shoot.removeClass(strings.grid.clazz.inactive);

          if (payload) {
            const $gameUrl: JQuery = $(strings.info.id_game_url);

            this.translator.removeTranslation($gameUrl);
            $gameUrl.text(
              Url.buildUrlWithParams(
                Url.getParam('v'),
                Url.getParam('m'),
                Url.getParam('d'),
                new UrlParam('id', payload)
              )
            );

            $(strings.info.id_players_game).text(1);
          }

          this.grids.reset();

          this.uiMessage.setFixed(i18nKey('put.info'));
          this.uiMessage.addFixedLink(
            i18nKey('put.done'),
            strings.message.ok.id_ship_selection
          );

          this.gridSelection.activate();
          this.documentEvent.on(
            $(strings.message.ok.id_ship_selection),
            'click',
            () => this._ws.send('GRID {0}'.format(this.gridSelection.collect()))
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
            this._logger.error('unknown_func={0},{1}', 'GRID', payload);
          }
        },
      ],

      [
        'GRID OK',
        () => {
          this.grids.$opponent.removeClass(strings.grid.clazz.inactive);
          this.grids.$shoot.addClass(strings.grid.clazz.inactive);

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
            Timeout.default_,
            strings.message.clazz.fail
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
            this._logger.error('unknown_func={0},{1}', 'TOUR', payload);
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
          this.grids.$shoot.removeClass(strings.grid.clazz.inactive);

          this.uiMessage.setFixed(
            i18nKey('tour.shoot_me'),
            strings.message.clazz.important
          );
          this.uiTitle.setBlinkingTitle(i18nKey('title.shoot_me'), false);

          const $cells: JQuery = this.grids.$shootCells;

          $cells.addClass(strings.cell.clazz.shootable);
          this.documentEvent.onetime($cells, 'click', $td => {
            const pos: string = this.cellSerializer.convert(
              Cell.FromElement($td)
            );

            this._ws.send('SHOT {0}'.format(pos));
          });
        },
      ],

      [
        'TOUR HE',
        () => {
          this.grids.$shoot.addClass(strings.grid.clazz.inactive);
          this.grids.$shootCells.removeClass(strings.cell.clazz.shootable);

          this.uiMessage.setFixed(i18nKey('tour.shoot_opp'));
          this.uiTitle.setFixedTitle(i18nKey('title.shoot_opp'));
        },
      ],

      [
        'YOU_',
        payload => {
          const cells: Cell[] = this.cellsDeserializer.convert(payload);

          const clazzMap: Map<string, string> = new Map([
            ['ship', strings.cell.clazz.ship],
            ['empty', strings.cell.clazz.empty],
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
          const cells: Cell[] = this.cellsDeserializer.convert(payload);

          cells.forEach(cell => {
            this.grids.setCellClass(
              this.grids.$opponent,
              cell,
              strings.cell.clazz.opp_shoot,
              true
            );
          });
        },
      ],

      [
        'WON_',
        payload => {
          this.grids.$opponent.addClass(strings.grid.clazz.inactive);
          this.grids.$shoot.addClass(strings.grid.clazz.inactive);

          const winning: JQuery =
            payload === 'YOU'
              ? $(strings.info.id_winning_me)
              : $(strings.info.id_winning_opp);
          winning.text(Number.parseInt(winning.text()) + 1);

          payload === 'YOU'
            ? this.uiMessage.setFixed(i18nKey('end.won_me'))
            : this.uiMessage.setFixed(i18nKey('end.won_opp'));

          this.uiMessage.addFixedLink(
            i18nKey('end.next_game'),
            strings.message.ok.id_game_next
          );
          this.documentEvent.onetime(
            $(strings.message.ok.id_game_next),
            'click',
            () => this.process(new WsMessage('', 'GAME OK', ''))
          );

          this.uiTitle.setFixedTitle(i18nKey('title.standard'));
        },
      ],

      [
        '1PLA',
        payload => {
          $(strings.info.id_players_game).text(1);

          const interrupted: boolean = payload === 'game-interrupted';

          interrupted
            ? this.uiMessage.setFixed(i18nKey('end.opp_gone'))
            : this.uiMessage.addFleeting(i18nKey('end.opp_gone'), Timeout.slow);

          if (interrupted) {
            this.grids.$shootCells.removeClass(strings.cell.clazz.shootable);
            this.documentEvent.off(this.grids.$shootCells, 'click'); // remove shoot action

            this.uiMessage.addFixedLink(
              i18nKey('end.next_game'),
              strings.message.ok.id_game_next
            );

            this.grids.$opponent.addClass(strings.grid.clazz.inactive);
            this.grids.$shoot.addClass(strings.grid.clazz.inactive);

            this.uiTitle.setFixedTitle(this.uiTitle.standardTitleI18nKey);
          }

          this.documentEvent.onetime(
            $(strings.message.ok.id_game_next),
            'click',
            () => this.process(new WsMessage('', 'GAME OK', ''))
          );
        },
      ],

      [
        '2PLA',
        () => {
          $(strings.info.id_players_game).text(2);

          this.uiMessage.addFleeting(i18nKey('tour.two_players'), Timeout.slow);
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
            players: strings.info.id_players_global,
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

          this._logger.error('400_={0}', payload);
        },
      ],
    ]);

    // -------------------------------------------------------------------------------
  }

  public process(msg: WsMessage): void {
    const callback: Consumer<string> | undefined = this.funcs.get(msg.command);

    if (callback !== undefined) {
      callback(msg.payload);
    } else {
      this._logger.error('unknown={0}', msg);
    }
  }
}
