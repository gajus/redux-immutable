import _ from 'lodash';

let getUnexpectedReducerOutputError,
    isDomainMap,
    isActionMap,
    iterator;

/**
 * @param {String} key Name of the reducer.
 * @param {Object} action
 */
getUnexpectedReducerOutputError = (key, action) => {
    return 'Reducer "' + key + '" returned undefined while handling "' + action.type + '" action.';
};

/**
 * @param {Object.<string, Object>} map
 * @return {Boolean} If every object property value is a plain object.
 */
isDomainMap = (map) => {
    return _.every(map, _.isPlainObject);
};

/**
 * @param {Object.<string, Function>} map
 * @return {Boolean} If every object property value is a function.
 */
isActionMap = (map) => {
    return _.every(map, _.isFunction);
};

/**
 * @param {Object} state
 * @param {Object} action
 * @param {String} action.type
 * @param {Object} reducers
 * @return {Object} state
 */
iterator = (state, action, reducers) => {
    _.forEach(reducers, (value, domain) => {
        // console.log('value, name', value, name, 'isActionMap', isActionMap(value), 'isDomainMap', isDomainMap(value));

        if (isActionMap(value)) {
            // console.log('action.type', action.type, 'value[action.type]', typeof value[action.type]);

            if (value[action.type]) {
                let result;

                result = value[action.type](state.get(domain), action);

                if (result === undefined) {
                    throw new Error(getUnexpectedReducerOutputError(domain, action));
                }

                state = state.set(domain, result);
            }
        } else if (isDomainMap(value)) {
            state = state.set(domain, iterator(state.get(domain), action, value))
        } else {
            throw new Error('Reducer definition object value object all values must correspond to a function (action map) or an object (domain map).');
        }
    });

    return state;
};

/**
 * @param {Object} reducers
 */
export default (reducers) => {
    return (state, action) => {
        return iterator(state, action, reducers);
    };
};
