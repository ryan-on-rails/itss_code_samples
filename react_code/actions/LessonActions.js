import * as LC from '../constants/LessonConstants';

/*
 * action creators
 */

export function updateAnswerContentElements(data) {
  return {
    type: LC.UPDATE_ANSWER_CONTENT_ELEMENTS,
    data
  };
}
