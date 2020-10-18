declare global {
  const WEBPACK_DEFINE_MODE: string;
  const WEBPACK_DEFINE_BACKEND: string;
}

export class Environment {
  public static MODE = WEBPACK_DEFINE_MODE;
  public static BACKEND = WEBPACK_DEFINE_BACKEND;
  public static ServerLanguages: string[] = ['pl-pl', 'en-us'];
}
