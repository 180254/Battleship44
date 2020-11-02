import * as chai from 'chai';
import AssertStatic = Chai.AssertStatic;
import {Level, Logger} from '../../src/js/logger';
import {Random} from '../../src/js/random';

describe('Random', () => {
  // tests are for range <-LARGE, LARGE>
  const LARGE = 0xffffffff;

  // random.random0to1 results in in range <0, 1)
  const ALMOST_ONE = 1 - 1e-12;

  let assert: AssertStatic;
  let random: Random;

  before(() => {
    Logger.LEVEL = Level.WARN;
    assert = chai.assert;
  });

  describe('numArbitrary', () => {
    it('should return value - min, normal', () => {
      random = new Random(() => 0);
      assert.equal(random.numArbitrary(-5.4, 7.8), -5.4);
    });

    it('should return value - min, large', () => {
      random = new Random(() => 0);
      const diff = 0.4;
      assert.equal(random.numArbitrary(-LARGE + diff, LARGE), -LARGE + diff);
    });

    it('should return value - max, normal', () => {
      random = new Random(() => ALMOST_ONE);
      const result: number = random.numArbitrary(-5.4, 7.8);

      assert.closeTo(7.799999, result, 1e-6);
      assert.ok(result < 7.8, 'result < max');
    });

    it('should return value - max, large', () => {
      random = new Random(() => ALMOST_ONE);
      const diff = 0.4;
      const result: number = random.numArbitrary(-LARGE, LARGE - diff);

      assert.closeTo(result, LARGE - diff, 0.1);
      assert.ok(result < LARGE - diff, 'result < max');
    });

    it('should return value - some', () => {
      random = new Random(() => 0.4);
      const result: number = random.numArbitrary(-5.4, 7.8);
      assert.closeTo(result, -0.12, 1e-6);
    });
  });

  describe('int', () => {
    it('should return value - min, normal', () => {
      random = new Random(() => 0);
      assert.equal(random.int(-5, 7), -5);
    });

    it('should return value - min, large', () => {
      random = new Random(() => 0);
      assert.equal(random.int(-LARGE, LARGE), -LARGE);
    });

    it('should return value - max, normal', () => {
      random = new Random(() => ALMOST_ONE);
      assert.equal(random.int(-5, 7), 6);
    });

    it('should return value - max, large', () => {
      random = new Random(() => ALMOST_ONE);
      assert.equal(random.int(-LARGE, LARGE), LARGE - 1);
    });

    it('should return value - some', () => {
      random = new Random(() => 0.75);
      assert.equal(random.int(-5, 7), 4);
    });
  });

  describe('intInclusive', () => {
    it('should return value - min, normal', () => {
      random = new Random(() => 0);
      assert.equal(random.intInclusive(-5, 7), -5);
    });

    it('should return value - min, large', () => {
      random = new Random(() => 0);
      assert.equal(random.intInclusive(-LARGE, LARGE), -LARGE);
    });

    it('should return value - max, normal', () => {
      random = new Random(() => ALMOST_ONE);
      assert.equal(random.intInclusive(-5, 7), 7);
    });

    it('should return value - max, large', () => {
      random = new Random(() => ALMOST_ONE);
      assert.equal(random.intInclusive(-LARGE, LARGE), LARGE);
    });

    it('should return value - some', () => {
      random = new Random(() => 0.75);
      assert.equal(random.intInclusive(-5, 7), 4);
    });
  });
});
