import * as chai from 'chai';
import AssertStatic = Chai.AssertStatic;
import {Cell} from '../../src/js/game-grid';
import {GridSerializer} from '../../src/js/game-grid-serializer';
import {Level, Logger} from '../../src/js/logger';

describe('GridSerializer', () => {
  let assert: AssertStatic;
  let gridSerializer: GridSerializer;

  before(() => {
    Logger.LEVEL = Level.WARN;
    assert = chai.assert;
    gridSerializer = new GridSerializer();
  });

  describe('cellSerializer', () => {
    it('should convert - cell to expected string', () => {
      const cell: Cell = {
        row: 3,
        col: 7,
        clazz: 'xyz',
      };
      const result: string = gridSerializer.cellSerializer(cell);

      assert.equal(result, '[3,7]');
    });
  });

  describe('cellDeserializer', () => {
    it('should convert - string to cell', () => {
      const cell: Cell = gridSerializer.cellDeserializer('[HIT,0,2]');
      assert.equal(cell.clazz, 'hit');
      assert.equal(cell.row, 0);
      assert.equal(cell.col, 2);
    });
  });

  describe('cellsDeserializer', () => {
    it('should convert - string to array of cells', () => {
      const cells: Cell[] = gridSerializer.cellsDeserializer('[HIT,1,2],[EMPTY,4,5],[OTHER,7,8]');
      assert.equal(cells.length, 3);

      assert.equal(cells[0].clazz, 'hit');
      assert.equal(cells[0].row, 1);
      assert.equal(cells[0].col, 2);

      assert.equal(cells[1].clazz, 'empty');
      assert.equal(cells[1].row, 4);
      assert.equal(cells[1].col, 5);

      assert.equal(cells[2].clazz, 'other');
      assert.equal(cells[2].row, 7);
      assert.equal(cells[2].col, 8);
    });
  });
});
