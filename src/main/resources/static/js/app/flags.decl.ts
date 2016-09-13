namespace flags {

    export interface Flags {

        init(callback: (e: i18n.LangTag) => void): void;
    }
}
