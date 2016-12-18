/// <reference types="jquery" />

declare namespace grid {

    interface Cell {

        readonly row: number;
        readonly col: number;
        readonly clazz?: string;
    }

    // ---------------------------------------------------------------------------------------------------------------

    interface Grids {
        readonly $shoot: JQuery;
        readonly $shootCells: JQuery;

        readonly $opponent: JQuery;
        readonly $opponentCells: JQuery;

        init(): void;
        reset(): void;

        setCellClass($grid: JQuery, cell: Cell, clazz: string, keepCurrent: boolean): void;
    }

    // ---------------------------------------------------------------------------------------------------------------

    interface Selection {

        activate(): void;
        deactivate(): void;
        collect(): string;
        move(): void;
    }
}
