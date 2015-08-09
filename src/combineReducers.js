import _ from 'lodash';
import Immutable from 'immutable';

let getUnexpectedReducerOutputError;

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

    _.forEach(reducers, (domainReducers, key) => {
        if (!_.isObject(domainReducers)) {
            throw new Error('All reducers definition object property values must be objects. "' + key + '" property is a "' + typeof domainReducers + '".');
        }

        _.forEach(domainReducers, (reducer, key) => {
            console.log('reducer', reducer);

            if (!_.isFunction(reducer)) {
                throw new Error('All reducers definition object property values must be functions. "' + key + '" property is a "' + typeof reducer + '".');
            }
        });
    });

    return (state, action) => {
        if (!_.isObject(action)) {
            throw new Error('Action definition parameter must be an object.');
        }

        if (!_.isString(action.type)) {
            throw new Error('Action definition parameter type property must be a string.');
        }

        // @todo It can be List, etc.
        // if (!(state instanceof Immutable.Map)) {
        //    throw new Error('State must be an instance of Immutable.Map.');
        // }

        _.forEach(reducers, (domainReducers, key) => {
            let value;

            if (!domainReducers[action.type]) {
                return;
            }

            value = domainReducers[action.type](state.get(key), action);

            if (value === undefined) {
                throw new Error(getUnexpectedReducerOutputError(key, action));
            }

            state = state.set(key, value);
        });

        return state;
    };
};
