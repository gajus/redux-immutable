import * as Immutable from 'immutable';
import {
  getUnexpectedInvocationParameterMessage,
  validateNextState,
} from './utilities';

export const combineReducers = (reducers: any, getDefaultState = Immutable.Map): Function => {
  const reducerKeys = Object.keys(reducers);

  return (inputState = getDefaultState(), action: Object) => {
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
        for (const reducerName of reducerKeys) {
          const reducer = reducers[reducerName];
          const currentDomainState = temporaryState.get(reducerName);
          const nextDomainState = reducer(currentDomainState, action);

          validateNextState(nextDomainState, reducerName, action);

          temporaryState.set(reducerName, nextDomainState);
        }
      });
  };
};
