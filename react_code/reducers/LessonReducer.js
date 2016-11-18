import * as C     from '../constants/LessonConstants';

export default function lesson(state = { isLoading: false }, action) {
  const { type, data } = action;

  switch(action.type) {
    case C.REQUEST_NEXT_LESSON:
      return Object.assign({}, state, { isLoading: true });
    case C.RECEIVE_LESSON:
      return action.data;
    case C.UPDATE_ANSWER_CONTENT_ELEMENTS:
      let pages = state.pages.map(page => {
        let ces = page.content_elements.map(ce => {
          let isACE = ce.type === 'AnswerContentElement';

          if(isACE && ce.activity_id === data.response.activity_id) {
            ce.representation = data.answer_representation;
          }

          return ce;
        });

        return page;
      });

      return Object.assign({}, state, { pages });
    default:
      return state;
  }
}
