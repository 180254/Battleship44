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
    // ---------------------------------------------------------------------------------------------------------------

    export class LoggerEx implements Logger {

        public static cLevel: Level = Level.TRACE;
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
            if (LoggerEx.cLevel >= level) {
                this.cOutput("{0}.{1}.{2} {3}".format(
                    Level[level].toLowerCase() || "?",
                    this._owner.name || "?",

                    // _caller depth?
                    // [0] _caller
                    // [1] _log
                    // [2] debug
                    // [3]
                    logger.LoggerEx._caller(3) || "?",
                    text.format(...args)
                ));
            }
        }

        // -----------------------------------------------------------------------------------------------------------

        private static _caller(depth: number): string | undefined {
            // x@debugger eval code:1:29
            // @debugger eval code:1:1
            const _firefox: string = String.raw`(\w+)@`;

            // at Test.method (<anonymous>:1:29)
            // at func (<anonymous>:1:26)
            // at <anonymous>:1:1
            const _chrome: string = String.raw`at (?:\w+\.)?(<?\w+>?) ?[\(:]`;

            const callerRe: RegExp = new RegExp(
                "{0}|{1}".format(_firefox, _chrome));

            const stack: string[] =
                (new Error().stack || "")
                    .replace("Error\n", "") // chrome
                    .split("\n");

            const match: RegExpExecArray | null = callerRe.exec(stack[depth]);

            return match
                ? match[2]
                : undefined;
        }
    }
}
