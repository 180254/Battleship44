import './regexp-escape';
import {Logger, LoggerFactory} from './logger';

export class Url {
  private static readonly logger: Logger = LoggerFactory.getLogger(Url);

  public static getParam(name: string): UrlParam | undefined {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const value = urlSearchParams.get(name);
    if (value === null) {
      this.logger.trace('{0}={1}', name, value);
      return undefined;
    }
    this.logger.trace('{0}={1}', name, value);
    return new UrlParam(name, value);
  }

  public static buildUrlWithParams(
    ...params: (UrlParam | undefined)[]
  ): string {
    const locationSearch: string = params
      .filter(p => p !== undefined)
      .map(p => {
        const name: string = encodeURIComponent(p!.name);
        const value: string = encodeURIComponent(p!.value);
        return p!.value ? '{0}={1}'.format(name, value) : '{0}'.format(name);
      })
      .join('&');

    const result: string = '{0}?{1}'
      .format(window.location.origin + window.location.pathname, locationSearch)
      .replace(/\/?\?$/, '');

    this.logger.trace('{0}', result);
    return result;
  }
}

export class UrlParam {
  public readonly name: string;
  public readonly value: string;

  public constructor(name: string, value: string) {
    this.name = name;
    this.value = value;
  }

  public toString(): string {
    return 'UrlParamEx[name={0} value={1}]'.format(this.name, this.value);
  }
}
