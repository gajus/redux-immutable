import _ from 'lodash';

import Immutable from 'immutable';
import {
    validateReducer,
    validateAction
} from 'canonical';

let iterator,
    isDomainMap,
    isActionMap;

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
 * @param {String} action.name
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
            // console.log('action.name', action.name, 'value[action.name]', typeof value[action.name]);

            if (value[action.name]) {
                let result;

                result = value[action.name](state.get(domainName), action);

                if (!Immutable.Iterable.isIterable(result)) {
                    throw new Error('Reducer must return an instance of Immutable.Iterable. "' + domainName + '" domain "' + action.name + '" action handler result is "' + typeof result + '".');
                }

                state = state.set(domainName, result);
            }
        } else if (isDomainMap(value)) {
            state = state.set(domainName, iterator(state.get(domainName), action, value))
        }
    });

    return state;
};

/**
 * @param {Object} reducer
 */
export default (reducer) => {
    validateReducer(reducer);

    return (state, action) => {
        if (action.type === '@@redux/INIT') {
            console.info('Ignoring @@redux/INIT. redux-immutable does not support state inflation. Refer to https://github.com/gajus/canonical-reducer-composition/issues/1.');

            return state;
        }

        validateAction(action);

        return iterator(state, action, reducer);
    };
};
