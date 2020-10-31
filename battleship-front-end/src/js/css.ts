import {htmlStrings} from './html-strings';

export class Css {
  private readonly cssTransitionDurationMs = 300;

  public fadeOut(element: HTMLElement, hideAfterMs: number): void {
    element.classList.add(htmlStrings.css.clazz.fadeOut);
    setTimeout(() => {
      element.classList.add(htmlStrings.css.clazz.fadeOutHide);
      setTimeout(() => {
        element.remove();
      }, this.cssTransitionDurationMs);
    }, hideAfterMs);
  }
}
