declare global {
  // noinspection JSUnusedGlobalSymbols // bug? it is used
  interface Window {
    BACKEND: string;
    MODE: 'dev' | 'string';
  }
}
export {};
