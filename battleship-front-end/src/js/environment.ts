declare global {
  let WEBPACK_DEFINE_MODE: string;
  let WEBPACK_DEFINE_BACKEND: string;
}

export class Environment {
  public static MODE: string = WEBPACK_DEFINE_MODE;
  public static BACKEND: string = WEBPACK_DEFINE_BACKEND;
  public static ServerLanguages: string[] = ['en-us', 'pl-pl'];
}
