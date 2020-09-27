import './string-format';
import {Cell} from './game-grid';

export class GridSerializer {
  // grid.Cell -> // [0,2]
  public cellSerializer(value: Cell): string {
    return '[{0},{1}]'.format(value.row, value.col);
  }

  // [HIT,0,2] -> grid.Cell
  public cellDeserializer(value: string): Cell {
    const cell: string[] = value.replace(/[\\[\]]/g, '').split(',');

    return {
      row: Number.parseInt(cell[1]),
      col: Number.parseInt(cell[2]),
      clazz: cell[0].toLowerCase(),
    };
  }

  // [HIT,0,2],[EMPTY,2,1],[EMPTY,2,2] -> grid.Cell[]
  public cellsDeserializer(value: string): Cell[] {
    return value.split('],').map(n => {
      return this.cellDeserializer(n);
    });
  }
}
