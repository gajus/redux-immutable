/* eslint-disable lodash3/prefer-lodash-method */

import Immutable from 'immutable';
import getStateName from './getStateName';

export default (state: Object, reducers: Object, action: Object) => {
    const reducerNames = Object.keys(reducers);

    if (!reducerNames.length) {
        return 'Store does not have a valid reducer. Make sure the argument passed to combineReducers is an object whose values are reducers.';
    }

    const stateName = getStateName(action);

    if (!Immutable.Iterable.isIterable(state)) {
        return 'The ' + stateName + ' is of unexpected type. Expected argument to be an instance of Immutable.Iterable with the following properties: "' + reducerNames.join('", "') + '".';
    }

    const unexpectedStatePropertyNames = state.keySeq().toArray().filter((name) => {
        return !reducers.hasOwnProperty(name);
    });

    if (unexpectedStatePropertyNames.length > 0) {
        return 'Unexpected ' + (unexpectedStatePropertyNames.length === 1 ? 'property' : 'properties') + ' "' + unexpectedStatePropertyNames.join('", "') + '" found in ' + stateName + '. Expected to find one of the known reducer property names instead: "' + reducerNames.join('", "') + '". Unexpected properties will be ignored.';
    }

    return null;
};
