import './format.decl';

// credits: friends @ stackoverflow
// url: http://stackoverflow.com/a/20070599
// license: cc by-sa 3.0
// license url: https://creativecommons.org/licenses/by-sa/3.0/
// eslint-disable-next-line @typescript-eslint/no-explicit-any
String.prototype.format = function (this: string, ...args: any[]): string {
  return this.replace(/{(\d+)}/g, (match: string, index: number) =>
    index < args.length ? args[index] : match
  );
};
