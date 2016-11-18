import * as C                 from '../constants/ActivityConstants';
import * as FeedbackActions   from '../actions/FeedbackActions';
import * as LessonActions     from '../actions/LessonActions';
import * as GlobalActions     from '../actions/GlobalActions';
import * as UserActions       from '../actions/UserActions';
import api                    from '../lib/API';

/*
 * action creators
 */

export function showAlert(message) {
  return {
    type: C.SHOW_ALERT,
    data: { message }
  };
}

export function hideAlert() {
  return {
    type: C.HIDE_ALERT
  };
}

export function clearResponse() {
  return {
    type: C.CLEAR_RESPONSE
  };
}

export function updateMultipleChoiceAnswers(response) {
  return {
    type: C.UPDATE_MULTIPLE_CHOICE_ANSWERS,
    data: response
  };
}

export function updateSelectedMatrixCell(cellId) {
  return {
    type: C.UPDATE_SELECTED_MATRIX_CELL,
    data: { cellId }
  };
}

export function addMatrixWord(cellId, word) {
  return {
    type: C.ADD_MATRIX_WORD,
    data: { cellId, word }
  };
}

export function clearMatrixCell(id) {
  return {
    type: C.CLEAR_MATRIX_CELL,
    data: { id }
  };
}

export function activateCurrentActivity() {
  return {
    type: C.ACTIVATE_CURRENT_ACTIVITY
  };
}

export function addSelectedWord(word) {
  return {
    type: C.ADD_SELECTED_WORD,
    data: { word }
  };
}

export function removeSelectedWord(word) {
  return {
    type: C.REMOVE_SELECTED_WORD,
    data: { word }
  };
}

export function setNextInstruction(hasBeenRead) {
  // We may want to explicitly indicate that
  // the instruction (or monologue) hasn't yet
  // been dicated.
  if(hasBeenRead !== false) {
    hasBeenRead = true;
  }

  return {
    type: C.SET_NEXT_INSTRUCTION,
    data: { hasBeenRead }
  };
}

export function postResponse() {
  return {
    type: C.SET_RESPONDING,
    data: true
  };
}

export function receiveResponse() {
  return {
    type: C.SET_RESPONDING,
    data: false
  };
}

export function submitResponse(response, state) {
  if (state.user.is_spanish && (state.user.preferred_language === "es")) {
    return function(dispatch) {
      dispatch(UserActions.setMonologueReplay({replay:true, language:"en"}));
      dispatch(setNextInstruction(false));
    }
  } else {
    return function(dispatch) {
      if (state.user.is_spanish && (state.user.preferred_language === "en")) {
        dispatch(UserActions.setPreferredLanguage("es"));
      } else if (state.user.is_hybrid && (state.user.preferred_language === "es")) {
        dispatch(UserActions.setPreferredLanguage("en"));
      }

      // Indicate that response is being posted
      dispatch(postResponse());

      return api.submitResponse(response.toJSON(), (err, resp, body) => {
        if(resp.statusCode == 401){
          dispatch(showAlert(resp.body));
        }else{

          dispatch(receiveResponse());


          if(response.type === 'Info') {
            dispatch(GlobalActions.moveForward(state));
          } else {
            dispatch(FeedbackActions.receiveFeedback(body));
            dispatch(FeedbackActions.showFeedback());
          }
        }
      });
    }
  }
}
