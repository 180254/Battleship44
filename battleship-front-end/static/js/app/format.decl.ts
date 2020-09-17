declare global {
  interface String {
    // format string, usage: "hello {0}".format("world");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    format(...args: any[]): string;
  }
}
export {};
