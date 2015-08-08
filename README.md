# redux-immutable

This package provides a single function `combineReducers`. `combineReducers` expects the entire state to be an [Immutable.js](https://facebook.github.io/immutable-js/) object. Otherwise, `combineReducers` is equivalent to the ](http://gaearon.github.io/redux/docs/api/combineReducers.html) function that is part of the Redux framework.

This package is designed to be used with [react-redux](https://www.npmjs.com/package/react-redux). Use `mapStateToProps` callback of the `connect` method to transform `Immutable` object to regular object before proceeding to use selectors.

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

### `app.js`

```js
import React from 'react';

import {
    connect
} from 'react-redux';

/**
 * @param {Immutable}
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
