/// <reference path="ui.decl.ts" />
/// <reference path="event1.decl.ts" />
/// <reference path="strings.decl.ts" />
/// <reference path="format.decl.ts" />
/// <reference path="logger.impl.ts" />

namespace ui {

    export class UiEx implements Ui {

        private readonly _logger: logger.Logger = new logger.LoggerEx(UiEx);

        private readonly _$flags: JQuery = $(strings._.flag.id);
        private readonly _event1: event1.Event;
        private readonly _langFinder: i18n.LangFinder;

        public constructor(event1: event1.Event,
                           langFinder: i18n.LangFinder) {
            this._event1 = event1;
            this._langFinder = langFinder;
        }

        public initFlags(callback: Callback<i18n.LangTag>): void {
            this._langFinder.server()
                .forEach((langTag) => {

                    const $flag: JQuery = $("<img/>", {
                        ["alt"]: langTag.lang,
                        ["src"]: "flag/{0}.png".format(langTag.region),
                        ["class"]: strings._.flag.clazz.i,
                    });

                    this._event1.on($flag, "click", () => callback(langTag));
                    this._$flags.append($flag);

                    this._logger.trace("init={0}", langTag);
                });
        }
    }
}
