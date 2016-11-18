import * as C from '../constants/ResponsesConstants'

export default function responses(state = {
                                    student:   {},
                                    activity:  {
                                      instructions: {
                                        label:   [],
                                        options: [],
                                      }
                                    },
                                    responses: [],
                                    modelResponse:   {},
                                    currentResponse: {
                                      content: []
                                    }
                                  }, action) {
  switch(action.type) {
    case C.RESPONSES_LOADING:
      // set all of the values to their default so that the loading
      // modal has a predictable size
      return Object.assign( {}, state,
        {
          loading: true,
          errors:    [],
          student:   {},
          activity:  {
            instructions: {
              label:   [],
              options: [],
            }
          },
          responses: [],
          modelResponse:   {},
          currentResponse: {
            content: []
          }
        }
      )
    case C.RESPONSES_LOADED:
      return Object.assign( {}, state,
        {
          loading: false
        }
      )
    case C.RESPONSES_ERRORS:
      return Object.assign( {}, state,
        {
          errors: action.data.errors
        }
      )
    case C.LOAD_STUDENT_RESPONSES:
      const student   = action.data.student
      const activity  = action.data.activity
      const responses = action.data.responses
      const modelResponse   = action.data.modelResponse
      const currentResponse = responses[0] ||
                              { content: ['No responses yet.'] }

      return Object.assign( {}, state,
        {
          student:   student,
          activity:  activity,
          responses: responses,
          modelResponse:   modelResponse,
          currentResponse: currentResponse
        }
      )
    case C.CHANGE_CURRENT_RESPONSE:
      const attempt = action.data.attempt

      if ( attempt === 'model' ) {
        return Object.assign( {}, state,
          {
            currentResponse: state.modelResponse
          }
        )
      } else {
        return Object.assign( {}, state,
          {
            currentResponse: state.responses[attempt]
          }
        )
      }
    default:
      return state
  }
}

