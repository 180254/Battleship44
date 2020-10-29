export class Css {
  private readonly cssTransitionDurationMs = 300;

  public fadeOut(element: HTMLElement, hideAfterMs: number): void {
    element.classList.add('fadeout');
    setTimeout(() => {
      element.classList.add('fadeout-hide');
      setTimeout(() => {
        element.remove();
      }, this.cssTransitionDurationMs);
    }, hideAfterMs);
  }
}
