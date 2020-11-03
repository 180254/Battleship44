import * as chai from 'chai';
import AssertStatic = Chai.AssertStatic;
import {Level, Logger} from '../../src/js/logger';
import {Url, UrlParam} from '../../src/js/url';

describe('Url', () => {
  let assert: AssertStatic;
  let url: Url;

  before(() => {
    Logger.LEVEL = Level.WARN;
    assert = chai.assert;
  });

  describe('getParam', () => {
    const verifyParamMethod: (location: string, name: string, expected: string | null) => void = (
      location,
      name,
      expected
    ) => {
      url = new Url(new URL(location));
      const result: UrlParam | null = url.getParam(name);
      if (expected === null) {
        assert.equal(result, expected);
      } else {
        assert.ok(result !== null);
        assert.equal(result!.name, name);
        assert.equal(result!.value, expected);
      }
    };

    it('should extract param - one provided', () => {
      verifyParamMethod('http://www.example.com/?a=a123b', 'a', 'a123b');
    });

    it('should extract param - several provided, first needed', () => {
      verifyParamMethod('http://www.example.com/?a=a123b&b=1&a123b=c&c=sdf&d=dfd', 'a', 'a123b');
    });

    it('should extract param - several provided, one needed', () => {
      verifyParamMethod('http://www.example.com/?a=a123b&b=1&a123b=c&c=sdf&d=dfd', 'a123b', 'c');
    });

    it('should extract param - several provided, last needed', () => {
      verifyParamMethod('http://www.example.com/?a=a123b&b=1&a123b=c&c=sdf&d=dfd', 'd', 'dfd');
    });

    it('should extract param - name is part of another name', () => {
      verifyParamMethod('http://www.example.com/?aaaa=123&aa=567&a=8', 'aa', '567');
    });

    it('should extract param - name&value must be decoded', () => {
      verifyParamMethod(
        'http://www.example.com/?%5Ekey%25%23=%26value%3D&b=1',
        '^key%#',
        '&value='
      );
    });

    it('should extract param - value is empty, equals mark provided', () => {
      verifyParamMethod('http://www.example.com/?aa&bb=&cc=1', 'bb', '');
    });

    it('should extract param - value is empty, equals mark not provided', () => {
      verifyParamMethod('http://www.example.com/?aa&bb&cc=1', 'bb', '');
    });

    it('should not extract param - as not provided (simple)', () => {
      verifyParamMethod('http://www.example.com/?a=a123b&b=1&a123b=c&c=sdf&d=dfd', '1234', null);
    });

    it('should not extract param - as not provided, but such value exist', () => {
      verifyParamMethod('http://www.example.com/?a=a123b&b=1&a123b=c&c=sdf&d=dfd', 'sdf', null);
    });

    it('should not extract param - as not provided, but has misleading path', () => {
      verifyParamMethod('http://www.example.com/c=d/?a=b', 'c', null);
    });
  });

  describe('buildUrlWithParams', () => {
    const verifyUrlMethod: (location: string, params: UrlParam[], expected: string) => void = (
      location,
      params,
      expected
    ) => {
      url = new Url(new URL(location));
      const result: string = url.buildUrlWithParams(...params);
      assert.equal(result, expected);
    };

    it('should accept no params', () => {
      verifyUrlMethod('http://www.example.com/', [], 'http://www.example.com');
    });

    it('should add - more than one full param', () => {
      verifyUrlMethod(
        'http://www.example.com/',
        [
          new UrlParam('key1', 'value1'),
          new UrlParam('key2', 'value2'),
          new UrlParam('key3', 'value3'),
        ],
        'http://www.example.com/?key1=value1&key2=value2&key3=value3'
      );
    });

    it('should add - one name-only param', () => {
      verifyUrlMethod(
        'http://www.example.com/',
        [new UrlParam('key', '')],
        'http://www.example.com/?key'
      );
    });

    it('should add - more than one name-only param', () => {
      verifyUrlMethod(
        'http://www.example.com/',
        [new UrlParam('key1', ''), new UrlParam('key2', ''), new UrlParam('key3', '')],
        'http://www.example.com/?key1&key2&key3'
      );
    });

    it('should add - mixed types of param', () => {
      verifyUrlMethod(
        'http://www.example.com/',
        [new UrlParam('key1', ''), new UrlParam('key2', 'value2'), new UrlParam('key3', '')],
        'http://www.example.com/?key1&key2=value2&key3'
      );
    });

    it('should add - key&value need be encoded', () => {
      verifyUrlMethod(
        'http://www.example.com/',
        [new UrlParam('^key%#', '&value=')],
        'http://www.example.com/?%5Ekey%25%23=%26value%3D'
      );
    });

    it('should keep loc path - expect protocol, path, sub domain, and path without change', () => {
      verifyUrlMethod(
        'https://sub.www.example.com:33/ala/x/y',
        [new UrlParam('key', '1')],
        'https://sub.www.example.com:33/ala/x/y?key=1'
      );
    });

    it('should keep loc path - also if there is no param', () => {
      verifyUrlMethod(
        'https://sub.www.example.com:33/ala/x/y',
        [],
        'https://sub.www.example.com:33/ala/x/y'
      );
    });

    it('should keep loc path - also if there is no param & pathname', () => {
      verifyUrlMethod('https://sub.www.example.com:33/', [], 'https://sub.www.example.com:33');
    });
  });
});
