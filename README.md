# redux-immutable

## `store.js`

```js
import {
    createStore
} from './../../redux';

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

## `app.js`

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
