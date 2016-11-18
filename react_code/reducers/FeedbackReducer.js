import * as FC      from '../constants/FeedbackConstants';

export default function feedback(state = {}, action) {
  switch(action.type) {
    case FC.RECEIVE_FEEDBACK:
      return action.data;
    case FC.SHOW_FEEDBACK:
      return Object.assign({}, state, { showModal: true });
    case FC.HIDE_FEEDBACK:
      return Object.assign({}, state, { showModal: false });
    default:
      return state;
  }
}
