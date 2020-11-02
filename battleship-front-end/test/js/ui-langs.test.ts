import './globals'; // define missing Environment globals, to avoid failures
import * as chai from 'chai';
import AssertStatic = Chai.AssertStatic;
import {Level, Logger} from '../../src/js/logger';
import {
  LangFinder,
  LangSelector,
  LangTag,
  LangTagComparer,
  LangTagSelectType,
} from '../../src/js/ui-langs';

describe('ui-langs', () => {
  let assert: AssertStatic;

  before(() => {
    Logger.LEVEL = Level.WARN;
    assert = chai.assert;
  });

  describe('LangTag', () => {
    describe('constructor', () => {
      it('should create - full-tag', () => {
        const lang: LangTag = new LangTag('en', 'US');
        assert.equal(lang.lang, 'en');
        assert.equal(lang.region, 'US');
      });

      it('should create - lang-only-tag', () => {
        const lang: LangTag = new LangTag('en');
        assert.equal(lang.lang, 'en');
        assert.equal(lang.region, undefined);
      });
    });

    describe('construct from string', () => {
      it('should create - full-tag, separated with -', () => {
        const lang: LangTag = LangTag.FromString('en-US');
        assert.equal(lang.lang, 'en');
        assert.equal(lang.region, 'US');
      });

      it('should create - full-tag, separated with _', () => {
        const lang: LangTag = LangTag.FromString('en_US');
        assert.equal(lang.lang, 'en');
        assert.equal(lang.region, 'US');
      });

      it('should create - lang-only-tag', () => {
        const lang: LangTag = LangTag.FromString('en');
        assert.equal(lang.lang, 'en');
        assert.equal(lang.region, undefined);
      });
    });
  });

  describe('LangTagComparer', () => {
    const langTagComparer: LangTagComparer = new LangTagComparer();

    describe('exactlyMatches', () => {
      it('should equals - exactly same full-tag', () => {
        assert.ok(
          //
          langTagComparer.exactlyMatches(new LangTag('en', 'US'), new LangTag('en', 'US'))
        );
      });

      it('should equals - exactly same lang-only-tag', () => {
        assert.ok(
          //
          langTagComparer.exactlyMatches(new LangTag('en'), new LangTag('en'))
        );
      });

      it('should not equals - full-tag compared to lang-only-tag ', () => {
        assert.notOk(
          //
          langTagComparer.exactlyMatches(new LangTag('en', 'US'), new LangTag('en'))
        );
      });

      it('should not equals - lang-only-tag compared to full-tag', () => {
        assert.notOk(
          //
          langTagComparer.exactlyMatches(new LangTag('en'), new LangTag('en', 'US'))
        );
      });

      it('should not equals - full-tag compared to full-tag - different lang', () => {
        assert.notOk(
          //
          langTagComparer.exactlyMatches(new LangTag('en', 'US'), new LangTag('pl', 'US'))
        );
      });

      it('should not equals - full-tag compared to full-tag - different regions', () => {
        assert.notOk(
          //
          langTagComparer.exactlyMatches(new LangTag('en', 'US'), new LangTag('en', 'GB'))
        );
      });

      it('should not equals - lang-only-tag compared to lang-only-tag - different lang', () => {
        assert.notOk(
          //
          langTagComparer.exactlyMatches(new LangTag('en'), new LangTag('pl'))
        );
      });
    });

    describe('approxMatches', () => {
      it('should equals - same lang, same region', () => {
        assert.ok(
          //
          langTagComparer.approxMatches(new LangTag('en', 'US'), new LangTag('en', 'US'))
        );
      });

      it('should equals - same lang, different region', () => {
        assert.ok(
          //
          langTagComparer.approxMatches(new LangTag('en', 'US'), new LangTag('en', 'GB'))
        );
      });

      it('should equals - same lang: full-tag compared to lang-only-tag', () => {
        assert.ok(
          //
          langTagComparer.approxMatches(new LangTag('en', 'US'), new LangTag('en'))
        );
      });

      it('should not equals - different lang, different region ', () => {
        assert.notOk(
          //
          langTagComparer.approxMatches(new LangTag('en', 'US'), new LangTag('pl', 'PL'))
        );
      });

      it('should not equals - different lang, same region ', () => {
        assert.notOk(
          //
          langTagComparer.approxMatches(new LangTag('en', 'US'), new LangTag('pl', 'US'))
        );
      });
    });
  });

  describe('LangSelector', () => {
    class SimpleLangFinder extends LangFinder {
      private readonly _user: LangTag[];
      private readonly _server: LangTag[];

      public constructor(user: string, server: string) {
        super();
        this._user = user.split(' ').map(u => LangTag.FromString(u));
        this._server = server.split(' ').map(u => LangTag.FromString(u));
      }

      public user(): LangTag[] {
        return this._user;
      }

      public server(): LangTag[] {
        return this._server;
      }
    }

    const langTagComparer: LangTagComparer = new LangTagComparer();

    const autoSelect: (user: string, server: string) => [LangTag, LangTagSelectType] = (
      user,
      server
    ) => {
      return new LangSelector(langTagComparer, new SimpleLangFinder(user, server)).autoSelect();
    };

    const assertSelectEquals: (
      expected: [string, LangTagSelectType],
      actual: [LangTag, LangTagSelectType]
    ) => void = (expected, actual) => {
      assert.ok(langTagComparer.exactlyMatches(actual[0], LangTag.FromString(expected[0])));
      assert.equal(actual[1], expected[1]);
    };

    describe('select', () => {
      it('should select default - none match', () => {
        const result: [LangTag, LangTagSelectType] = autoSelect(
          'en-us de-de en-gb', //
          'pl-pl' //
        );

        assertSelectEquals(['pl-pl', LangTagSelectType.DEFAULT], result);
      });

      it('should select default - user array is empty', () => {
        const result: [LangTag, LangTagSelectType] = autoSelect(
          '', //
          'pl-pl en-gb en pl en-us' //
        );
        assertSelectEquals(['pl-pl', LangTagSelectType.DEFAULT], result);
      });

      it('should prefer user lang - even if it is not first in server(1)', () => {
        const result: [LangTag, LangTagSelectType] = autoSelect(
          'de-de de-us pl-pl', //
          'en-us en-gb en-us pl-pl' //
        );

        assertSelectEquals(['pl-pl', LangTagSelectType.EXACTLY], result);
      });

      it('should prefer user lang - even if it is not first in server(2)', () => {
        const result: [LangTag, LangTagSelectType] = autoSelect(
          'pl en-us', //
          'en-us en-gb en-us pl-pl' //
        );

        assertSelectEquals(['pl-pl', LangTagSelectType.APPROX], result);
      });

      it('should prefer user lang - even if it is not first in server(3)', () => {
        const result: [LangTag, LangTagSelectType] = autoSelect(
          'pl-pl', //
          'en-us pl en-gb en-us' //
        );

        assertSelectEquals(['pl', LangTagSelectType.APPROX], result);
      });

      it('should prefer general - if same region is not available', () => {
        const result: [LangTag, LangTagSelectType] = autoSelect(
          'en-us pl-pl', //
          'en-gb en de de-de de-uf pl-pl' //
        );
        assertSelectEquals(['en', LangTagSelectType.APPROX], result);
      });

      it('should prefer other region of first preference instead of exact next preference', () => {
        const result: [LangTag, LangTagSelectType] = autoSelect(
          'en-us pl-pl', //
          'en-gb pl-pl' //
        );

        assertSelectEquals(['en-gb', LangTagSelectType.APPROX], result);
      });

      it('should understand complex situation', () => {
        const result: [LangTag, LangTagSelectType] = autoSelect(
          'en-gb pl-pl pl en-us en pl', //
          'pl-pl en-us' ///
        );

        assertSelectEquals(['en-us', LangTagSelectType.EXACTLY], result);
      });
    });
  });
});
