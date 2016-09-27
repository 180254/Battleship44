/// <reference path="serializer.impl.ts"/>
/// <reference path="assert.impl.ts"/>
/// <reference path="logger.impl.ts"/>
/// <reference types="mocha" />

namespace serializer {
    "use strict";

    describe("CellSerializerEx", () => {

        let assert_: assert.AssertEx;
        let cellSerializer_: CellSerializerEx;

        before(() => {
            logger.LoggerEx.cLevel = logger.Level.WARN;
            assert_ = new assert.AssertEx();
            cellSerializer_ = new CellSerializerEx();
        });

        it("should convert - cell to expected string", () => {
            const cell: grid.Cell = {
                row: 3,
                col: 7,
                clazz: "xyz",
            };
            const result: string = cellSerializer_.convert(cell);

            assert_.equals("[3,7]", result);
        });
    });

    // -----------------------------------------------------------------------------------------------------------

    describe("CellDeserializerEx", () => {

        let assert_: assert.AssertEx;
        let cellDeserializer_: CellDeserializerEx;

        before(() => {
            logger.LoggerEx.cLevel = logger.Level.WARN;
            assert_ = new assert.AssertEx();
            cellDeserializer_ = new CellDeserializerEx();
        });

        it("should convert - string to cell", () => {
            const cell: grid.Cell = cellDeserializer_.convert("[HIT,0,2]");
            assert_.equals("hit", cell.clazz);
            assert_.equals(0, cell.row);
            assert_.equals(2, cell.col);
        });
    });

    // -----------------------------------------------------------------------------------------------------------

    describe("CellsDeserializerEx", () => {

        let assert_: assert.AssertEx;
        let cellsDeserializer_: CellsDeserializerEx;

        before(() => {
            logger.LoggerEx.cLevel = logger.Level.WARN;
            assert_ = new assert.AssertEx();

            cellsDeserializer_ = new CellsDeserializerEx(
                new CellDeserializerEx()
            );
        });

        it("should convert - string to array of cells", () => {
            const cells: grid.Cell[] = cellsDeserializer_.convert("[HIT,1,2],[EMPTY,4,5],[OTHER,7,8]");
            assert_.equals(3, cells.length);

            assert_.equals("hit", cells[0].clazz);
            assert_.equals(1, cells[0].row);
            assert_.equals(2, cells[0].col);

            assert_.equals("empty", cells[1].clazz);
            assert_.equals(4, cells[1].row);
            assert_.equals(5, cells[1].col);

            assert_.equals("other", cells[2].clazz);
            assert_.equals(7, cells[2].row);
            assert_.equals(8, cells[2].col);
        });
    });
}
