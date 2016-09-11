/// <reference path="string.format.ts" />
/// <reference path="util.various.ts" />
/// <reference path="logger.decl.ts" />
/// <reference path="logger.impl.ts" />
/// <reference path="i18n.impl.ts" />
/// <reference path="i18n.impl.ts" />
/// <reference path="event0.decl.ts" />
/// <reference path="event0.impl.ts" />
/// <reference path="title.decl.ts" />
/// <reference path="title.impl.ts" />
/// <reference path="event1.decl.ts" />
/// <reference path="event1.impl.ts" />
/// <reference path="grid.decl.ts" />
/// <reference path="grid.impl.ts" />

namespace app {
    "use strict";

    // config
    logger.conf.level = logger.Level.TRACE;

    i18n.conf.supported = [
        new i18n.LangTagEx("pl", "pl"),
        new i18n.LangTagEx("en", "us"),
    ];

    i18n.conf.path = (lt) => "i18n/{0}.json".format(lt.lang);

    // main, something, start game
    i18n.i.translator.init();
}
