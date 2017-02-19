/**
 * Typings from the official redux repository.
 * Source: https://github.com/reactjs/redux/blob/master/index.d.ts
 */

export interface Action {
  type: any;
}

export type Reducer<S> = <A extends Action>(state: S, action: A) => S;

export interface ReducersMapObject {
  [key: string]: Reducer<any>;
}

export declare function combineReducers<S>(reducers: ReducersMapObject): Reducer<S>;