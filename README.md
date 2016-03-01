# `redux-immutable`

[![Travis build status](http://img.shields.io/travis/gajus/redux-immutable/master.svg?style=flat-square)](https://travis-ci.org/gajus/redux-immutable)
[![NPM version](http://img.shields.io/npm/v/redux-immutable.svg?style=flat-square)](https://www.npmjs.org/package/redux-immutable)
[![Canonical Code Style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)

`redux-immutable` is used to create an equivalent function of Redux [`combineReducers`](http://rackt.org/redux/docs/api/combineReducers.html) that works with [Immutable.js](https://facebook.github.io/immutable-js/) state.

When Redux [`createStore`](https://github.com/rackt/redux/blob/master/docs/api/createStore.md) `reducer` is created using `redux-immutable` then `initialState` must be an instance of [`Immutable.Iterable`](https://facebook.github.io/immutable-js/docs/#/Iterable).

## Problem

When [`createStore`](https://github.com/rackt/redux/blob/master/docs/api/createStore.md) is invoked with `initialState` that is an instance of `Immutable.Iterable` further invocation of reducer will [produce an error](https://github.com/rackt/redux/blob/v3.0.6/src/combineReducers.js#L31-L38):

> The initialState argument passed to createStore has unexpected type of "Object".
> Expected argument to be an object with the following keys: "data"

This is because Redux `combineReducers` [treats `state` object as a plain JavaScript object](https://github.com/rackt/redux/blob/v3.0.6/src/combineReducers.js#L120-L129).

`combineReducers` created using `redux-immutable` uses Immutable.js API to iterate the state.

## Usage

Create a store with `initialState` set to an instance of [`Immutable.Iterable`](https://facebook.github.io/immutable-js/docs/#/Iterable):

```js
import {
    combineReducers
} from 'redux-immutable';

import {
    createStore
} from 'redux';

const initialState = Immutable.Map();
const rootReducer = combineReducers({});
const store = createStore(rootReducer, initialState);
```

### Using with `react-router-redux`

`react-router-redux` [`routeReducer`](https://github.com/rackt/react-router-redux/tree/2.1.0#routereducer) does not work with Immutable.js. You need to use a custom reducer:

```js
import Immutable from 'immutable';
import {
    LOCATION_CHANGE
} from 'react-router-redux';

const initialState = Immutable.fromJS({
    locationBeforeTransitions: null
});

export default (state = initialState, action) => {
    if (action.type === LOCATION_CHANGE) {
        return state.merge({
            locationBeforeTransitions: action.payload
        });
    }

    return state;
};
```

If you are using [`ReduxMiddleware.listenForReplays`](https://github.com/rackt/react-router-redux/tree/2.1.0#reduxmiddlewarelistenforreplaysstore-reduxstore-selectlocationstate-function), then you need to define a custom `selectLocationState` function:

```js
reduxRouterMiddleware.listenForReplays(store, (state) => {
    return state.getIn([
        'route',
        'locationBeforeTransitions'
    ]).toJS();
});
```

The `['route', 'location']` path depends on the `rootReducer` definition. This example assumes that `routeReducer` is made available under `route` property of the `rootReducer`.
