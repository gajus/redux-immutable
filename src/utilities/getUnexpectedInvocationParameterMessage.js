import _ from 'lodash';
import Immutable from 'immutable';
import pluralize from 'pluralize';
import getStateName from './getStateName';

export default (state: Object, reducers: Object, action: Object) => {
    let reducerNames,
        stateName,
        unexpectedStatePropertyNames;

    reducerNames = _.keys(reducers);

    if (_.isEmpty(reducerNames)) {
        return 'Store does not have a valid reducer. Make sure the argument passed to combineReducers is an object whose values are reducers.';
    }

    stateName = getStateName(action);

    if (!Immutable.Iterable.isIterable(state)) {
        return 'The ' + stateName + ' is of unexpected type. Expected argument to be an instance of Immutable.Iterable with the following properties: "' + reducerNames.join('", "') + '".';
    }

    unexpectedStatePropertyNames = _.filter(state.keySeq().toArray(), (name) => {
        return !reducers.hasOwnProperty(name);
    });

    if (!_.isEmpty(unexpectedStatePropertyNames)) {
        return 'Unexpected ' + pluralize('property', unexpectedStatePropertyNames.length) + ' "' + unexpectedStatePropertyNames.join('", "') + '" found in ' + stateName + '. Expected to find one of the known reducer property names instead: "' + reducerNames.join('", "') + '". Unexpected properties will be ignored.';
    }

    return null;
};
