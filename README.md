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

`react-router-redux` [`routeReducer`](https://github.com/reactjs/react-router-redux/tree/v4.0.2#routerreducer) does not work with Immutable.js. You need to use a custom reducer:

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

Pass a selector to access the payload state and convert it to a JavaScript object via the [`selectLocationState` option on `syncHistoryWithStore`](https://github.com/reactjs/react-router-redux/tree/v4.0.2#history--synchistorywithstorehistory-store-options):

```js
import {
    browserHistory
} from 'react-router';
import {
    syncHistoryWithStore
} from 'react-router-redux';

const history = syncHistoryWithStore(browserHistory, store, {
    selectLocationState (state) {
        return state.get('routing').toJS();
    }
});
```

The `'routing'` path depends on the `rootReducer` definition. This example assumes that `routeReducer` is made available under `routing` property of the `rootReducer`.

### Bootstrap redux store with data
It is recommended to use [`transit-immutable-js`](https://www.npmjs.com/package/transit-immutable-js) to serialize/deserialize the state when populating the store with initial data to retain Immutable types of nested Objects/Maps.

Otherwise the immutable types will be lost when converting with `Immutable.fromJS`.

#### Example when it will be a problem
```js
// todosReducer.js
import Immutable from 'immutable';

const initialState = Immutable.Map({
    uniqueTodos: Immutable.Set([ 'task one', 'task two' ])
});

export default (state = initialState, action) => {
    if (action.type === 'MY_ACTION') {
        // Do calculations and return state
        return state;
    }

    return state;
};


```

Then you decide to save the current state to lets say local storage:
```js
// saveState.js
import { saveToLocalStorage } from './myUtils';
import store from './myCreatedStore';

const storeSaveObj = store.getState().toJS();
saveToLocalStorage(JSON.stringify(storeSaveObj));
```

Then attempt to restore the state

```js
// createStoreFromLocalStorage.js
import Immutable from 'immutable';
import { getStateFromLocalStorage } from './myUtils';
import { combineReducers } from 'redux-immutable';
import rootReducer from './myRootReducer';
import { createStore } from 'redux';

const initialState = Immutable.fromJS(getStateFromLocalStorage());
const store = createStore(rootReducer, initialState);

```

But using `Immutable.fromJS` will convert all arrays to `Immutable.List`, all objects to `Immutable.Map` by default. And your reducers might not even use that, and thus will fail.

`todosReducer` fail when populating initial data
```js
import store from './myCreatedStore';
import Immutable from 'immutable';

const uniqueTodos = store.getState().getIn([ 'todosReducer', 'uniqueTodos' ]);
Immutable.List.isList(uniqueTodos);
true
Immutable.Set.isSet(uniqueTodos);
false

```
