/// <reference path="serializer.decl.ts" />
/// <reference path="grid.impl.ts" />

namespace serializer {
    "use strict";

    // grid.Cell -> // [0,2]
    export class CellSerializer implements Serializer<grid.Cell, string> {

        public convert(value: grid.Cell): string {
            return "[{0},{1}]".format(value.row, value.col);
        }
    }

    // [HIT,0,2] -> grid.Cell
    export class CellDeserializer implements Serializer<string, grid.Cell> {

        public convert(value: string): grid.Cell {
            const cell: string[] = value
                .replace(/[\[\]]/g, "")
                .split(",");

            return new grid.CellEx(
                Number.parseInt(cell[1]),
                Number.parseInt(cell[2]),
                cell[0].toLowerCase()
            );
        }
    }

    // [HIT.0,2],[EMPTY,2,1],[EMPTY,2,2] -> grid.Coord[]
    export class CellsDeserializer implements Serializer<string, grid.Cell[]> {

        private readonly _coordDeserializer: Serializer<string, grid.Cell>;

        public constructor(coordDeserializer: serializer.Serializer<string, grid.Cell>) {
            this._coordDeserializer = coordDeserializer;
        }

        public convert(value: string): grid.Cell[] {
            return value.split("],").map(function (n: string): grid.Cell {
                return this._coordDeserializer.convert(n);
            });
        }
    }

    // --------------------------------------------------------------------------------------------------------------

    class Singleton {
        public cellToStr: Serializer<grid.Cell, string> = new CellSerializer();
        public strToCell: Serializer<string, grid.Cell> = new CellDeserializer();
        public strToCells: Serializer<string, grid.Cell[]> = new CellsDeserializer(this.strToCell);
    }

    export const i: Singleton = new Singleton();
}
