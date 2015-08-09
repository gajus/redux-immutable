import _ from 'lodash';
import Immutable from 'immutable';

let isValidReducersObject,
    isValidActionObject,
    getUnexpectedReducerOutputError;

/**
 * @param {Object} action
 * @throws
 */
isValidActionObject = (action) => {

};

/**
 * @param {String} key Name of the reducer.
 * @param {Object} action
 */
getUnexpectedReducerOutputError = (key, action) => {
    return 'Reducer "' + key + '" returned undefined while handling "' + action.type + '" action.';
};

/**
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one.
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed Immutable object, and builds a state object with the same shape.
 */
export default (reducers) => {
    let defaultState;

    if (!_.isObject(reducers)) {
        throw new Error('Reducers definition parameter must be an object.');
    }

    _.forEach(reducers, (value, key) => {
        if (!_.isFunction(value)) {
            throw new Error('All reducers definition object property values must be functions. "' + key + '" property is a "' + typeof value + '".');
        }
    });

    return (state, action) => {
        if (!_.isObject(action)) {
            throw new Error('Action definition parameter must be an object.');
        }

        if (!_.isString(action.type)) {
            throw new Error('Action definition parameter type property must be a string.');
        }

        if (!(state instanceof Immutable.Map)) {
            throw new Error('State must be an instance of Immutable.Map.');
        }

        _.forEach(reducers, (reducer, key) => {
            let value;

            value = reducer(state.get(key), action);

            if (value === undefined) {
                throw new Error(getUnexpectedReducerOutputError(key, action));
            }

            state = state.set(key, value);
        });

        return state;
    };
};
