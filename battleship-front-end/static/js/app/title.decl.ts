import {TrKey} from './i18n.decl';

export interface Title {
  setFixed(trKey: TrKey): void;

  setBlinking(trKey: TrKey, override: boolean): void;
}
