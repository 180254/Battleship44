import {Callback} from './types.decl';
import {LangTag} from './i18n.decl';

export interface Ui {
  initFlags(callback: Callback<LangTag>): void;
}
