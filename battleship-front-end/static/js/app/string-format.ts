declare global {
  interface String {
    // format string, usage: "hello {0}".format("world");
    format(...args: unknown[]): string;
  }
}

// credits: friends @ stackoverflow
// url: http://stackoverflow.com/a/20070599
// license: cc by-sa 3.0
// license url: https://creativecommons.org/licenses/by-sa/3.0/
String.prototype.format = function (this: string, ...args: unknown[]): string {
  return this.replace(/{(\d+)}/g, (match: string, index: number) =>
    index < args.length ? String(args[index]) : match
  );
};

export {};
