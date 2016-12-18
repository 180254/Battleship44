declare namespace logger {

    interface Logger {

        trace(text: string, ...args: any[]): void;
        debug(text: string, ...args: any[]): void;
        info(text: string, ...args: any[]): void;
        warn(text: string, ...args: any[]): void;
        error(text: string, ...args: any[]): void;
        fatal(text: string, ...args: any[]): void;
    }
}
