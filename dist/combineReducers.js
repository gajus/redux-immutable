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

var iterator = undefined,
    isDomainMap = undefined,
    isActionMap = undefined;

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
 * @return {Object} domain
 */
iterator = function (domain, action, collection, tapper) {
    if (!_immutable2['default'].Iterable.isIterable(domain)) {
        throw new Error('Domain must be an instance of Immutable.Iterable.');
    }

    // console.log('domain', domain, 'action', action, 'definition', collection);

    _lodash2['default'].forEach(collection, function (value, domainName) {
        // console.log('value', value, 'domain', domainName, 'isActionMap', isActionMap(value), 'isDomainMap', isDomainMap(value));

        if (isActionMap(value)) {
            // console.log('action.name', action.name, 'value[action.name]', typeof value[action.name]);

            if (value[action.name]) {
                var result = undefined;

                tapper.isActionHandled = true;

                result = value[action.name](domain.get(domainName), action);

                if (!_immutable2['default'].Iterable.isIterable(result)) {
                    throw new Error('Reducer must return an instance of Immutable.Iterable. "' + domainName + '" domain "' + action.name + '" action handler result is "' + typeof result + '".');
                }

                domain = domain.set(domainName, result);
            }
        } else if (isDomainMap(value)) {
            domain = domain.set(domainName, iterator(domain.get(domainName), action, value, tapper));
        }
    });

    return domain;
};

/**
 * @param {Object} reducer
 */

exports['default'] = function (reducer) {
    (0, _canonical.validateReducer)(reducer);

    console.log('CONSTRUCT');

    return function (state, action) {
        var tapper = undefined;

        if (action.type && action.type.indexOf('@@') === 0) {
            console.info('Ignoring private action "' + action.type + '". redux-immutable does not support state inflation. Refer to https://github.com/gajus/canonical-reducer-composition/issues/1.');

            return state;
        }

        (0, _canonical.validateAction)(action);

        // Tapper is an object that tracks execution of the action.
        // @todo Make this an opt-in.
        tapper = {
            isActionHandled: false
        };

        state = iterator(state, action, reducer, tapper);

        if (!tapper.isActionHandled) {
            console.warn('Unhandled action "' + action.name + '".', action);
        }

        return state;
    };
};

module.exports = exports['default'];
//# sourceMappingURL=combineReducers.js.map