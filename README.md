# `redux-immutable`

[![Travis build status](http://img.shields.io/travis/gajus/redux-immutable/master.svg?style=flat-square)](https://travis-ci.org/gajus/redux-immutable)
[![NPM version](http://img.shields.io/npm/v/redux-immutable.svg?style=flat-square)](https://www.npmjs.org/package/redux-immutable)
[![Canonical Code Style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)

This package provides a single function `createCombineReducers` used to create an equivalent function of Redux [`combineReducers`](http://rackt.org/redux/docs/api/combineReducers.html) that accepts an instance of [Immutable.js](https://facebook.github.io/immutable-js/) [`Immutable.Iterable`](https://facebook.github.io/immutable-js/docs/#/Iterable) to manage Immutable state.

When Redux [`createStore`](https://github.com/rackt/redux/blob/master/docs/api/createStore.md) `reducer` is created using `redux-immutable` then `initialState` must be an instance of `Immutable.Iterable`.

## API

```js
/**
 * @typedef {Object}
 * @property {boolean} debug Validates each reducer invocation and uses console.error to report unexpected state, reducer or action definition.
 */

/**
 * @type Function
 * @param {UserOptionsType} userOptions
 * @returns {Function} Returns function equivalent to Redux combineReducers that accepts an instance of Immutable.js Immutable.Iterable to manage Immutable state.
 */
createCombineReducers;
```

## Usage

Use `createCombineReducers` to create `combineReducers` function:

```js
import {
    createCombineReducers
} from 'redux-immutable';

let combineReducers,
    rootReducer;

combineReducers = createCombineReducers({
    debug: process.env.NODE_ENV !== 'production'
});

// @see http://rackt.org/redux/docs/api/combineReducers.html
combineReducers;
```
