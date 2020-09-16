import {Serializer} from './serializer.decl';
import './format.decl';
import {Cell} from './grid.decl';

// grid.Cell -> // [0,2]
export class CellSerializerEx implements Serializer<Cell, string> {
  public convert(value: Cell): string {
    return '[{0},{1}]'.format(value.row, value.col);
  }
}

// ---------------------------------------------------------------------------------------------------------------

// [HIT,0,2] -> grid.Cell
export class CellDeserializerEx implements Serializer<string, Cell> {
  public convert(value: string): Cell {
    const cell: string[] = value.replace(/[\\[\]]/g, '').split(',');

    return {
      row: Number.parseInt(cell[1]),
      col: Number.parseInt(cell[2]),
      clazz: cell[0].toLowerCase(),
    };
  }
}

// ---------------------------------------------------------------------------------------------------------------

// [HIT,0,2],[EMPTY,2,1],[EMPTY,2,2] -> grid.Coord[]
export class CellsDeserializerEx implements Serializer<string, Cell[]> {
  private readonly _coordDeserializer: Serializer<string, Cell>;

  public constructor(coordDeserializer: Serializer<string, Cell>) {
    this._coordDeserializer = coordDeserializer;
  }

  public convert(value: string): Cell[] {
    return value.split('],').map(n => {
      return this._coordDeserializer.convert(n);
    });
  }
}
