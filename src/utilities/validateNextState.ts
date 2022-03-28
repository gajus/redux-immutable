export const validateNextState = (nextState: any, reducerName: string, action: any): void => {
  if (nextState === undefined) {
    throw new Error('Reducer "' + reducerName + '" returned undefined when handling "' + action.type + '" action. To ignore an action, you must explicitly return the previous state.');
  }
};
