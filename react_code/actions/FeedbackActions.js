import * as FC from '../constants/FeedbackConstants';

/*
 * action creators
 */

export function receiveFeedback(data) {
  data.feedback.autoPlay = true;
  return {
    type: FC.RECEIVE_FEEDBACK,
    data: data
  };
}

export function showFeedback() {
  return {
    type: FC.SHOW_FEEDBACK
  };
}

export function hideFeedback() {
  return {
    type: FC.HIDE_FEEDBACK
  };
}
