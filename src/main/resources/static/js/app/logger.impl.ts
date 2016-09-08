/* tslint:disable:no-console */
/// <reference path="logger.decl.ts" />

"use strict";

namespace logger {

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

        public trace(text: string): void {
            if (this.level >= Level.TRACE) {
                console.log(`trace: ${text}`);
            }
        }

        public debug(text: string): void {
            if (this.level >= Level.DEBUG) {
                console.log(`debug: ${text}`);
            }
        }

        public info(text: string): void {
            if (this.level >= Level.INFO) {
                console.log(`info: ${text}`);
            }
        }

        public warn(text: string): void {
            if (this.level >= Level.WARN) {
                console.log(`warn: ${text}`);
            }
        }

        public error(text: string): void {
            if (this.level >= Level.ERROR) {
                console.log(`error: ${text}`);
            }
        }

        public fatal(text: string): void {
            if (this.level >= Level.FATAL) {
                console.log(`fatal: ${text}`);
            }
        }
    }

    export let i: Logger = new LoggerEx();
}
