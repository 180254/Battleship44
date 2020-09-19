import './string-format';
import {Serializer} from './functional-interfaces';
import {Cell} from './game-grid';

// grid.Cell -> // [0,2]
export class CellSerializer implements Serializer<Cell, string> {
  public convert(value: Cell): string {
    return '[{0},{1}]'.format(value.row, value.col);
  }
}

// [HIT,0,2] -> grid.Cell
export class CellDeserializer implements Serializer<string, Cell> {
  public convert(value: string): Cell {
    const cell: string[] = value.replace(/[\\[\]]/g, '').split(',');

    return {
      row: Number.parseInt(cell[1]),
      col: Number.parseInt(cell[2]),
      clazz: cell[0].toLowerCase(),
    };
  }
}

// [HIT,0,2],[EMPTY,2,1],[EMPTY,2,2] -> grid.Cell[]
export class CellsDeserializer implements Serializer<string, Cell[]> {
  private readonly cellDeserializer: CellDeserializer;

  public constructor(cellDeserializer: CellDeserializer) {
    this.cellDeserializer = cellDeserializer;
  }

  public convert(value: string): Cell[] {
    return value.split('],').map(n => {
      return this.cellDeserializer.convert(n);
    });
  }
}
