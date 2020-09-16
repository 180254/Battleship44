declare global {
  interface String {
    // format string, usage: "hello {0}".format("world");
    format(...args: any[]): string;
  }
}
export {};
