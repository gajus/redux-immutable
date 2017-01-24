export interface Action {
  type: any;
}

export type Reducer<S> = <A extends Action>(state: S, action: A) => S;

export interface ReducersMapObject {
  [key: string]: Reducer<any>;
}

export declare function combineReducers<S>(reducers: ReducersMapObject): Reducer<S>;