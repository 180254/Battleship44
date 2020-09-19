import {Consumer} from './functional-interfaces';
import './string-format';

export enum Level {
  TRACE = 6,
  DEBUG = 5,
  INFO = 4,
  WARN = 3,
  ERROR = 2,
  FATAL = 1,
  NONE = 0,
}

export class LoggerFactory {
  public static getLogger(clazz: Function): Logger {
    return new Logger(clazz);
  }
}

export class Logger {
  public static LEVEL: Level = Level.TRACE;
  public static STDOUT: Consumer<string> = console.log;
  private static callerRegexp: RegExp;

  private readonly clazz: Function;

  constructor(clazz: Function) {
    this.clazz = clazz;
  }

  public trace(text: string, ...args: unknown[]): void {
    this.log(Level.TRACE, text, ...args);
  }

  public debug(text: string, ...args: unknown[]): void {
    this.log(Level.DEBUG, text, ...args);
  }

  public info(text: string, ...args: unknown[]): void {
    this.log(Level.INFO, text, ...args);
  }

  public warn(text: string, ...args: unknown[]): void {
    this.log(Level.WARN, text, ...args);
  }

  public error(text: string, ...args: unknown[]): void {
    this.log(Level.ERROR, text, ...args);
  }

  public fatal(text: string, ...args: unknown[]): void {
    this.log(Level.FATAL, text, ...args);
  }

  private log(level: Level, text: string, ...args: unknown[]): void {
    if (Logger.LEVEL >= level) {
      const level2: string =
        level <= Level.WARN
          ? Level[level].toUpperCase()
          : Level[level].toLowerCase();

      Logger.STDOUT(
        '{0} | {1}.{2} | {3}'.format(
          level2,
          this.clazz.name || '?',
          // caller depth?
          // [0] _caller
          // [1] _log
          // [2] trace/debug/...
          // [3]
          Logger.loggerCaller(3) || '?',
          text.format(...args)
        )
      );
    }
  }

  private static loggerCaller(depth: number): string | null {
    if (!this.callerRegexp) {
      // x@debugger eval code:1:29
      // @debugger eval code:1:1
      const _spiderMonkey: string = String.raw`(\w+)@`;

      // at Test.method (<anonymous>:1:29)
      // at func (<anonymous>:1:26)
      // at <anonymous>:1:1
      const _v8: string = String.raw`at (?:\w+\.)?(<?\w+>?) ?[\(: ]`;

      // at Test.method (eval code:1:29)
      // at func (eval code:1:26)
      // at eval code (eval code:1:1)
      // const _chakra = undefined; // handled by _v8, additional regexp not needed

      this.callerRegexp = new RegExp(
        '(?:{0})|(?:{1})'.format(_spiderMonkey, _v8)
      );
    }

    const stack: string[] = (new Error().stack || '')
      .replace('Error\n', '') // v8, chakra
      .split('\n');

    const match: RegExpExecArray | null = this.callerRegexp.exec(stack[depth]);
    return match ? match[2] : null;
  }
}
