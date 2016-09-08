"use strict";

interface Logger {

    trace(text: string): void;

    debug(text: string): void;

    info(text: string): void;

    warn(text: string): void;

    error(text: string): void;

    fatal(text: string): void;
}
