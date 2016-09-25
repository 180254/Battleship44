/// <reference path="serializer.decl.ts" />
/// <reference path="grid.decl.ts" />
/// <reference path="format.decl.ts" />

namespace serializer {
    "use strict";

    // grid.Cell -> // [0,2]
    export class CellSerializerEx implements Serializer<grid.Cell, string> {

        public convert(value: grid.Cell): string {
            return "[{0},{1}]".format(value.row, value.col);
        }
    }

    // ---------------------------------------------------------------------------------------------------------------

    // [HIT,0,2] -> grid.Cell
    export class CellDeserializerEx implements Serializer<string, grid.Cell> {

        public convert(value: string): grid.Cell {
            const cell: string[] =
                value
                    .replace(/[\[\]]/g, "")
                    .split(",");

            return {
                row: Number.parseInt(cell[1]),
                col: Number.parseInt(cell[2]),
                clazz: cell[0].toLowerCase(),
            };
        }
    }

    // ---------------------------------------------------------------------------------------------------------------

    // [HIT,0,2],[EMPTY,2,1],[EMPTY,2,2] -> grid.Coord[]
    export class CellsDeserializerEx implements Serializer<string, grid.Cell[]> {

        private readonly _coordDeserializer: Serializer<string, grid.Cell>;

        public constructor(coordDeserializer: Serializer<string, grid.Cell>) {
            this._coordDeserializer = coordDeserializer;
        }

        public convert(value: string): grid.Cell[] {
            return value.split("],").map((n) => {
                return this._coordDeserializer.convert(n);
            });
        }
    }
}
