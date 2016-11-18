import api                          from '../lib/API'
import { setLoading, clearLoading } from './GlobalActions'
import * as C                       from '../constants/ResponsesConstants'

function setResponsesLoading() {
  return {
    type: C.RESPONSES_LOADING
  }
}

function clearResponsesLoading() {
  return {
    type: C.RESPONSES_LOADED
  }
}

function loadStudentResponses(student, activity, responses, modelResponse) {
  return {
    type: C.LOAD_STUDENT_RESPONSES,
    data: {
      student:       student,
      activity:      activity,
      responses:     responses,
      modelResponse: modelResponse
    }
  }
}

function catchResponsesErrors(response) {
  return {
    type: C.RESPONSES_ERRORS,
    data: {
      errors: ['We\'re sorry, there was a problem loading the information and responses for this activity.', 'Please try again.']
    }
  }
}

export function requestStudentResponses(studentId, activityId) {
  return function(dispatch) {
    dispatch(setResponsesLoading())
    api.getStudentResponses(studentId, activityId)
      .then(response => {
        dispatch(
          loadStudentResponses(
            response.data.student_info,
            response.data.activity,
            response.data.responses,
            response.data.model_response
          )
        )
        dispatch(clearResponsesLoading())
      })
      .catch(response => {
        dispatch(catchResponsesErrors(response))
        dispatch(clearResponsesLoading())
      })
  }
}

export function changeCurrentResponse(attempt) {
  return {
    type: C.CHANGE_CURRENT_RESPONSE,
    data: {
      attempt: attempt
    }
  }
}
