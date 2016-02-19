// Type definitions for redux-immutable v3.0.3
// Project: https://github.com/gajus/redux-immutable
// Definitions by: Alexander Harm <https://github.com/alexanderharm/>

declare module 'redux-immutable' {

  interface ReduxReducersObject {
    [name: string]: Redux.Reducer;
  }

  export default function combineReducers(reducers: ReduxReducersObject): Redux.Middleware;
}
