namespace logger {
    "use strict";

    /**
     * Logger.
     *
     * Methods calling example:
     *  logger.debug([CallerClass, this.callerMethod], "[{0},{1}]", index, element);
     */
    export interface Logger {
        trace(who: any[], text: string, ...args: any[]): void;

        debug(who: any[], text: string, ...args: any[]): void;

        info(who: any[], text: string, ...args: any[]): void;

        warn(who: any[], text: string, ...args: any[]): void;

        error(who: any[], text: string, ...args: any[]): void;

        fatal(who: any[], text: string, ...args: any[]): void;
    }
}
