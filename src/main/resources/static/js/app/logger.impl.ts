/// <reference path="logger.decl.ts" />

namespace logger {
    "use strict";

    export class Conf { // tslint:disable:no-stateless-class
        public static set level(value: Level) {
            if (logger.i instanceof LoggerEx) {
                logger.i.level = value;
            }
        }
    }

    export enum Level {
        TRACE = 6,
        DEBUG = 5,
        INFO = 4,
        WARN = 3,
        ERROR = 2,
        FATAL = 1,
        NONE = 0
    }

    export class LoggerEx implements Logger {

        public level: Level = Level.TRACE;

        private log(level: Level, who: any[], text: string, ...args: any[]): void {
            if (this.level >= level) {
                // tslint:disable:no-console
                console.log("{0}: {1} {2}".format(
                    Level[level].toLowerCase(),
                    who.map(e => e.name !== undefined ? e.name.toString() : e.toString()).join("."),
                    text.format(...args)
                ));
            }
        }

        public trace(who: any[], text: string, ...args: any[]): void {
            this.log(Level.TRACE, who, text, ...args);
        }

        public debug(who: any[], text: string, ...args: any[]): void {
            this.log(Level.DEBUG, who, text, ...args);
        }

        public info(who: any[], text: string, ...args: any[]): void {
            this.log(Level.INFO, who, text, ...args);
        }

        public warn(who: any[], text: string, ...args: any[]): void {
            this.log(Level.WARN, who, text, ...args);
        }

        public error(who: any[], text: string, ...args: any[]): void {
            this.log(Level.ERROR, who, text, ...args);
        }

        public fatal(who: any[], text: string, ...args: any[]): void {
            this.log(Level.FATAL, who, text, ...args);
        }
    }

    export let i: Logger = new LoggerEx();
}
