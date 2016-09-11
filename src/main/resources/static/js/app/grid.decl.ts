namespace grid {

    export interface Coord {
        readonly row: number;
        readonly col: number;
    }

    export interface Grids {
        readonly shoot: JQuery;
        readonly opponent: JQuery;

        init(callback: () => void): void;

        setClass(grid: JQuery, coord: Coord, clazz: string, keepCurrent: boolean): void;

        reset(): void;
    }

    export interface Selection {

        activate(): void;

        deactivate(): void;

        collect(): string;

        move(): void;
    }
}
