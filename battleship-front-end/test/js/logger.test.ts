import * as chai from 'chai';
import AssertStatic = Chai.AssertStatic;
import {Level, Logger, LoggerFactory} from '../../src/js/logger';

class TestClass {}

describe('Logger', () => {
  let assert: AssertStatic;
  let logger: Logger;
  let output: string;

  before(() => {
    Logger.LEVEL = Level.WARN;
    assert = chai.assert;
    logger = LoggerFactory.getLogger(TestClass);
    Logger.STDOUT = str => (output += str + '\n');
  });

  beforeEach(() => {
    output = '';
  });

  describe('debug', () => {
    it('should provide in output - marked level for >=warn', () => {
      // given
      Logger.LEVEL = Level.TRACE;
      // when
      logger.warn('xyz');
      // then
      assert.include(output, 'WARN');
    });

    it('should provide in output - not marked level for <warn', () => {
      // given
      Logger.LEVEL = Level.TRACE;
      // when
      logger.info('xyz');
      // then
      assert.include(output, 'info');
      assert.notInclude(output, 'INFO');
    });

    it('should provide in output - given text', () => {
      // given
      Logger.LEVEL = Level.TRACE;
      // when
      logger.debug('xyz');
      // then
      assert.include(output, 'xyz');
    });

    it('should provide in output - given parametrized text', () => {
      // given
      Logger.LEVEL = Level.TRACE;
      // when
      logger.debug('xy{0}z', 19);
      // then
      assert.include(output, 'xy19z');
    });

    it('should provide in output - owner name', () => {
      // given
      Logger.LEVEL = Level.TRACE;
      // when
      logger.debug('xyz');
      // then
      assert.include(output, 'TestClass');
    });

    it('should provide in output - caller name, function', () => {
      // given
      Logger.LEVEL = Level.TRACE;
      // when
      logger.debug('xyz');
      // then
      assert.include(output, 'runTest');
    });

    it('should provide in output - caller name, method', () => {
      // given
      Logger.LEVEL = Level.TRACE;

      class Test {
        public sth(): void {
          logger.debug('xyz');
        }
      }

      // when
      new Test().sth();

      // then
      assert.include(output, 'sth');
    });

    it('should provide in output - caller name, static method', () => {
      // given
      Logger.LEVEL = Level.TRACE;

      class Test {
        public static Sth(): void {
          logger.debug('xyz');
        }
      }

      // when
      Test.Sth();

      // then
      assert.include(output, 'Sth');
    });

    it('should log - current level is lower', () => {
      // given
      Logger.LEVEL = Level.TRACE;
      // when
      logger.debug('xyz');
      // then
      assert.notEqual(output, '');
    });

    it('should log - current level is same', () => {
      // given
      Logger.LEVEL = Level.DEBUG;
      // when
      logger.debug('xyz');
      // then
      assert.notEqual(output, '');
    });

    it('should not log - current level is higher', () => {
      // given
      Logger.LEVEL = Level.INFO;
      // when
      logger.debug('xyz');
      // then
      assert.equal(output, '');
    });
  });
});
