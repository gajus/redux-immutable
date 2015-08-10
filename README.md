# `redux-immutable`

[![Travis build status](http://img.shields.io/travis/gajus/redux-immutable/master.svg?style=flat-square)](https://travis-ci.org/gajus/redux-immutable)
[![NPM version](http://img.shields.io/npm/v/redux-immutable.svg?style=flat-square)](https://www.npmjs.org/package/redux-immutable)

This package provides a single function `combineReducers`, which implements:

* Immutable state.
* [Canonical Reducer Composition](https://github.com/gajus/canonical-reducer-composition).

## Initial State

You must provide Redux `createStore` with the initial state using Immutable data.

```js
import {
    createStore
} from 'redux';

import {
    combineReducers
} from 'redux-immutable';

import Immutable from 'immutable';

import * as reducers from './reducers';

let app,
    store,
    state;

state = {};

state.countries = [
    'IT',
    'JP',
    'DE'
];

state = Immutable.fromJS(state);

app = combineReducers(reducers);
store = createStore(app, state);

export default store;
```

## Unpacking Immutable State

`redux-immutable` `combineReducers` turns state into Immutable data. Therefore, when you request the store state you will get an instance of `Immutable.Iterable`:

```js
let state;

state = store.getState();

console.log(Immutable.Iterable.isIterable(state));
// true
```

You can convert the entire state to a raw JavaScript object using Immutable.js [`toJS()`](https://facebook.github.io/immutable-js/docs/#/Iterable/toJS) function:

```js
state = store.getState().toJS();
```

The disadvantage of this method is that it will create a new JavaScript object every time it is called:

```js
console.log(state.toJS() === state.toJS());
// false
```

Because shallow comparison says that new state is different from the previous state you cannot take advantage of [PureRenderMixin](https://facebook.github.io/react/docs/pure-render-mixin.html) or an equivalent logic that manages [`shouldComponentUpdate`](https://facebook.github.io/react/docs/component-specs.html#updating-shouldcomponentupdate) using shallow object comparison.

For the above reason, you should refrain from converting state or parts of the state to raw JavaScript object.

## Importing

The files in `./src/` are written using ES6 features. Therefore, you need to use a source-to-source compiler to load the module. If you are using webpack to build your project and Babel, make a separate test to compile `redux-immutable` source, e.g.

```js
let webpack = require('webpack');

module.exports = {
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: [
                    /node_modules\/redux\-immutable/
                ],
                loader: 'babel'
            },
            {
                test: /\.js$/,
                exclude: [
                    /node_modules/
                ],
                loader: 'babel'
            }
        ]
    }
};
```

## Example

### `store.js`

```js
import {
    createStore
} from 'redux';

import {
    combineReducers
} from 'redux-immutable';

import Immutable from 'immutable';

import * as reducers from './reducers';

let app,
    store,
    state;

state = {};

state.countries = [
    'IT',
    'JP',
    'DE'
];

state.cities = [
    'Rome',
    'Tokyo',
    'Berlin'
];

state.user = {
    names: [
        'Gajus',
        'Kuizinas'
    ]
};

state = Immutable.fromJS(state);

app = combineReducers(reducers);
store = createStore(app, state);

export default store;
```

### `reducers.js`

```js
/**
 * @param {Immutable} state
 * @param {Object} action
 * @param {String} action.type
 * @param {Number} action.id
 */
export default {
    // Implementing country domain reducers using arrow function syntax.
    countries: {
        ADD_COUNTRY: (domain, action) => domain.push(action.country),
        REMOVE_COUNTRY: (domain, action) => domain.delete(domain.indexOf(action.country))
    },
    // Implementing city domain reducers using object method syntax.
    cities: {
        ADD_CITY (domain, action) {
            return domain.push(action.city);
        }
        REMOVE_CITY (domain, action) {
            return domain.delete(domain.indexOf(action.city));
        }
    },
    // Implement a sub-domain reducer map.
    user: {
        names: {
            ADD_NAME (domain, action) {
                return domain.push(action.name);
            }
            REMOVE_NAME (domain, action) {
                return domain.delete(domain.indexOf(action.name));
            }
        }
    }
};
```
