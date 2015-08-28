import _ from 'lodash';

import Immutable from 'immutable';
import {
    validateReducer,
    validateAction
} from 'canonical';

let isActionMap,
    isDomainMap,
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
 * @param {Object} domain
 * @param {Object} action
 * @param {String} action.name
 * @param {Object} collection
 * @param {Object} tapper
 * @return {Object}
 */
iterator = (domain, action, collection, tapper) => {
    let newDomain;

    if (!Immutable.Iterable.isIterable(domain)) {
        throw new Error(`Domain must be an instance of Immutable.Iterable.`);
    }

    newDomain = domain;

    // console.log(`domain`, domain, `action`, action, `definition`, collection);

    _.forEach(collection, (value, domainName) => {
        // console.log(`value`, value, `domain`, domainName, `isActionMap`, isActionMap(value), `isDomainMap`, isDomainMap(value));

        if (isActionMap(value)) {
            // console.log(`action.name`, action.name, `value[action.name]`, typeof value[action.name]);

            if (value[action.name]) {
                let result;

                tapper.isActionHandled = true;

                result = value[action.name](newDomain.get(domainName), action);

                if (!Immutable.Iterable.isIterable(result)) {
                    throw new Error(`Reducer must return an instance of Immutable.Iterable. "${domainName}" domain "${action.name}" action handler result is "${typeof result}".`);
                }

                newDomain = newDomain.set(domainName, result);
            }
        } else if (isDomainMap(value)) {
            newDomain = newDomain.set(domainName, iterator(newDomain.get(domainName), action, value, tapper));
        }
    });

    return newDomain;
};

/**
 * @param {Object} reducer
 * @return {Function}
 */
export default (reducer) => {
    validateReducer(reducer);

    /**
     * @param {Immutable.Iterable} state
     * @param {Object|undefined} action
     * @return {Immutable.Iterable}
     */
    return (state, action) => {
        let newState,
            sanitizedAction,
            tapper;

        if (action) {
            if (action.type && action.type.indexOf(`@@`) === 0) {
                console.info(`Ignoring private action "${action.type}". redux-immutable does not support state inflation. Refer to https://github.com/gajus/canonical-reducer-composition/issues/1.`);

                return state;
            }

            if (action.name === `CONSTRUCT`) {
                throw new Error(`CONSTRUCT is a reserved action name.`);
            }

            validateAction(action);

            sanitizedAction = action;
        } else {
            sanitizedAction = {
                name: `CONSTRUCT`
            };
        }

        // Tapper is an object that tracks execution of the action.
        // @todo Make this an opt-in.
        tapper = {
            isActionHandled: false
        };

        newState = iterator(state, sanitizedAction, reducer, tapper);

        if (!tapper.isActionHandled && sanitizedAction.name !== `CONSTRUCT`) {
            console.warn(`Unhandled action "${sanitizedAction.name}".`, sanitizedAction);
        }

        // console.log(`sanitizedAction`, sanitizedAction, `tapper`, tapper);

        return newState;
    };
};
