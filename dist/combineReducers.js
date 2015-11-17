'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _canonicalReducerCompositionValidator = require('canonical-reducer-composition-validator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var isActionMap = undefined,
    isDomainMap = undefined,
    iterator = undefined;

/**
 * @param {Object.<string, Object>} map
 * @return {boolean} If every object property value is a plain object.
 */
isDomainMap = function (map) {
    return _utils2.default.every(map, _utils2.default.isPlainObject);
};

/**
 * @param {Object.<string, Function>} map
 * @return {boolean} If every object property value is a function.
 */
isActionMap = function (map) {
    return _utils2.default.every(map, _utils2.default.isFunction);
};

/**
 * @param {Object} domain
 * @param {Object} action
 * @param {string} action.name
 * @param {Object} collection
 * @param {Object} tapper
 * @return {Object}
 */
iterator = function (domain, action, collection, tapper) {
    var newDomain = undefined;

    if (!_immutable2.default.Iterable.isIterable(domain)) {
        throw new Error('Domain must be an instance of Immutable.Iterable.');
    }

    newDomain = domain;

    // console.log('domain', domain, 'action', action, 'definition', collection);

    _utils2.default.forEach(collection, function (value, domainName) {
        // console.log('value', value, 'domain', domainName, 'isActionMap', isActionMap(value), 'isDomainMap', isDomainMap(value));

        if (isActionMap(value)) {
            // console.log('action.name', action.name, 'value[action.name]', typeof value[action.name]);

            if (value[action.name]) {
                var result = undefined;

                tapper.isActionHandled = true;

                result = value[action.name](newDomain.get(domainName), action);

                if (!_immutable2.default.Iterable.isIterable(result)) {
                    throw new Error('Reducer must return an instance of Immutable.Iterable. "' + domainName + '" domain "' + action.name + '" action handler result is "' + (typeof result === 'undefined' ? 'undefined' : _typeof(result)) + '".');
                }

                newDomain = newDomain.set(domainName, result);
            }
        } else if (isDomainMap(value)) {
            newDomain = newDomain.set(domainName, iterator(newDomain.get(domainName) || _immutable2.default.Map(), action, value, tapper));
        }
    });

    return newDomain;
};

/**
 * @param {Object} reducer
 * @return {Function}
 */

exports.default = function (reducer) {
    (0, _canonicalReducerCompositionValidator.validateReducer)(reducer);

    /**
     * @param {Immutable.Iterable} state
     * @param {Object} action
     * @return {Immutable.Iterable}
     */
    return function (state, action) {
        var newState = undefined,
            tapper = undefined;

        if (!action) {
            throw new Error('Action parameter value must be an object.');
        }

        if (action.type && action.type.indexOf('@@') === 0) {
            /* eslint-disable no-console */
            console.info('Ignoring private action "' + action.type + '". redux-immutable does not support state inflation. Refer to https://github.com/gajus/canonical-reducer-composition/issues/1.');
            /* eslint-enable no-console */

            return state;
        }

        (0, _canonicalReducerCompositionValidator.validateAction)(action);

        // Tapper is an object that tracks execution of the action.
        // @todo Make this an opt-in.
        tapper = {
            isActionHandled: false
        };

        newState = iterator(state, action, reducer, tapper);

        if (!tapper.isActionHandled && action.name !== 'CONSTRUCT') {
            /* eslint-disable no-console */
            console.warn('Unhandled action "' + action.name + '".', action);
            /* eslint-enable no-console */
        }

        return newState;
    };
};
//# sourceMappingURL=combineReducers.js.map
