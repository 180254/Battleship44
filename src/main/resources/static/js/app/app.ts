/// <reference path="logger.ts" />
/// <reference path="i18n.ts" />
"use strict";

// config
logger.Conf.level = logger.Level.TRACE;

i18n.Conf.supported = [
    new i18n.Lang("pl", "pl"),
    new i18n.Lang("en", "us"),
];

// main
// something, start game
