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

export class Caller {
  // get@http://localhost:8090/js/dist/app.dist.js:630:17
  // log@http://localhost:8090/js/dist/app.dist.js:606:14
  // trace@http://localhost:8090/js/dist/app.dist.js:575:10
  // initFlags/<@http://localhost:8090/js/dist/app.dist.js:852:19
  // initFlags@<http://localhost:8090/js/dist/app.dist.js:852:19
  private readonly spiderMonkeyRegExp = new RegExp(/(\w+)@/, 'g');

  // Error
  // at Caller.get (logger.ts:98)
  // at Logger.log (logger.ts:71)
  // at Logger.trace (logger.ts:32)
  // at ui-flags.ts:37
  // at Array.forEach (<anonymous>)
  // at UiFlags.initFlags (ui-flags.ts:22)
  private readonly v8RegExp = new RegExp(/at (?:\w+)\.(\w+) \((?!<)/, 'g');

  private readonly commonRegExp = new RegExp(
    '(?:{0})|(?:{1})'.format(this.spiderMonkeyRegExp.source, this.v8RegExp.source),
    'g'
  );

  public get(depth: number): string | null {
    const stack: string | undefined = new Error().stack;
    if (stack === undefined) {
      return null;
    }

    const matchAll: IterableIterator<RegExpMatchArray> = stack.matchAll(this.commonRegExp);

    let currentDepth = -1;
    for (const match of matchAll) {
      if (++currentDepth < depth) {
        // skip depth-1 matches
        continue;
      }
      // spiderMonkeyRegExp substring match is on first pos
      // v8RegExp substring match is on second pos
      return match[1] || match[2];
    }

    return null;
  }
}

export class Logger {
  public static LEVEL: Level = Level.WARN;
  public static STDOUT: Consumer<string> = console.log;
  private static loggerCaller: Caller = new Caller();

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
        level <= Level.WARN ? Level[level].toUpperCase() : Level[level].toLowerCase();

      Logger.STDOUT(
        '{0} | {1}.{2} | {3}'.format(
          level2,
          this.clazz.name || '?',
          // caller depth?
          // [0] LoggerCaller.get
          // [1] Logger.log
          // [2] trace/debug/...
          // [3]
          Logger.loggerCaller.get(3) || '?',
          text.format(...args)
        )
      );
    }
  }
}
