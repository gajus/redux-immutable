// Type definitions for redux-immutable 3.0.2
// Project: https://github.com/gajus/redux-immutable
// Created by : https://github.com/dlebedynskyi/redux-immutable
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/// <reference path="../redux/redux.d.ts" />
declare module "redux-immutable" {
  import {Reducer} from 'redux';

   export function combineReducers(reducers: any): Reducer;
}
