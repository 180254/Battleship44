import * as chai from 'chai';
import AssertStatic = Chai.AssertStatic;
import {Level, Logger} from '../../src/js/logger';

describe('string', () => {
  let assert: AssertStatic;

  before(() => {
    Logger.LEVEL = Level.WARN;
    assert = chai.assert;
  });

  describe('format', () => {
    it('should accept param with type - string', () => {
      assert.equal('/{0}/'.format('a'), '/a/');
    });

    it('should accept param with type - number', () => {
      assert.equal('/{0}/'.format(48), '/48/');
    });

    it('should accept param with type - null', () => {
      assert.equal('/{0}/'.format(null), '/null/');
    });

    it('should accept param with type - undefined', () => {
      assert.equal('/{0}/'.format(undefined), '/undefined/');
    });

    it('should accept param with type - mixed', () => {
      assert.equal('/{0}-{1}-{2}/'.format(1, 5, 'RR'), '/1-5-RR/');
    });

    it('should not fail on unused params', () => {
      assert.equal('/z-x-c-y/'.format('1', '2', '3', '4'), '/z-x-c-y/');
    });

    it('should not fail on missing params - none provided', () => {
      assert.equal('/{0}-{1}-{2}/'.format(), '/{0}-{1}-{2}/');
    });

    it('should not fail on missing params - some provided', () => {
      assert.equal('/{0}-{1}-{2}/'.format(1, 5), '/1-5-{2}/');
    });

    it('should not follow reference change - example1', () => {
      assert.equal('/{0}-{1}-{2}/'.format('{1}', 5), '/{1}-5-{2}/');
    });

    it('should not follow reference change - example2', () => {
      assert.equal('/{0}-{1}-{2}/'.format('{2}', '{1}', 5), '/{2}-{1}-5/');
    });

    it('should not fail on missing reference - none found', () => {
      assert.equal('/a-b-c/'.format('x', 'y', 5), '/a-b-c/');
    });

    it('should not fail on missing reference - some found', () => {
      assert.equal('/{1}-b-c/'.format('x', 'y', 5), '/y-b-c/');
    });

    it('should fill - multiple references', () => {
      assert.equal('/{0}-{0}-{1}/'.format('x', 'y'), '/x-x-y/');
    });

    it('should fill - references not sorted', () => {
      assert.equal('/{2}-{0}-{3}-{1}/'.format('x', 'y', 'z', 'c'), '/z-x-c-y/');
    });
  });
});
