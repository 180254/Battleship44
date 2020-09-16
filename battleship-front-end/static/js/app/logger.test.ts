import {Level, LoggerEx} from './logger.impl';
import {AssertEx} from './assert.impl';

class TestClass {
  public test = '123';
}

describe('LoggerEx', () => {
  let assert_: AssertEx;
  let logger_: LoggerEx;
  let output: string;

  before(() => {
    assert_ = new AssertEx();
    logger_ = new LoggerEx(TestClass);
    logger_.cOutput = str => (output += str + '\n');
  });

  beforeEach(() => {
    LoggerEx.cLevel = Level.TRACE;
    output = '';
  });

  describe('debug', () => {
    it('should provide in output - marked level for >=warn', () => {
      logger_.warn('xyz');
      assert_.strContains(output, 'WARN');
    });

    it('should provide in output - not marked level for <warn', () => {
      logger_.info('xyz');
      assert_.strContains(output, 'info');
      assert_.strNotContains(output, 'INFO');
    });

    it('should provide in output - given text', () => {
      logger_.debug('xyz');
      assert_.strContains(output, 'xyz');
    });

    it('should provide in output - given parametrized text', () => {
      logger_.debug('xy{0}z', 19);
      assert_.strContains(output, 'xy19z');
    });

    it('should provide in output - owner name', () => {
      logger_.debug('xyz');
      assert_.strContains(output, 'TestClass');
    });

    it('should provide in output - caller name, function', () => {
      logger_.debug('xyz');
      assert_.strContains(output, 'it');
    });

    it('should provide in output - caller name, method', () => {
      class Test {
        public sth(): void {
          logger_.debug('xyz');
        }
      }

      new Test().sth();
      assert_.strContains(output, 'sth');
    });

    it('should provide in output - caller name, static method', () => {
      class Test {
        public test = '123';

        public static Sth(): void {
          logger_.debug('xyz');
        }
      }

      Test.Sth();
      assert_.strContains(output, 'Sth');
    });

    it('should log - current level is lower', () => {
      LoggerEx.cLevel = Level.TRACE;
      logger_.debug('xyz');
      assert_.notEquals('', output);
    });

    it('should log - current level is same', () => {
      LoggerEx.cLevel = Level.DEBUG;
      logger_.debug('xyz');
      assert_.notEquals('', output);
    });

    it('should not log - current level is higher', () => {
      LoggerEx.cLevel = Level.INFO;
      logger_.debug('xyz');
      assert_.equals('', output);
    });
  });
});
