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
 * @param {Object} state
 * @param {Object} action
 * @param {String} action.name
 * @param {Object} collection
 * @return {Object} state
 */
iterator = function (state, action, collection) {
    if (!_immutable2['default'].Iterable.isIterable(state)) {
        throw new Error('Domain must be an instance of Immutable.Iterable.');
    }

    // console.log('state', state, 'action', action, 'definition', collection);

    _lodash2['default'].forEach(collection, function (value, domainName) {
        // console.log('value', value, 'domain', domainName, 'isActionMap', isActionMap(value), 'isDomainMap', isDomainMap(value));

        if (isActionMap(value)) {
            // console.log('action.name', action.name, 'value[action.name]', typeof value[action.name]);

            if (value[action.name]) {
                var result = undefined;

                result = value[action.name](state.get(domainName), action);

                if (!_immutable2['default'].Iterable.isIterable(result)) {
                    throw new Error('Reducer must return an instance of Immutable.Iterable. "' + domainName + '" domain "' + action.name + '" action handler result is "' + typeof result + '".');
                }

                state = state.set(domainName, result);
            }
        } else if (isDomainMap(value)) {
            state = state.set(domainName, iterator(state.get(domainName), action, value));
        }
    });

    return state;
};

/**
 * @param {Object} reducer
 */

exports['default'] = function (reducer) {
    (0, _canonical.validateReducer)(reducer);

    return function (state, action) {
        (0, _canonical.validateAction)(action);

        return iterator(state, action, reducer);
    };
};

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbWJpbmVSZWR1Y2Vycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztzQkFBYyxRQUFROzs7O3lCQUVBLFdBQVc7Ozs7eUJBSTFCLFdBQVc7O0FBRWxCLElBQUksUUFBUSxZQUFBO0lBQ1IsV0FBVyxZQUFBO0lBQ1gsV0FBVyxZQUFBLENBQUM7Ozs7OztBQU1oQixXQUFXLEdBQUcsVUFBQyxHQUFHLEVBQUs7QUFDbkIsV0FBTyxvQkFBRSxLQUFLLENBQUMsR0FBRyxFQUFFLG9CQUFFLGFBQWEsQ0FBQyxDQUFDO0NBQ3hDLENBQUM7Ozs7OztBQU1GLFdBQVcsR0FBRyxVQUFDLEdBQUcsRUFBSztBQUNuQixXQUFPLG9CQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsb0JBQUUsVUFBVSxDQUFDLENBQUM7Q0FDckMsQ0FBQzs7Ozs7Ozs7O0FBU0YsUUFBUSxHQUFHLFVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUs7QUFDdEMsUUFBSSxDQUFDLHVCQUFVLFFBQVEsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDdkMsY0FBTSxJQUFJLEtBQUssQ0FBQyxtREFBbUQsQ0FBQyxDQUFDO0tBQ3hFOzs7O0FBSUQsd0JBQUUsT0FBTyxDQUFDLFVBQVUsRUFBRSxVQUFDLEtBQUssRUFBRSxVQUFVLEVBQUs7OztBQUd6QyxZQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRTs7O0FBR3BCLGdCQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDcEIsb0JBQUksTUFBTSxZQUFBLENBQUM7O0FBRVgsc0JBQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7O0FBRTNELG9CQUFJLENBQUMsdUJBQVUsUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUN4QywwQkFBTSxJQUFJLEtBQUssQ0FBQywwREFBMEQsR0FBRyxVQUFVLEdBQUcsWUFBWSxHQUFHLE1BQU0sQ0FBQyxJQUFJLEdBQUcsOEJBQThCLEdBQUcsT0FBTyxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUM7aUJBQ2pMOztBQUVELHFCQUFLLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7YUFDekM7U0FDSixNQUFNLElBQUksV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQzNCLGlCQUFLLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUE7U0FDaEY7S0FDSixDQUFDLENBQUM7O0FBRUgsV0FBTyxLQUFLLENBQUM7Q0FDaEIsQ0FBQzs7Ozs7O3FCQUthLFVBQUMsT0FBTyxFQUFLO0FBQ3hCLG1CQW5FQSxlQUFlLEVBbUVDLE9BQU8sQ0FBQyxDQUFDOztBQUV6QixXQUFPLFVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBSztBQUN0Qix1QkFyRUosY0FBYyxFQXFFSyxNQUFNLENBQUMsQ0FBQzs7QUFFdkIsZUFBTyxRQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztLQUMzQyxDQUFDO0NBQ0wiLCJmaWxlIjoiY29tYmluZVJlZHVjZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xuaW1wb3J0IHtcbiAgICB2YWxpZGF0ZVJlZHVjZXIsXG4gICAgdmFsaWRhdGVBY3Rpb25cbn0gZnJvbSAnY2Fub25pY2FsJztcblxubGV0IGl0ZXJhdG9yLFxuICAgIGlzRG9tYWluTWFwLFxuICAgIGlzQWN0aW9uTWFwO1xuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0LjxzdHJpbmcsIE9iamVjdD59IG1hcFxuICogQHJldHVybiB7Qm9vbGVhbn0gSWYgZXZlcnkgb2JqZWN0IHByb3BlcnR5IHZhbHVlIGlzIGEgcGxhaW4gb2JqZWN0LlxuICovXG5pc0RvbWFpbk1hcCA9IChtYXApID0+IHtcbiAgICByZXR1cm4gXy5ldmVyeShtYXAsIF8uaXNQbGFpbk9iamVjdCk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0LjxzdHJpbmcsIEZ1bmN0aW9uPn0gbWFwXG4gKiBAcmV0dXJuIHtCb29sZWFufSBJZiBldmVyeSBvYmplY3QgcHJvcGVydHkgdmFsdWUgaXMgYSBmdW5jdGlvbi5cbiAqL1xuaXNBY3Rpb25NYXAgPSAobWFwKSA9PiB7XG4gICAgcmV0dXJuIF8uZXZlcnkobWFwLCBfLmlzRnVuY3Rpb24pO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBhY3Rpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBhY3Rpb24ubmFtZVxuICogQHBhcmFtIHtPYmplY3R9IGNvbGxlY3Rpb25cbiAqIEByZXR1cm4ge09iamVjdH0gc3RhdGVcbiAqL1xuaXRlcmF0b3IgPSAoc3RhdGUsIGFjdGlvbiwgY29sbGVjdGlvbikgPT4ge1xuICAgIGlmICghSW1tdXRhYmxlLkl0ZXJhYmxlLmlzSXRlcmFibGUoc3RhdGUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRG9tYWluIG11c3QgYmUgYW4gaW5zdGFuY2Ugb2YgSW1tdXRhYmxlLkl0ZXJhYmxlLicpO1xuICAgIH1cblxuICAgIC8vIGNvbnNvbGUubG9nKCdzdGF0ZScsIHN0YXRlLCAnYWN0aW9uJywgYWN0aW9uLCAnZGVmaW5pdGlvbicsIGNvbGxlY3Rpb24pO1xuXG4gICAgXy5mb3JFYWNoKGNvbGxlY3Rpb24sICh2YWx1ZSwgZG9tYWluTmFtZSkgPT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygndmFsdWUnLCB2YWx1ZSwgJ2RvbWFpbicsIGRvbWFpbk5hbWUsICdpc0FjdGlvbk1hcCcsIGlzQWN0aW9uTWFwKHZhbHVlKSwgJ2lzRG9tYWluTWFwJywgaXNEb21haW5NYXAodmFsdWUpKTtcblxuICAgICAgICBpZiAoaXNBY3Rpb25NYXAodmFsdWUpKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnYWN0aW9uLm5hbWUnLCBhY3Rpb24ubmFtZSwgJ3ZhbHVlW2FjdGlvbi5uYW1lXScsIHR5cGVvZiB2YWx1ZVthY3Rpb24ubmFtZV0pO1xuXG4gICAgICAgICAgICBpZiAodmFsdWVbYWN0aW9uLm5hbWVdKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdDtcblxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHZhbHVlW2FjdGlvbi5uYW1lXShzdGF0ZS5nZXQoZG9tYWluTmFtZSksIGFjdGlvbik7XG5cbiAgICAgICAgICAgICAgICBpZiAoIUltbXV0YWJsZS5JdGVyYWJsZS5pc0l0ZXJhYmxlKHJlc3VsdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZWR1Y2VyIG11c3QgcmV0dXJuIGFuIGluc3RhbmNlIG9mIEltbXV0YWJsZS5JdGVyYWJsZS4gXCInICsgZG9tYWluTmFtZSArICdcIiBkb21haW4gXCInICsgYWN0aW9uLm5hbWUgKyAnXCIgYWN0aW9uIGhhbmRsZXIgcmVzdWx0IGlzIFwiJyArIHR5cGVvZiByZXN1bHQgKyAnXCIuJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc3RhdGUgPSBzdGF0ZS5zZXQoZG9tYWluTmFtZSwgcmVzdWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChpc0RvbWFpbk1hcCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHN0YXRlID0gc3RhdGUuc2V0KGRvbWFpbk5hbWUsIGl0ZXJhdG9yKHN0YXRlLmdldChkb21haW5OYW1lKSwgYWN0aW9uLCB2YWx1ZSkpXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBzdGF0ZTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IHJlZHVjZXJcbiAqL1xuZXhwb3J0IGRlZmF1bHQgKHJlZHVjZXIpID0+IHtcbiAgICB2YWxpZGF0ZVJlZHVjZXIocmVkdWNlcik7XG5cbiAgICByZXR1cm4gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgICAgICAgdmFsaWRhdGVBY3Rpb24oYWN0aW9uKTtcblxuICAgICAgICByZXR1cm4gaXRlcmF0b3Ioc3RhdGUsIGFjdGlvbiwgcmVkdWNlcik7XG4gICAgfTtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=