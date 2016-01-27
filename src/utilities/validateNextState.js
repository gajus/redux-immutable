import _ from 'lodash';

export default (nextState: Object, reducerName: string, action: Object): null => {
    if (_.isUndefined(nextState)) {
        throw new Error('Reducer "' + reducerName + '" returned undefined when handling "' + action.type + '" action. To ignore an action, you must explicitly return the previous state.');
    }

    return null;
};
