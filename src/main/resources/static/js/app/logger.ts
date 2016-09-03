namespace Logger {

    export enum Level {
        TRACE = 6,
        DEBUG = 5,
        INFO = 4,
        WARN = 3,
        ERROR = 2,
        FATAL = 1,
    }

    export let minLevel: Level = Level.TRACE;

    export let trace = text => {
        if (Logger.minLevel >= Level.TRACE) {
            console.log(`trace: ${text}`);
        }
    };

    export let debug = text => {
        if (Logger.minLevel >= Level.DEBUG) {
            console.log(`debug: ${text}`);
        }
    };

    export let info = text => {
        if (Logger.minLevel >= Level.INFO) {
            console.log(`info: ${text}`);
        }
    };

    export let warn = text => {
        if (Logger.minLevel >= Level.WARN) {
            console.log(`warn: ${text}`);
        }
    };

    export let error = text => {
        if (Logger.minLevel >= Level.ERROR) {
            console.log(`error: ${text}`);
        }
    };

    export let fatal = text => {
        if (Logger.minLevel >= Level.FATAL) {
            console.log(`fatal: ${text}`);
        }
    };
}
