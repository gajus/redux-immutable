import _ from 'lodash';

import Immutable from 'immutable';

let isDomainMap,
    isActionMap,
    iterator;

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
 * @param {Object} collection
 * @return {Object} state
 */
iterator = (state, action, collection) => {
    if (!Immutable.Iterable.isIterable(state)) {
        throw new Error('Domain must be an instance of Immutable.Iterable.');
    }

    // console.log('state', state, 'action', action, 'definition', collection);

    _.forEach(collection, (value, domainName) => {
        // console.log('value', value, 'domain', domainName, 'isActionMap', isActionMap(value), 'isDomainMap', isDomainMap(value));

        if (isActionMap(value)) {
            // console.log('action.type', action.type, 'value[action.type]', typeof value[action.type]);

            if (value[action.type]) {
                let result;

                result = value[action.type](state.get(domainName), action);

                if (!Immutable.Iterable.isIterable(result)) {
                    throw new Error('Reducer must return an instance of Immutable.Iterable. "' + domainName + '" domain "' + action.type + '" action reducer result is "' + typeof result + '".');
                }

                state = state.set(domainName, result);
            }
        } else if (isDomainMap(value)) {
            state = state.set(domainName, iterator(state.get(domainName), action, value))
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
    // _.values(reducers).length is used to ignore empty reducer definition.
    if (isActionMap(reducers) && _.values(reducers).length) {
        throw new Error('Reducer definition object must begin with a domain map.');
    }

    return (state, action) => {
        if (!_.isObject(action)) {
            throw new Error('Action definition parameter must be an object.');
        }

        if (!_.isString(action.type)) {
            throw new Error('Action definition parameter "type" property must be a string.');
        }

        if (!/^[A-Z\_]+$/.test(action.type)) {
            throw new Error('Action "type" property value must consist only of uppercase alphabetical characters and underscores.');
        }

        return iterator(state, action, reducers);
    };
};
