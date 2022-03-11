import { Map as ImmutableMap } from 'immutable';
import {
  getUnexpectedInvocationParameterMessage,
  validateNextState
} from './utilities';

export default (reducers: Object, getDefaultState: ?Function = ImmutableMap): Function => {
  const reducerKeys = Object.keys(reducers);

  // eslint-disable-next-line space-infix-ops
  return (inputState: ?Function = getDefaultState(), action: Object): ImmutableMap => {
    // eslint-disable-next-line no-process-env
    if (process.env.NODE_ENV !== 'production') {
      const warningMessage = getUnexpectedInvocationParameterMessage(inputState, reducers, action);

      if (warningMessage) {
        // eslint-disable-next-line no-console
        console.error(warningMessage);
      }
    }

    return inputState
      .withMutations((temporaryState) => {
        reducerKeys.forEach((reducerName) => {
          const reducer = reducers[reducerName];
          const currentDomainState = temporaryState.get(reducerName);
          const nextDomainState = reducer(currentDomainState, action);

          validateNextState(nextDomainState, reducerName, action);

          temporaryState.set(reducerName, nextDomainState);
        });
      });
  };
};
