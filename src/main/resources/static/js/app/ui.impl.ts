/// <reference path="ui.decl.ts" />
/// <reference path="event1.decl.ts" />

namespace ui {

    export class UiEx implements Ui {

        public $cFlags: JQuery = $("#flags");

        private readonly _event1: event1.Event;
        private readonly _langFinder: i18n.LangFinder;

        public constructor(event1: event1.Event,
                           langFinder: i18n.LangFinder) {
            this._event1 = event1;
            this._langFinder = langFinder;
        }

        public initFlags(callback: (e: i18n.LangTag) => void): void {
            const supported: i18n.LangTag[] = this._langFinder.server();

            for (let i: number = 0; i < supported.length; i = i + 1) {

                const $flag: JQuery = $("<img/>", {
                    alt: supported[i].lang,
                    src: "flag/" + supported[i].region + ".png",
                });

                this._event1.on($flag, "click", () => callback(supported[i]));
                this.$cFlags.append($flag);
            }
        }
    }
}
