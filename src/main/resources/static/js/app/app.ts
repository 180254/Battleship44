/// <reference path="logger.ts" />
/// <reference path="i18n.ts" />
"use strict";

// config
logger.Conf.level = logger.Level.TRACE;

i18n.Conf.supported = [
    new i18n.LangTag("pl", "pl"),
    new i18n.LangTag("en", "us"),
];
i18n.Conf.stringsPath = (lt) => "i18n/{0}.json".format(lt.lang);

// main
// something, start game
const translator: i18n.Translator = new i18n.Translator();
translator.init();
