'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _canonical = require('canonical');

var isActionMap = undefined,
    isDomainMap = undefined,
    iterator = undefined;

/**
 * @param {Object.<string, Object>} map
 * @return {Boolean} If every object property value is a plain object.
 */
isDomainMap = function (map) {
    return _lodash2['default'].every(map, _lodash2['default'].isPlainObject);
};

/**
 * @param {Object.<string, Function>} map
 * @return {Boolean} If every object property value is a function.
 */
isActionMap = function (map) {
    return _lodash2['default'].every(map, _lodash2['default'].isFunction);
};

/**
 * @param {Object} domain
 * @param {Object} action
 * @param {String} action.name
 * @param {Object} collection
 * @param {Object} tapper
 * @return {Object}
 */
iterator = function (domain, action, collection, tapper) {
    var newDomain = undefined;

    if (!_immutable2['default'].Iterable.isIterable(domain)) {
        throw new Error('Domain must be an instance of Immutable.Iterable.');
    }

    newDomain = domain;

    // console.log(`domain`, domain, `action`, action, `definition`, collection);

    _lodash2['default'].forEach(collection, function (value, domainName) {
        // console.log(`value`, value, `domain`, domainName, `isActionMap`, isActionMap(value), `isDomainMap`, isDomainMap(value));

        if (isActionMap(value)) {
            // console.log(`action.name`, action.name, `value[action.name]`, typeof value[action.name]);

            if (value[action.name]) {
                var result = undefined;

                tapper.isActionHandled = true;

                result = value[action.name](newDomain.get(domainName), action);

                if (!_immutable2['default'].Iterable.isIterable(result)) {
                    throw new Error('Reducer must return an instance of Immutable.Iterable. "' + domainName + '" domain "' + action.name + '" action handler result is "' + typeof result + '".');
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

exports['default'] = function (reducer) {
    (0, _canonical.validateReducer)(reducer);

    /**
     * @param {Immutable.Iterable} state
     * @param {Object|undefined} action
     * @return {Immutable.Iterable}
     */
    return function (state, action) {
        var newState = undefined,
            sanitizedAction = undefined,
            tapper = undefined;

        if (action) {
            if (action.type && action.type.indexOf('@@') === 0) {
                console.info('Ignoring private action "' + action.type + '". redux-immutable does not support state inflation. Refer to https://github.com/gajus/canonical-reducer-composition/issues/1.');

                return state;
            }

            if (action.name === 'CONSTRUCT') {
                throw new Error('CONSTRUCT is a reserved action name.');
            }

            (0, _canonical.validateAction)(action);

            sanitizedAction = action;
        } else {
            sanitizedAction = {
                name: 'CONSTRUCT'
            };
        }

        // Tapper is an object that tracks execution of the action.
        // @todo Make this an opt-in.
        tapper = {
            isActionHandled: false
        };

        newState = iterator(state, sanitizedAction, reducer, tapper);

        if (!tapper.isActionHandled && sanitizedAction.name !== 'CONSTRUCT') {
            console.warn('Unhandled action "' + sanitizedAction.name + '".', sanitizedAction);
        }

        // console.log(`sanitizedAction`, sanitizedAction, `tapper`, tapper);

        return newState;
    };
};

module.exports = exports['default'];
//# sourceMappingURL=combineReducers.js.map