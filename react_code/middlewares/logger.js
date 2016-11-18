/**
 * Logs all actions and states after they are dispatched.
 */

const logger = store => next => action => {
  console.group(action.type);
  console.info('dispatching', action);
  let result = next(action);
  console.info('next state', store.getState());
  console.groupEnd(action.type);
  return result;
}

export default logger;
