import {
  CellDeserializerEx,
  CellsDeserializerEx,
  CellSerializerEx,
} from './serializer.impl';
import {Level, LoggerEx} from './logger.impl';
import {AssertEx} from './assert.impl';
import {Cell} from './grid.decl';

describe('CellSerializerEx', () => {
  let assert_: AssertEx;
  let cellSerializer_: CellSerializerEx;

  before(() => {
    LoggerEx.cLevel = Level.WARN;
    assert_ = new AssertEx();
    cellSerializer_ = new CellSerializerEx();
  });

  it('should convert - cell to expected string', () => {
    const cell: Cell = {
      row: 3,
      col: 7,
      clazz: 'xyz',
    };
    const result: string = cellSerializer_.convert(cell);

    assert_.equals('[3,7]', result);
  });
});

// -----------------------------------------------------------------------------------------------------------

describe('CellDeserializerEx', () => {
  let assert_: AssertEx;
  let cellDeserializer_: CellDeserializerEx;

  before(() => {
    LoggerEx.cLevel = Level.WARN;
    assert_ = new AssertEx();
    cellDeserializer_ = new CellDeserializerEx();
  });

  it('should convert - string to cell', () => {
    const cell: Cell = cellDeserializer_.convert('[HIT,0,2]');
    assert_.equals('hit', cell.clazz);
    assert_.equals(0, cell.row);
    assert_.equals(2, cell.col);
  });
});

// -----------------------------------------------------------------------------------------------------------

describe('CellsDeserializerEx', () => {
  let assert_: AssertEx;
  let cellsDeserializer_: CellsDeserializerEx;

  before(() => {
    LoggerEx.cLevel = Level.WARN;
    assert_ = new AssertEx();

    cellsDeserializer_ = new CellsDeserializerEx(new CellDeserializerEx());
  });

  it('should convert - string to array of cells', () => {
    const cells: Cell[] = cellsDeserializer_.convert(
      '[HIT,1,2],[EMPTY,4,5],[OTHER,7,8]'
    );
    assert_.equals(3, cells.length);

    assert_.equals('hit', cells[0].clazz);
    assert_.equals(1, cells[0].row);
    assert_.equals(2, cells[0].col);

    assert_.equals('empty', cells[1].clazz);
    assert_.equals(4, cells[1].row);
    assert_.equals(5, cells[1].col);

    assert_.equals('other', cells[2].clazz);
    assert_.equals(7, cells[2].row);
    assert_.equals(8, cells[2].col);
  });
});
