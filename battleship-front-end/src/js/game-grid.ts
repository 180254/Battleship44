import {Document2} from './document2';
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

  public static FromElement(cell: HTMLElement): Cell {
    return new Cell(
      Number.parseInt(cell.getAttribute('data-row-i')!),
      Number.parseInt(cell.getAttribute('data-col-i')!)
    );
  }

  public toString(): string {
    return 'Cell[{0},{1},{2}]'.format(this.row, this.col, this.clazz);
  }
}

export class Grids {
  public readonly rows = 10;
  public readonly cols = 10;

  public readonly shoot: HTMLElement;
  public readonly shootCells: NodeListOf<HTMLElement>;

  public readonly opponent: HTMLElement;
  public readonly opponentCells: NodeListOf<HTMLElement>;

  public constructor() {
    this.shoot = document.getElementById(htmlStrings.grid.id.shoot)!;
    this.shootCells = document.querySelectorAll(htmlStrings.cell.selector.shoot);
    this.opponent = document.getElementById(htmlStrings.grid.id.opponent)!;
    this.opponentCells = document.querySelectorAll(htmlStrings.cell.selector.opponent);
  }

  public reset(): void {
    this.shootCells.forEach(element => {
      element.setAttribute('class', htmlStrings.cell.clazz.unknown);
    });

    this.opponentCells.forEach(element => {
      element.setAttribute('class', htmlStrings.cell.clazz.unknown);
    });
  }

  public putFleet(fleet: number[]): void {
    const codeToClazz: {[key: number]: string} = {
      0: htmlStrings.cell.clazz.unknown,
      1: htmlStrings.cell.clazz.ship,
    };
    fleet
      .map(code => codeToClazz[code])
      .forEach((clazz, index) => {
        this.shootCells.item(index).setAttribute('class', clazz);
      });
  }

  public setCellClass(
    gridCells: NodeListOf<HTMLElement>,
    cell: Cell,
    clazz: string | undefined,
    keepCurrent: boolean
  ): void {
    const element = gridCells.item(cell.row * this.cols + cell.col);

    if (!keepCurrent) {
      element.removeAttribute('class');
    }

    if (clazz !== undefined) {
      element.classList.add(clazz);
    }
  }
}

export class GridSelection {
  private readonly grids: Grids;
  private readonly document2: Document2;

  public constructor(grids: Grids, document2: Document2) {
    this.grids = grids;
    this.document2 = document2;
  }

  public activate(): void {
    let isMouseDown = false;
    let isHighlighted = false;

    this.grids.shootCells.forEach(element => {
      element.classList.add(htmlStrings.cell.clazz.shootable);

      this.document2.addEventListener(element, 'mousedown', event => {
        isMouseDown = true;
        isHighlighted = element.classList.toggle(htmlStrings.cell.clazz.ship);
        element.classList.toggle(htmlStrings.cell.clazz.unknown, !isHighlighted);
        event.preventDefault();
      });

      this.document2.addEventListener(element, 'mouseover', event => {
        if (isMouseDown) {
          element.classList.toggle(htmlStrings.cell.clazz.ship, isHighlighted);
          element.classList.toggle(htmlStrings.cell.clazz.unknown, !isHighlighted);
        }
        event.preventDefault();
      });

      this.document2.addEventListener(element, 'selectstart', event => {
        event.preventDefault();
      });
    });

    this.document2.addEventListener(document.body, 'mouseup', event => {
      isMouseDown = false;
      event.preventDefault();
    });
  }

  public deactivate(): void {
    this.grids.shootCells.forEach(element => {
      element.classList.remove(htmlStrings.cell.clazz.shootable);
      this.document2.removeEventListeners(element, 'mousedown');
      this.document2.removeEventListeners(element, 'mouseover');
      this.document2.removeEventListeners(element, 'selectstart');
    });

    this.document2.removeEventListeners(document.body, 'mouseup');
  }

  public collect(): string {
    return Array.from(this.grids.shootCells)
      .map(element => {
        return +element.classList.contains(htmlStrings.cell.clazz.ship);
      })
      .join(',');
  }

  public moveToLeft(): void {
    const shoot = this.grids.shootCells;
    const opponent = this.grids.opponentCells;

    for (let i = 0; i < shoot.length; i += 1) {
      const shootClass: string = shoot.item(i).getAttribute('class')!;
      shoot.item(i).setAttribute('class', htmlStrings.cell.clazz.unknown);
      opponent.item(i).setAttribute('class', shootClass);
    }
  }
}
