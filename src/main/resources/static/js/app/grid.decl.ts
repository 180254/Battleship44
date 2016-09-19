declare namespace grid {

    interface Cell {

        readonly row: number;
        readonly col: number;
        readonly clazz?: string;
    }

    // ---------------------------------------------------------------------------------------------------------------

    interface Grids {
        readonly $shoot: JQuery;
        readonly $opponent: JQuery;

        init(): void;
        reset(): void;

        setClass($grid: JQuery, cell: Cell, clazz: string, keepCurrent: boolean): void;
    }

    // ---------------------------------------------------------------------------------------------------------------

    interface Selection {

        activate(): void;
        deactivate(): void;
        collect(): string;
        move(): void;
    }
}
