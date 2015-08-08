import _ from 'lodash';

let isValidReducersObject,
    getUnexpectedReducerOutputError;

/**
 * Ensures that all reducers definition object values are functions.
 *
 * @param {Object} reducers
 * @throws Error When reducers definition object has values that are not functions.
 */
isValidReducersObject = (reducers) => {
    _.forEach(reducers, (value, key) => {
        if (!_.isFunction(value)) {
            throw new Error('All reducers definition object values must be functions. "' + key + '" property is a "' + typeof value + '".');
        }
    });
};

/**
 * @param {String} key Name of the reducer.
 * @param {Object} action
 */
getUnexpectedReducerOutputError = (key, action) => {
    let actionType,
        actionName;

    actionType = action && action.type;
    actionName = actionType && '"' + actionType + '"' || 'an action';

    return 'Reducer "' + key + '" returned undefined handling ' + actionName + '.';
};

/**
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one.
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed Immutable object, and builds a state object with the same shape.
 */
export default (reducers) => {
    let defaultState;

    isValidReducersObject(reducers);

    defaultState = _.map(reducers, _.constant(undefined));

    return (state = defaultState, action) => {
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
