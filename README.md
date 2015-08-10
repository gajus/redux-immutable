# `redux-immutable`

[![Travis build status](http://img.shields.io/travis/gajus/redux-immutable/master.svg?style=flat-square)](https://travis-ci.org/gajus/redux-immutable)
[![NPM version](http://img.shields.io/npm/v/redux-immutable.svg?style=flat-square)](https://www.npmjs.org/package/redux-immutable)

This package provides a single function `combineReducers`, which enables:

* Immutable state of the app.
* [Canonical Reducer Composition](#canonical-reducer-composition).

`redux-immutable` `combineReducers` is inspired by the Redux [`combineReducers`](http://gaearon.github.io/redux/docs/api/combineReducers.html) and [Redux Reducer Composition](#redux-reducer-composition) pattern.

## Canonical Reducer Composition

Canonical Reducer Composition `combineReducers` requires that:

1. Action definition object has `type` property.
1. Reducer definition object registers domains.
1. Domain definition object registers actions.

```js
{
    <domain>: {
        <action> (domain, action) {

        }
    }
}
```

In addition, domain can define a sub-domain:

```js
{
    <domain>: {
        <domain>: {
            <action> (domain, action) {

            },
            <action> (domain, action) {

            }
        },
        <domain>: {
            <action> (domain, action) {

            }
        }
    }
}
```

Canonical Reducer Composition has the following benefits:

* Introduces reducer declaration convention.
* Domain reducer function is called only if it registers an action.
* Enables intuitive nesting of the domain model.

### Example

```js
import {
    createStore,
} from 'redux';

import {
    combineReducers
} from 'redux-immutable';

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
    ],
    // <domain>
    user: {
        // <domain>
        names: [
            'Gajus',
            'Kuizinas'
        ]
    }
}

reducer = {
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

reducer = combineReducers(reducers);
store = createStore(reducer, Immutable.fromJS(state));
```

## Unpacking Immutable State

`redux-immutable` `combineReducers` turns state into Immutable data. Therefore, when you request the store state you will get an instance of `Immutable.Map`:

```js
let state;

state = store.getState();

console.log(Immutable.Map.isMap(state));
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

## Redux Reducer Composition

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

To address these issues, `redux-immutable` adapts a pattern of convention over configuration. For documentation reference purposes, lets call it Canonical Reducer Composition.

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
