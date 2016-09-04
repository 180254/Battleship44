/* tslint:disable:no-console */
"use strict";

namespace logger {

    export enum Level {
        TRACE = 6,
        DEBUG = 5,
        INFO = 4,
        WARN = 3,
        ERROR = 2,
        FATAL = 1,
    }

    export class Conf {
        public static level: Level = Level.TRACE;
    }

    export function trace(text: string): void {
        if (logger.Conf.level >= Level.TRACE) {
            console.log(`trace: ${text}`);
        }
    }

    export function debug(text: string): void {
        if (logger.Conf.level >= Level.DEBUG) {
            console.log(`debug: ${text}`);
        }
    }

    export function info(text: string): void {
        if (logger.Conf.level >= Level.INFO) {
            console.log(`info: ${text}`);
        }
    }

    export function warn(text: string): void {
        if (logger.Conf.level >= Level.WARN) {
            console.log(`warn: ${text}`);
        }
    }

    export function error(text: string): void {
        if (logger.Conf.level >= Level.ERROR) {
            console.log(`error: ${text}`);
        }
    }

    export function fatal(text: string): void {
        if (logger.Conf.level >= Level.FATAL) {
            console.log(`fatal: ${text}`);
        }
    }
}
