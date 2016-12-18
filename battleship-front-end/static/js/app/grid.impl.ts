/// <reference path="grid.decl.ts" />
/// <reference path="format.decl.ts" />
/// <reference path="strings.decl.ts" />

namespace grid {
    "use strict";

    export class CellEx implements Cell {

        public readonly row: number;
        public readonly col: number;
        public readonly clazz?: string;

        public constructor(row: number, col: number, clazz?: string) {
            this.row = row;
            this.col = col;
            this.clazz = clazz;
        }

        public static FromElement($cell: JQuery): CellEx {
            return new CellEx(
                Number.parseInt($cell.attr("data-row-i")),
                Number.parseInt($cell.attr("data-col-i"))
            );
        }

        public toString(): string {
            return "CoordEx[row={0} col={1} clazz={2}]".format(this.row, this.col, this.clazz);
        }
    }

    // ---------------------------------------------------------------------------------------------------------------

    export class GridsEx implements Grids {

        public cRows: number = 10;
        public cCols: number = 10;

        public readonly $shoot: JQuery = $(strings._.grid.id_shoot);
        public $shootCells: JQuery;

        public readonly $opponent: JQuery = $(strings._.grid.id_opponent);
        public $opponentCells: JQuery;

        public init(): void {
            this._createGrid(
                this.$shoot.attr("id")
            ).appendTo(this.$shoot);

            this._createGrid(
                this.$opponent.attr("id")
            ).appendTo(this.$opponent);

            this.$shootCells = this.$shoot.find("td");
            this.$opponentCells = this.$opponent.find("td");
        }

        public reset(): void {
            const unknown: string = strings._.cell.clazz.unknown;
            this.$shootCells .attr("class", unknown);
            this.$opponentCells.attr("class", unknown);
        }

        public setCellClass($grid: JQuery, cell: Cell, clazz: string, keepCurrent: boolean): void {
            const $element: JQuery =
                $grid
                    .find("tr").eq(cell.row)
                    .find("td").eq(cell.col);

            if (!keepCurrent) {
                $element.removeClass();
            }

            $element.addClass(clazz);
        }

        private _createGrid(id: string): JQuery {
            const $table: JQuery = $("<table/>");

            for (let rowIt: number = 0; rowIt < this.cRows; rowIt += 1) {
                const newRow: JQuery = this._createRow(id, rowIt);
                $table.append(newRow);
            }

            return $table;
        }

        private _createRow(gridId: string, rowIndex: number): JQuery {
            const $row: JQuery = $("<tr/>");

            for (let colIt: number = 0; colIt < this.cCols; colIt += 1) {
                const newCell: JQuery = grid.GridsEx._createCell(gridId, rowIndex, colIt);
                $row.append(newCell);
            }

            return $row;
        }

        private static _createCell(gridId: string, rowIndex: number, colIndex: number): JQuery {
            const unknown: string = strings._.cell.clazz.unknown;

            return $("<td/>", {
                ["class"]: unknown,
                ["data-grid-id"]: gridId,
                ["data-row-i"]: rowIndex,
                ["data-col-i"]: colIndex,
            });
        }
    }

    // ---------------------------------------------------------------------------------------------------------------

    export class SelectionEx implements Selection {

        private readonly _grids: Grids;

        public constructor(grids: grid.Grids) {
            this._grids = grids;
        }

        public activate(): void {
            let isMouseDown: boolean = false;
            let isHighlighted: boolean = false;

            const shootable: string = strings._.cell.clazz.shootable;
            const ship: string = strings._.cell.clazz.ship;
            const unknown: string = strings._.cell.clazz.unknown;

            this._grids.$shootCells
                .addClass(shootable)

                // tslint:disable:no-reserved-keywords // tslint-bug #261
                .mousedown(function (this: Element): boolean {
                    isMouseDown = true;
                    $(this).toggleClass(ship);
                    isHighlighted = $(this).hasClass(ship);
                    $(this).toggleClass(unknown, !isHighlighted);
                    return false;
                })

                // tslint:disable:no-reserved-keywords // tslint-bug #261
                .mouseover(function (this: Element): void {
                    if (isMouseDown) {
                        $(this).toggleClass(ship, isHighlighted);
                        $(this).toggleClass(unknown, !isHighlighted);
                    }
                })

                .on("selectstart", () => false);

            $(document)
                .mouseup(() => isMouseDown = false);
        }

        public deactivate(): void {
            const shootable: string = strings._.cell.clazz.shootable;

            this._grids.$shoot
                .find("td")
                .removeClass(shootable)
                .off("mousedown")
                .off("mouseover")
                .off("selectstart");

            $(document).off("mousedown");
        }

        public collect(): string {
            const ship: string = strings._.cell.clazz.ship;

            return this._grids.$shoot
                .find("tr").find("td")
                .map(function (this: Element): number {
                    return +($(this).hasClass(ship));
                })
                .get()
                .join(",");
        }

        public move(): void {
            const shoot: JQuery = this._grids.$shootCells;
            const opponent: JQuery = this._grids.$opponentCells;
            const unknown: string = strings._.cell.clazz.unknown;

            for (let i: number = 0; i < shoot.length; i += 1) {
                const shootClass: string = shoot.eq(i).attr("class");
                shoot.eq(i).attr("class", unknown);
                opponent.eq(i).attr("class", shootClass);
            }
        }
    }
}