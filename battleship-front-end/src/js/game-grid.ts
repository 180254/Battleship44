import * as $ from 'jquery';
import {htmlStrings} from './html-strings';

export class Cell {
  public readonly row: number;
  public readonly col: number;
  public readonly clazz?: string;

  public constructor(row: number, col: number, clazz?: string) {
    this.row = row;
    this.col = col;
    this.clazz = clazz;
  }

  public static FromElement($cell: JQuery<Element>): Cell {
    return new Cell(
      Number.parseInt($cell.attr('data-row-i')!),
      Number.parseInt($cell.attr('data-col-i')!)
    );
  }

  public toString(): string {
    return 'Cell[{0},{1},{2}]'.format(this.row, this.col, this.clazz);
  }
}

export class Grids {
  public readonly rows = 10;
  public readonly cols = 10;

  public readonly $shoot: JQuery = $(htmlStrings.grid.id_shoot);
  public $shootCells!: JQuery;

  public readonly $opponent: JQuery = $(htmlStrings.grid.id_opponent);
  public $opponentCells!: JQuery;

  private static createCell(gridId: string, rowIndex: number, colIndex: number): JQuery {
    return $('<td/>', {
      ['class']: htmlStrings.cell.clazz.unknown,
      ['data-grid-id']: gridId,
      ['data-row-i']: rowIndex,
      ['data-col-i']: colIndex,
    });
  }

  public init(): void {
    this.createGrid(this.$shoot.attr('id')!).appendTo(this.$shoot);
    this.createGrid(this.$opponent.attr('id')!).appendTo(this.$opponent);

    this.$shootCells = this.$shoot.find('td');
    this.$opponentCells = this.$opponent.find('td');
  }

  public reset(): void {
    this.$shootCells.attr('class', htmlStrings.cell.clazz.unknown);
    this.$opponentCells.attr('class', htmlStrings.cell.clazz.unknown);
  }

  public putFleet(fleet: number[]): void {
    const codeToClazz: {[key: number]: string} = {
      0: htmlStrings.cell.clazz.unknown,
      1: htmlStrings.cell.clazz.ship,
    };
    fleet
      .map(code => codeToClazz[code])
      .forEach((clazz, index) => {
        this.$shootCells.get(index).setAttribute('class', clazz);
      });
  }

  public setCellClass($grid: JQuery, cell: Cell, clazz: string, keepCurrent: boolean): void {
    const $element: JQuery = $grid.find('tr').eq(cell.row).find('td').eq(cell.col);

    if (!keepCurrent) {
      $element.removeClass();
    }

    $element.addClass(clazz);
  }

  private createGrid(id: string): JQuery {
    const $table: JQuery = $('<table/>');

    for (let rowIt = 0; rowIt < this.rows; rowIt += 1) {
      const newRow: JQuery = this.createRow(id, rowIt);
      $table.append(newRow);
    }

    return $table;
  }

  private createRow(gridId: string, rowIndex: number): JQuery {
    const $row: JQuery = $('<tr/>');

    for (let colIt = 0; colIt < this.cols; colIt += 1) {
      const newCell: JQuery = Grids.createCell(gridId, rowIndex, colIt);
      $row.append(newCell);
    }

    return $row;
  }
}

export class GridSelection {
  private readonly grids: Grids;

  public constructor(grids: Grids) {
    this.grids = grids;
  }

  public activate(): void {
    let isMouseDown = false;
    let isHighlighted = false;

    this.grids.$shootCells
      .addClass(htmlStrings.cell.clazz.shootable)

      .on('mousedown', function (this: Element): boolean {
        isMouseDown = true;
        $(this).toggleClass(htmlStrings.cell.clazz.ship);
        isHighlighted = $(this).hasClass(htmlStrings.cell.clazz.ship);
        $(this).toggleClass(htmlStrings.cell.clazz.unknown, !isHighlighted);
        return false;
      })

      .on('mouseover', function (this: Element): void {
        if (isMouseDown) {
          $(this).toggleClass(htmlStrings.cell.clazz.ship, isHighlighted);
          $(this).toggleClass(htmlStrings.cell.clazz.unknown, !isHighlighted);
        }
      })

      .on('selectstart', () => false);

    $(document).on('mouseup', () => (isMouseDown = false));
  }

  public deactivate(): void {
    this.grids.$shoot
      .find('td')
      .removeClass(htmlStrings.cell.clazz.shootable)
      .off('mousedown')
      .off('mouseover')
      .off('selectstart');

    $(document).off('mousedown');
  }

  public collect(): string {
    return this.grids.$shoot
      .find('tr')
      .find('td')
      .map(function (this: Element): number {
        return +$(this).hasClass(htmlStrings.cell.clazz.ship);
      })
      .get()
      .join(',');
  }

  public moveToLeft(): void {
    const shoot: JQuery = this.grids.$shootCells;
    const opponent: JQuery = this.grids.$opponentCells;

    for (let i = 0; i < shoot.length; i += 1) {
      const shootClass: string = shoot.eq(i).attr('class')!;
      shoot.eq(i).attr('class', htmlStrings.cell.clazz.unknown);
      opponent.eq(i).attr('class', shootClass);
    }
  }
}
