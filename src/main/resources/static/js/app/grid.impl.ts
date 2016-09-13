/// <reference path="grid.decl.ts" />

namespace grid {
    "use strict";

    class Conf {
        public rows: number = 10;
        public cols: number = 10;
    }

    export const conf: Conf = new Conf();

    // ---------------------------------------------------------------------------------------------------------------

    export class CellEx implements Cell {

        private readonly _row: number;
        private readonly _col: number;
        private readonly _clazz?: string;

        public constructor(row: number, col: number, clazz?: string) {
            this._row = row;
            this._col = col;
            this._clazz = clazz;
        }

        public get row(): number {
            return this._row;
        }

        public get col(): number {
            return this._col;
        }

        public get clazz(): string | undefined {
            return this._clazz;
        }

        public toString(): string {
            return "CoordEx[row={0} col={1}]".format(this._row, this._col);
        }
    }

    export class GridsEx implements Grids {

        private _$shoot: JQuery;
        private _$opponent: JQuery;

        public get $shoot(): JQuery {
            return this._$shoot;
        }

        public get $opponent(): JQuery {
            return this._$opponent;
        }

        public init(): void {
            this._$shoot = this.createGrid("grid-shoot").appendTo("#grid-shoot");
            this._$opponent = this.createGrid("grid-opponent").appendTo("#grid-opponent");
        }

        public reset(): void {
            this.$shoot.find("td").attr("class", "unknown");
            this.$opponent.find("td").attr("class", "unknown");
        }

        public setClass($grid: JQuery, cell: Cell, clazz: string, keepCurrent: boolean): void {
            const $element: JQuery =
                $grid
                    .find("tr").eq(cell.row)
                    .find("td").eq(cell.col);

            if (!keepCurrent) {
                $element.removeClass();
            }

            $element.addClass(clazz);
        }

        private createGrid(id: string): JQuery {
            const $table: JQuery = $("<table/>");

            for (let rowIt: number = 0; rowIt < conf.rows; rowIt += 1) {
                const newRow: JQuery = this.createRow(id, rowIt);
                $table.append(newRow);
            }

            return $table;
        }

        private createRow(gridId: string, rowIndex: number): JQuery {
            const $row: JQuery = $("<tr/>");

            for (let colIt: number = 0; colIt < conf.cols; colIt += 1) {
                const newCell: JQuery = this.createCell(gridId, rowIndex, colIt);
                $row.append(newCell);
            }

            return $row;
        }

        // tslint:disable:object-literal-key-quotes
        private createCell(gridId: string, rowIndex: number, colIndex: number): JQuery {
            return $("<td/>", {
                "class": "unknown",
                "data-grid-id": gridId,
                "data-row-i": rowIndex,
                "data-col-i": colIndex,
            });
        }
    }

    export class SelectionEx implements Selection {

        private readonly _grids: Grids;

        public constructor(grids: grid.Grids) {
            this._grids = grids;
        }

        public activate(): void {
            let isMouseDown: boolean = false;
            let isHighlighted: boolean = false;

            this._grids.$shoot.find("td")
                .addClass("shoot-able")
                .mousedown(function (): boolean {
                    isMouseDown = true;
                    $(this).toggleClass("ship");
                    isHighlighted = $(this).hasClass("ship");
                    $(this).toggleClass("unknown", !isHighlighted);
                    return false;
                })

                .mouseover(function (): void {
                    if (isMouseDown) {
                        $(this).toggleClass("ship", isHighlighted);
                        $(this).toggleClass("unknown", !isHighlighted);
                    }
                })

                .on("selectstart", () => false);

            $(document)
                .mouseup(() => isMouseDown = false);
        }

        public deactivate(): void {
            this._grids.$shoot.find("td")
                .removeClass("shoot-able")
                .off("mousedown")
                .off("mouseover")
                .off("selectstart");
            $(document).off("mousedown");
        }

        public collect(): string {
            return this._grids.$shoot.find("tr").find("td")
                .map(function (): number {
                    return +$(this).hasClass("ship");
                })
                .get()
                .join(",");
        }

        public move(): void {
            const shoot: JQuery = this._grids.$shoot.find("td");
            const opponent: JQuery = this._grids.$opponent.find("td");

            for (let i: number = 0; i < shoot.length; i += 1) {
                const shootClass: string = shoot.eq(i).attr("class");
                shoot.eq(i).attr("class", "unknown");
                opponent.eq(i).attr("class", shootClass);
            }
        }
    }

    // --------------------------------------------------------------------------------------------------------------

    class Singleton {
        public grids: Grids = new GridsEx();
        public selection: Selection = new SelectionEx(this.grids);
    }

    export const i: Singleton = new Singleton();
}
