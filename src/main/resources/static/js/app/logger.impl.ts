/// <reference path="logger.decl.ts" />
/// <reference path="format.decl.ts" />

namespace logger {
    "use strict";

    export enum Level {
        TRACE = 6,
        DEBUG = 5,
        INFO = 4,
        WARN = 3,
        ERROR = 2,
        FATAL = 1,
        NONE = 0
    }

    export let cLevel: Level = Level.TRACE;

    // ---------------------------------------------------------------------------------------------------------------

    export class LoggerEx implements Logger {

        public cOutput: (str: string) => void = console.log;

        private readonly _owner: Function;

        public constructor(owner: Function) {
            this._owner = owner;
        }

        public trace(text: string, ...args: any[]): void {
            this._log(Level.TRACE, text, ...args);
        }

        public debug(text: string, ...args: any[]): void {
            this._log(Level.DEBUG, text, ...args);
        }

        public info(text: string, ...args: any[]): void {
            this._log(Level.INFO, text, ...args);
        }

        public warn(text: string, ...args: any[]): void {
            this._log(Level.WARN, text, ...args);
        }

        public error(text: string, ...args: any[]): void {
            this._log(Level.ERROR, text, ...args);
        }

        public fatal(text: string, ...args: any[]): void {
            this._log(Level.FATAL, text, ...args);
        }

        private _log(level: Level, text: string, ...args: any[]): void {
            if (cLevel >= level) {
                this.cOutput("{0}.{1} {2}".format(
                    Level[level].toLowerCase() || "?",
                    this._owner.name || "?",
                    text.format(...args)
                ));
            }
        }
    }
}
