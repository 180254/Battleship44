export const htmlStrings = {
  theme: {
    selector: {
      switcher: '#theme-switcher',
      holder: '#body',
    },
  },

  flags: {
    selector: {
      container: '#flags',
    },
    clazz: {
      default: 'flag',
    },
  },

  message: {
    id: {
      container: 'messages',
      const: 'message-const',
    },

    selector: {
      container: '#messages',
      const: '#message-const',
    },

    clazz: {
      default: 'message',
      fail: 'message-fail',
      important: 'message-important',
    },

    ok: {
      id: {
        ship_selection: 'ok-ship-selection',
        random_ship_selection: 'random-ship-selection',
        game_next: 'ok-game-next',
      },

      selector: {
        ship_selection: '#ok-ship-selection',
        random_ship_selection: '#random-ship-selection',
        game_next: '#ok-game-next',
      },
    },
  },

  grid: {
    selector: {
      container: '#grids',
      opponent: '#grid-opponent',
      shoot: '#grid-shoot',
    },

    clazz: {
      default: 'grid',
      inactive: 'grid-inactive',
    },
  },

  cell: {
    selector: {
      opponent: '#grid-opponent td',
      shoot: '#grid-shoot td',
    },

    clazz: {
      unknown: 'cell-unknown',
      empty: 'cell-empty',
      ship: 'cell-ship',
      ship_sunk: 'cell-ship-sunk',
      opp_shoot: 'cell-oppshoot',
      shootable: 'cell-shootable',
    },
  },

  info: {
    selector: {
      container: '#info',
      game_url: '#info-game-url',
      players_game: '#info-players-game',
      players_global: '#info-players-global',
      winning_ratio: '#info-winning-ratio',
      winning_me: '#info-winning-me',
      winning_opp: '#info-winning-opp',
    },

    clazz: {
      td_1: 'info-td-1',
      td_2: 'info-td-2',
    },
  },

  game_rules: {
    selector: {
      data_game_rules_change: '[data-game-rules-change]',
    },

    attribute: {
      data_game_rules_change: 'data-game-rules-change',
    },

    clazz: {
      change_enabled: 'change-enabled',
      change_disabled: 'change-disabled',
    },
  },
};
