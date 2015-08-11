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

    return function (state, action) {
        var tapper = undefined;

        if (action.type === '@@redux/INIT') {
            console.info('Ignoring @@redux/INIT. redux-immutable does not support state inflation. Refer to https://github.com/gajus/canonical-reducer-composition/issues/1.');

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
//# sourceMappingURL=data:application/json;base64,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TyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztTQUNuRTs7QUFFRCxlQUFPLEtBQUssQ0FBQztLQUNoQixDQUFDO0NBQ0wiLCJmaWxlIjoiY29tYmluZVJlZHVjZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xuaW1wb3J0IHtcbiAgICB2YWxpZGF0ZVJlZHVjZXIsXG4gICAgdmFsaWRhdGVBY3Rpb25cbn0gZnJvbSAnY2Fub25pY2FsJztcblxubGV0IGl0ZXJhdG9yLFxuICAgIGlzRG9tYWluTWFwLFxuICAgIGlzQWN0aW9uTWFwO1xuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0LjxzdHJpbmcsIE9iamVjdD59IG1hcFxuICogQHJldHVybiB7Qm9vbGVhbn0gSWYgZXZlcnkgb2JqZWN0IHByb3BlcnR5IHZhbHVlIGlzIGEgcGxhaW4gb2JqZWN0LlxuICovXG5pc0RvbWFpbk1hcCA9IChtYXApID0+IHtcbiAgICByZXR1cm4gXy5ldmVyeShtYXAsIF8uaXNQbGFpbk9iamVjdCk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0LjxzdHJpbmcsIEZ1bmN0aW9uPn0gbWFwXG4gKiBAcmV0dXJuIHtCb29sZWFufSBJZiBldmVyeSBvYmplY3QgcHJvcGVydHkgdmFsdWUgaXMgYSBmdW5jdGlvbi5cbiAqL1xuaXNBY3Rpb25NYXAgPSAobWFwKSA9PiB7XG4gICAgcmV0dXJuIF8uZXZlcnkobWFwLCBfLmlzRnVuY3Rpb24pO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge09iamVjdH0gZG9tYWluXG4gKiBAcGFyYW0ge09iamVjdH0gYWN0aW9uXG4gKiBAcGFyYW0ge1N0cmluZ30gYWN0aW9uLm5hbWVcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb2xsZWN0aW9uXG4gKiBAcmV0dXJuIHtPYmplY3R9IGRvbWFpblxuICovXG5pdGVyYXRvciA9IChkb21haW4sIGFjdGlvbiwgY29sbGVjdGlvbiwgdGFwcGVyKSA9PiB7XG4gICAgaWYgKCFJbW11dGFibGUuSXRlcmFibGUuaXNJdGVyYWJsZShkb21haW4pKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRG9tYWluIG11c3QgYmUgYW4gaW5zdGFuY2Ugb2YgSW1tdXRhYmxlLkl0ZXJhYmxlLicpO1xuICAgIH1cblxuICAgIC8vIGNvbnNvbGUubG9nKCdkb21haW4nLCBkb21haW4sICdhY3Rpb24nLCBhY3Rpb24sICdkZWZpbml0aW9uJywgY29sbGVjdGlvbik7XG5cbiAgICBfLmZvckVhY2goY29sbGVjdGlvbiwgKHZhbHVlLCBkb21haW5OYW1lKSA9PiB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd2YWx1ZScsIHZhbHVlLCAnZG9tYWluJywgZG9tYWluTmFtZSwgJ2lzQWN0aW9uTWFwJywgaXNBY3Rpb25NYXAodmFsdWUpLCAnaXNEb21haW5NYXAnLCBpc0RvbWFpbk1hcCh2YWx1ZSkpO1xuXG4gICAgICAgIGlmIChpc0FjdGlvbk1hcCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb24ubmFtZScsIGFjdGlvbi5uYW1lLCAndmFsdWVbYWN0aW9uLm5hbWVdJywgdHlwZW9mIHZhbHVlW2FjdGlvbi5uYW1lXSk7XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZVthY3Rpb24ubmFtZV0pIHtcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0O1xuXG4gICAgICAgICAgICAgICAgdGFwcGVyLmlzQWN0aW9uSGFuZGxlZCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICByZXN1bHQgPSB2YWx1ZVthY3Rpb24ubmFtZV0oZG9tYWluLmdldChkb21haW5OYW1lKSwgYWN0aW9uKTtcblxuICAgICAgICAgICAgICAgIGlmICghSW1tdXRhYmxlLkl0ZXJhYmxlLmlzSXRlcmFibGUocmVzdWx0KSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlZHVjZXIgbXVzdCByZXR1cm4gYW4gaW5zdGFuY2Ugb2YgSW1tdXRhYmxlLkl0ZXJhYmxlLiBcIicgKyBkb21haW5OYW1lICsgJ1wiIGRvbWFpbiBcIicgKyBhY3Rpb24ubmFtZSArICdcIiBhY3Rpb24gaGFuZGxlciByZXN1bHQgaXMgXCInICsgdHlwZW9mIHJlc3VsdCArICdcIi4nKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkb21haW4gPSBkb21haW4uc2V0KGRvbWFpbk5hbWUsIHJlc3VsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoaXNEb21haW5NYXAodmFsdWUpKSB7XG4gICAgICAgICAgICBkb21haW4gPSBkb21haW4uc2V0KGRvbWFpbk5hbWUsIGl0ZXJhdG9yKGRvbWFpbi5nZXQoZG9tYWluTmFtZSksIGFjdGlvbiwgdmFsdWUsIHRhcHBlcikpXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBkb21haW47XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSByZWR1Y2VyXG4gKi9cbmV4cG9ydCBkZWZhdWx0IChyZWR1Y2VyKSA9PiB7XG4gICAgdmFsaWRhdGVSZWR1Y2VyKHJlZHVjZXIpO1xuXG4gICAgcmV0dXJuIChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gICAgICAgIGxldCB0YXBwZXI7XG5cbiAgICAgICAgaWYgKGFjdGlvbi50eXBlID09PSAnQEByZWR1eC9JTklUJykge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCdJZ25vcmluZyBAQHJlZHV4L0lOSVQuIHJlZHV4LWltbXV0YWJsZSBkb2VzIG5vdCBzdXBwb3J0IHN0YXRlIGluZmxhdGlvbi4gUmVmZXIgdG8gaHR0cHM6Ly9naXRodWIuY29tL2dhanVzL2Nhbm9uaWNhbC1yZWR1Y2VyLWNvbXBvc2l0aW9uL2lzc3Vlcy8xLicpO1xuXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICAgIH1cblxuICAgICAgICB2YWxpZGF0ZUFjdGlvbihhY3Rpb24pO1xuXG4gICAgICAgIC8vIFRhcHBlciBpcyBhbiBvYmplY3QgdGhhdCB0cmFja3MgZXhlY3V0aW9uIG9mIHRoZSBhY3Rpb24uXG4gICAgICAgIC8vIEB0b2RvIE1ha2UgdGhpcyBhbiBvcHQtaW4uXG4gICAgICAgIHRhcHBlciA9IHtcbiAgICAgICAgICAgIGlzQWN0aW9uSGFuZGxlZDogZmFsc2VcbiAgICAgICAgfTtcblxuICAgICAgICBzdGF0ZSA9IGl0ZXJhdG9yKHN0YXRlLCBhY3Rpb24sIHJlZHVjZXIsIHRhcHBlcik7XG5cbiAgICAgICAgaWYgKCF0YXBwZXIuaXNBY3Rpb25IYW5kbGVkKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1VuaGFuZGxlZCBhY3Rpb24gXCInICsgYWN0aW9uLm5hbWUgKyAnXCIuJywgYWN0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9O1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==