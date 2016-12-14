// Type definitions for redux-immutable v3.0.3
// Project: https://github.com/gajus/redux-immutable
// Definitions by: Alexander Harm <https://github.com/alexanderharm/>

declare module 'redux-immutable' {

  interface ReduxReducersMap {
    [name: string]: Redux.Reducer;
  }

  export function combineReducers(reducers: ReduxReducersMap): Redux.Middleware;
}
