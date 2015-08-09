# `redux-immutable`

[![Travis build status](http://img.shields.io/travis/gajus/redux-immutable/master.svg?style=flat-square)](https://travis-ci.org/gajus/redux-immutable)
[![NPM version](http://img.shields.io/npm/v/redux-immutable.svg?style=flat-square)](https://www.npmjs.org/package/redux-immutable)

This package provides a single function `combineReducers`. `combineReducers` is equivalent to the redux [`combineReducers`](http://gaearon.github.io/redux/docs/api/combineReducers.html) function, except that it expects state to be an [Immutable.js](https://facebook.github.io/immutable-js/) object.

When using `redux-immutable` together with [react-redux](https://www.npmjs.com/package/react-redux) use `mapStateToProps` callback of the `connect` method to transform `Immutable` object to a regular JavaScript object before passing it to the selectors, e.g.

```js
import React from 'react';

import {
    connect
} from 'react-redux';

/**
 * @param {Immutable}
 * @return {Object} state
 * @return {Object} state.ui
 * @return {Array} state.locations
 */
let selector = (state) => {
    state = state.toJS();

    // Selector logic ...

    return state;
};

class App extends React.Component {
    render () {
        return <div></div>;
    }
}

export default connect(selector)(App);
```

## Reducer Declaration Syntax

Redux utilizes the concept of [reducer composition](http://gaearon.github.io/redux/docs/basics/Reducers.html#splitting-reducers).

```js
let reducer = (state = {}, action) => ({
    // <domain>: <domainReducer> (<domain data>, <action>)
    countries: countryReducer(state.countries, action),
    cities: cityReducer(state.cities, action)
});
```

The benefit of this pattern is that domain reducers do not need to know the complete state; domain reducers receive only part of the state for their domain. This enables better code separation.

Redux [`combineReducers`](http://gaearon.github.io/redux/docs/api/combineReducers.html) is a helper that turns an object whose values are different reducing functions into a single reducing function.

```js
let reducer = combineReducers({
    countries: countryReducer,
    cities: cityReducer
});
```

However, Redux `combineReducers` does not dictate what should be the implementation of the domain reducer. Regardless of what is the implementation of the domain reducer, it does the same thing: listens to actions and when it recognizes an action, it create a new state, e.g.

```js
export function countries (state = [], action) {
    switch (action.type) {
        case 'ADD_COUNTRY':
            // state =
            return state;

        case 'REMOVE_COUNTRY':
            // state =
            return state;

        default:
            return state;
    }
}
```

There are several problems with this:

* This makes the code base less standardized (across different projects and different developers).
* Domain reducer function is called regardless of whether it can handle the action.
* The overhead of maintaining the boilerplate.

To address these issues, `redux-immutable` `combineReducers` requires that:

1. Reducers definition object registers domains (like Redux)
1. Domain definition object registers actions

```js
{
    <domain>: {
        <action> (domain, action) {

        }
    }
}
```


### Example

```
let state,
    reducer;

state = {
    // <domain>
    countries: [
        'IT',
        'JP',
        'DE'
    ],
    // <domain>
    cities: [
        'Rome',
        'Tokyo',
        'Berlin'
    ]
}
```

```js
reducers = {
    // Implementing country domain reducers using arrow functions.
    countries: {
        ADD_COUNTRY: (domain, action) => domain.push(action.country),
        REMOVE_COUNTRY: (domain, action) => domain.delete(domain.indexOf(action.country))
    },
    //
    cities: {
        ADD_CITU (domain, action) {
            return domain.push(action.country);
        }
        REMOVE_CITY (domain, action) {
            return domain.delete(domain.indexOf(action.country));
        }
    }
};
```

## Using with [webpack](https://github.com/webpack/webpack) and [Babel](https://github.com/babel/babel)

The files in `./src/` are written using ES6 features. Therefore, you need to use a source-to-source compiler when loading the files. If you are using webpack to build your project and Babel, make an exception for the `redux-immutable` source, e.g.

```js
var webpack = require('webpack');

module.exports = {
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: [
                    /node_modules(?!\/redux\-immutable)/
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

import * as reducers from './reducers';

import Immutable from 'immutable';

let app,
    store,
    state = {};

state.ui = {
    activeLocationId: 1
};

state.locations = [
    {
        id: 1,
        name: 'Foo',
        address: 'Foo st.',
        country: 'uk'
    },
    {
        id: 2,
        name: 'Bar',
        address: 'Bar st.',
        country: 'uk'
    }
];

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
export let ui = (state, action) => {
    switch (action.type) {
        case 'ACTIVATE_LOCATION':
            state = state.set('activeLocationId', action.id);
            break;
    }

    return state;
};

/**
 * @param {Immutable} state
 * @param {Object} action
 * @param {String} action.type
 * @param {Number} action.id
 */
export let locations = (state, action) => {
    switch (action.type) {
        // @param {String} action.name
        case 'CHANGE_NAME_LOCATION':
            let locationIndex;

            locationIndex = state.findIndex(function (location) {
                return location.get('id') === action.id;
            });

            state = state.update(locationIndex, function (location) {
                return location.set('name', action.name);
            });
            break;
    }

    return state;
};
```

### `app.js`

```js
import React from 'react';

import {
    connect
} from 'react-redux';

/**
 * @param {Immutable}
 * @return {Object} state
 * @return {Object} state.ui
 * @return {Array} state.locations
 */
let selector = (state) => {
    state = state.toJS();

    // Selector logic ...

    return state;
};

class App extends React.Component {
    render () {
        return <div></div>;
    }
}

export default connect(selector)(App);
```
