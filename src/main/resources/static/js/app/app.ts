/// <reference path="logger.impl.ts" />
/// <reference path="i18n.impl.ts" />
/// <reference path="title.impl.ts" />

namespace app {
    "use strict";

    // config
    logger.conf.level = logger.Level.TRACE;

    i18n.conf.supported = [
        new i18n.LangTagEx("pl", "pl"),
        new i18n.LangTagEx("en", "us"),
    ];
    i18n.conf.path = (lt) => "i18n/{0}.json".format(lt.lang);

    // main
    // something, start game
    i18n.i.translator.init();
}
