import {TrKey} from './i18n.decl';

export interface Timeout {
  readonly fast: number;
  readonly default_: number;
  readonly slow: number;
}

// ---------------------------------------------------------------------------------------------------------------

export interface Message {
  setFixed(trKey: TrKey, clazz?: string): void;

  addFleeting(trKey: TrKey, timeout: number, clazz?: string): void;

  addFixedLink(trKey: TrKey, id: string, clazz?: string): void;
}
