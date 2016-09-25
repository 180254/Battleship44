/// <reference path="ui.decl.ts" />
/// <reference path="event1.decl.ts" />
/// <reference path="strings.decl.ts" />
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

        public initFlags(callback: (e: i18n.LangTag) => void): void {
            this._langFinder.server()
                .forEach((lang) => {
                    const $flag: JQuery = $("<img/>", {
                        alt: lang.lang,
                        src: "flag/" + lang.region + ".png",
                    });

                    this._event1.on($flag, "click", () => callback(lang));
                    this._$flags.append($flag);

                    this._logger.trace("initFlags={0}", lang);
                });
        }
    }
}
