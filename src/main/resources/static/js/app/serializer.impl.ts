/// <reference path="serializer.decl.ts" />
/// <reference path="grid.impl.ts" />

namespace serializer {
    "use strict";

    // grid.Coord -> // [0,2]
    export class CoordSerializer implements Serializer<grid.Coord, string> {
        public convert(value: grid.Coord): string {
            return "[{0},{1}]".format(value.row, value.col);
        }
    }

    // [HIT.0,2] -> grid.Coord
    export class CoordDeserializer implements Serializer<string, grid.Coord> {

        public convert(value: string): grid.Coord {
            const cell: string[] = value
                .replace(/[\[\]]/g, "")
                .split(",");

            return new grid.CoordEx(
                Number.parseInt(cell[1]),
                Number.parseInt(cell[2]),
                cell[0].toLowerCase()
            );
        }
    }

    // [HIT.0,2],[EMPTY,2,1],[EMPTY,2,2] -> grid.Coord[]
    export class CoordsDeserializer implements Serializer<string, grid.Coord[]> {

        private readonly _coordDeserializer: Serializer<string, grid.Coord>;

        public constructor(coordDeserializer: serializer.Serializer<string, grid.Coord>) {
            this._coordDeserializer = coordDeserializer;
        }

        public convert(value: string): grid.Coord[] {
            return value.split("],").map(function (n: string): grid.Coord {
                return this._coordDeserializer.convert(n);
            });
        }
    }

    // --------------------------------------------------------------------------------------------------------------

    class Singleton {
        public coordSerializer: Serializer<grid.Coord, string> = new CoordSerializer();
        public coordDeserializer: Serializer<string, grid.Coord> = new CoordDeserializer();
        public coordsDeserializer: Serializer<string, grid.Coord[]> = new CoordsDeserializer(this.coordDeserializer);
    }

    export const i: Singleton = new Singleton();
}
