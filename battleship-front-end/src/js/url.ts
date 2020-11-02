import './regexp-escape';
import {Logger, LoggerFactory} from './logger';

/**
 * Fixes the issue:
 *  - It is not possible cast 'dom URL' to 'dom Location'.
 *  - It is not possible cast cast 'dom Location' to 'dom URL'.
 * That interface contains common parts of 'dom Location' and 'dom URL' interfaces.
 * It was defined to test the Url class.
 */
export interface SimpleLocation {
  readonly hash: string;
  readonly host: string;
  readonly hostname: string;
  readonly href: string;
  readonly origin: string;
  readonly pathname: string;
  readonly port: string;
  readonly protocol: string;
  readonly search: string;
}

export class Url {
  private readonly logger: Logger = LoggerFactory.getLogger(Url);

  // window.location doc: https://developer.mozilla.org/en-US/docs/Web/API/Location
  private readonly location: SimpleLocation;

  constructor(location?: SimpleLocation) {
    if (location !== undefined) {
      this.location = location;
    } else {
      this.location = window.location;
    }
  }

  public getParam(name: string): UrlParam | null {
    const urlSearchParams: URLSearchParams = new URLSearchParams(this.location.search);
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
      .format(this.location.origin + this.location.pathname, locationSearch)
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
