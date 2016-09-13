namespace flags {

    // tslint:disable:export-name
    export class FlagsEx implements Flags {

        private _event1: event1.Event;


        constructor(event1: event1.Event) {
            this._event1 = event1;
        }

        public init(callback: (e: i18n.LangTag) => void): void {
            const $flags: JQuery = $("#flags");

            for (let i: number = 0; i < i18n.conf.supported.length; i = i + 1) {

                const $flag: JQuery = $("<img/>", {
                    alt: i18n.conf.supported[i].lang,
                    src: "flag/" + i18n.conf.supported[i].region + ".png",

                });

                this._event1.on($flag, "click", () => callback(i18n.conf.supported[i]));

                $flags.append($flag);
            }

        }
    }

    export let i: Flags = new FlagsEx(event1.i);
}
