/// <reference path="logger.impl.ts" />
/// <reference path="i18n.impl.ts" />
/// <reference path="title.ts" />
"use strict";

// config
logger.Conf.level = logger.Level.TRACE;

i18n.Conf.supported = [
    new i18n.LangTagEx("pl", "pl"),
    new i18n.LangTagEx("en", "us"),
];
i18n.Conf.path = (lt) => "i18n/{0}.json".format(lt.lang);

// main
// something, start game
const langSetter: i18n.LangSetter = new i18n.LangSetterEx();
const translator: i18n.Translator = new i18n.TranslatorEx(langSetter);
translator.init();
