import './regexp-escape';
import {Logger, LoggerFactory} from './logger';

export class Url {
  private readonly logger: Logger = LoggerFactory.getLogger(Url);

  // window.location doc: https://developer.mozilla.org/en-US/docs/Web/API/Location

  public getParam(name: string): UrlParam | null {
    const urlSearchParams: URLSearchParams = new URLSearchParams(window.location.search);
    const value: string | null = urlSearchParams.get(name);
    if (value === null) {
      this.logger.debug('{0}={1}', name, value);
      return null;
    }
    this.logger.debug('{0}={1}', name, value);
    return new UrlParam(name, value);
  }

  public buildUrlWithParams(...params: UrlParam[]): string {
    const locationSearch: string = params
      .map(p => {
        const name: string = encodeURIComponent(p.name);
        const value: string = encodeURIComponent(p.value);
        return p.value ? '{0}={1}'.format(name, value) : '{0}'.format(name);
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
    return 'UrlParam[{0}={1}]'.format(this.name, this.value);
  }
}
