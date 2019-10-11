import { ReducersMapObject, Reducer, Action } from 'redux';
import { Map } from 'immutable';

interface RootState<TProps> {
  get<K extends keyof TProps>(key: K): any;

  set<K extends keyof TProps>(key: K, value: TProps[K]): this;

  withMutations(mutator: (mutable: this) => any): this;
}

export function combineReducers<S, A extends Action, T extends RootState<S> = Map<keyof S, any>>(
  reducers: ReducersMapObject<S, A>,
  getDefaultState?: () => T
): Reducer<T, A>;

export function combineReducers<S, T extends RootState<S> = Map<keyof S, any>>(
  reducers: ReducersMapObject<S, any>,
  getDefaultState?: () => T
): Reducer<T>;
