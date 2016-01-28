import _ from 'lodash';
import {
    getUnexpectedInvocationParameterMessage,
    validateNextState
} from './utilities';

export default (userOptions : Object = {}) => {
    let options;

    options = _.assign({}, {
        debug: false
    }, userOptions);

    return (reducers: Object) => {
        return (inputState, action) => {
            if (options.debug) {
                let warningMessage;

                warningMessage = getUnexpectedInvocationParameterMessage(inputState, reducers, action);

                if (warningMessage) {
                    /* eslint-disable no-console */
                    console.error(warningMessage);
                    /* eslint-enable no-console */
                }
            }

            return inputState
                .withMutations((temporaryState) => {
                    _.forEach(reducers, (reducer, reducerName) => {
                        let currentDomainState,
                            nextDomainState;

                        currentDomainState = temporaryState.get(reducerName);

                        nextDomainState = reducer(currentDomainState, action);

                        validateNextState(nextDomainState, reducerName, action);

                        temporaryState.set(reducerName, nextDomainState);
                    });
                });
        };
    };
};
