import {
  LangSelectorEx,
  LangTagComparisonEx,
  LangTagEx,
  SelectType,
} from './i18n.impl';
import {LangFinder, LangTag, LangTagComparison} from './i18n.decl';
import {Level, LoggerEx} from './logger.impl';
import {AssertEx} from './assert.impl';

describe('LangTagEx', () => {
  let assert_: AssertEx;

  before(() => {
    LoggerEx.cLevel = Level.WARN;
    assert_ = new AssertEx();
  });

  describe('constructor', () => {
    it('should create - full-tag', () => {
      const lang: LangTag = new LangTagEx('en', 'US');
      assert_.equals('en', lang.lang);
      assert_.equals('US', lang.region);
    });

    it('should create - lang-only-tag', () => {
      const lang: LangTag = new LangTagEx('en');
      assert_.equals('en', lang.lang);
      assert_.equals(undefined, lang.region);
    });
  });

  // -----------------------------------------------------------------------------------------------------------

  describe('construct from string', () => {
    it('should create - full-tag, separated with -', () => {
      const lang: LangTag = LangTagEx.FromString('en-US');
      assert_.equals('en', lang.lang);
      assert_.equals('US', lang.region);
    });

    it('should create - full-tag, separated with _', () => {
      const lang: LangTag = LangTagEx.FromString('en_US');
      assert_.equals('en', lang.lang);
      assert_.equals('US', lang.region);
    });

    it('should create - lang-only-tag', () => {
      const lang: LangTag = LangTagEx.FromString('en');
      assert_.equals('en', lang.lang);
      assert_.equals(undefined, lang.region);
    });
  });
});

// -----------------------------------------------------------------------------------------------------------

describe('LangTagComparisonEx', () => {
  let assert_: AssertEx;
  let langTagComparison_: LangTagComparisonEx;

  before(() => {
    LoggerEx.cLevel = Level.WARN;
    assert_ = new AssertEx();
    langTagComparison_ = new LangTagComparisonEx();
  });

  describe('exactlyMatches', () => {
    it('should equals - exactly same full-tag', () => {
      assert_.ok(
        langTagComparison_.exactlyMatches(
          new LangTagEx('en', 'US'),
          new LangTagEx('en', 'US')
        )
      );
    });

    it('should equals - exactly same lang-only-tag', () => {
      assert_.ok(
        langTagComparison_.exactlyMatches(
          new LangTagEx('en'),
          new LangTagEx('en')
        )
      );
    });

    it('should not equals - full-tag compared to lang-only-tag ', () => {
      assert_.not(
        langTagComparison_.exactlyMatches(
          new LangTagEx('en', 'US'),
          new LangTagEx('en')
        )
      );
    });

    it('should not equals - lang-only-tag compared to full-tag', () => {
      assert_.not(
        langTagComparison_.exactlyMatches(
          new LangTagEx('en'),
          new LangTagEx('en', 'US')
        )
      );
    });

    it('should not equals - full-tag compared to full-tag - different lang', () => {
      assert_.not(
        langTagComparison_.exactlyMatches(
          new LangTagEx('en', 'US'),
          new LangTagEx('pl', 'US')
        )
      );
    });

    it('should not equals - full-tag compared to full-tag - different regions', () => {
      assert_.not(
        langTagComparison_.exactlyMatches(
          new LangTagEx('en', 'US'),
          new LangTagEx('en', 'GB')
        )
      );
    });

    it('should not equals - lang-only-tag compared to lang-only-tag - different lang', () => {
      assert_.not(
        langTagComparison_.exactlyMatches(
          new LangTagEx('en'),
          new LangTagEx('pl')
        )
      );
    });
  });

  // -----------------------------------------------------------------------------------------------------------

  describe('approxMatches', () => {
    it('should equals - same lang, same region', () => {
      assert_.ok(
        langTagComparison_.approxMatches(
          new LangTagEx('en', 'US'),
          new LangTagEx('en', 'US')
        )
      );
    });

    it('should equals - same lang, different region', () => {
      assert_.ok(
        langTagComparison_.approxMatches(
          new LangTagEx('en', 'US'),
          new LangTagEx('en', 'GB')
        )
      );
    });

    it('should equals - same lang: full-tag compared to lang-only-tag', () => {
      assert_.ok(
        langTagComparison_.approxMatches(
          new LangTagEx('en', 'US'),
          new LangTagEx('en')
        )
      );
    });

    it('should not equals - different lang, different region ', () => {
      assert_.not(
        langTagComparison_.approxMatches(
          new LangTagEx('en', 'US'),
          new LangTagEx('pl', 'PL')
        )
      );
    });

    it('should not equals - different lang, same region ', () => {
      assert_.not(
        langTagComparison_.approxMatches(
          new LangTagEx('en', 'US'),
          new LangTagEx('pl', 'US')
        )
      );
    });
  });
});

// ----------------------------------------------------------------------------------------------------------------

describe('LangSelectorEx', () => {
  class SimpleLangFinder implements LangFinder {
    private readonly _user: LangTag[];
    private readonly _server: LangTag[];

    public constructor(user: string, server: string) {
      this._user = user.length
        ? user.split(' ').map(u => LangTagEx.FromString(u))
        : [];
      this._server = server.length
        ? server.split(' ').map(u => LangTagEx.FromString(u))
        : [];
    }

    public user(): LangTag[] {
      return this._user;
    }

    public server(): LangTag[] {
      return this._server;
    }
  }

  const langTagComparison: LangTagComparison = new LangTagComparisonEx();

  const doSelect: (user: string, server: string) => [LangTag, SelectType] = (
    user,
    server
  ) =>
    new LangSelectorEx(
      new SimpleLangFinder(user, server),
      langTagComparison
    ).select();

  const assertSelectEquals: (
    expected: [string, SelectType],
    actual: [LangTag, SelectType]
  ) => void = (expected, actual) => {
    if (
      !langTagComparison.exactlyMatches(
        LangTagEx.FromString(expected[0]),
        actual[0]
      ) ||
      expected[1] !== actual[1]
    ) {
      throw new Error('expected: {0}, actual: {1}'.format(expected, actual));
    }
  };

  describe('select', () => {
    it('should select default - none match', () => {
      const result: [LangTag, SelectType] = doSelect(
        'en-us de-de en-gb',
        'pl-pl'
      );

      assertSelectEquals(['pl-pl', SelectType.DEFAULT], result);
    });

    it('should select default - user array is empty', () => {
      const result: [LangTag, SelectType] = doSelect(
        '',
        'pl-pl en-gb en pl en-us'
      );
      assertSelectEquals(['pl-pl', SelectType.DEFAULT], result);
    });

    it('should prefer user lang - even if it is not first in server(1)', () => {
      const result: [LangTag, SelectType] = doSelect(
        'de-de de-us pl-pl',
        'en-us en-gb en-us pl-pl'
      );

      assertSelectEquals(['pl-pl', SelectType.EXACTLY], result);
    });

    it('should prefer user lang - even if it is not first in server(2)', () => {
      const result: [LangTag, SelectType] = doSelect(
        'pl en-us',
        'en-us en-gb en-us pl-pl'
      );

      assertSelectEquals(['pl-pl', SelectType.APPROX], result);
    });

    it('should prefer user lang - even if it is not first in server(3)', () => {
      const result: [LangTag, SelectType] = doSelect(
        'pl-pl',
        'en-us pl en-gb en-us'
      );
      assertSelectEquals(['pl', SelectType.APPROX], result);
    });

    it('should prefer general - if same region is not available', () => {
      const result: [LangTag, SelectType] = doSelect(
        'en-us pl-pl',
        'en-gb en de de-de de-uf pl-pl'
      );
      assertSelectEquals(['en', SelectType.APPROX], result);
    });

    it('should prefer other region of first preference instead of exact next preference', () => {
      const result: [LangTag, SelectType] = doSelect(
        'en-us pl-pl',
        'en-gb pl-pl'
      );

      assertSelectEquals(['en-gb', SelectType.APPROX], result);
    });

    it('should understand complex situation', () => {
      const result: [LangTag, SelectType] = doSelect(
        'en-gb pl-pl pl en-us en pl',
        'pl-pl en-us'
      );

      assertSelectEquals(['en-us', SelectType.EXACTLY], result);
    });
  });
});
