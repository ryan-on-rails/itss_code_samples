import * as C from '../constants/ResourcesConstants'

export default function resources(state = {
                                    lessons: [],
                                    lessonFilter: 'all',
                                    fileTypeFilter: 'all',
                                    searchFilter: '',
                                  }, action) {
  switch(action.type) {
    case C.LOAD_RESOURCES:
      const lessons = action.data.lessons
      return Object.assign( {}, state,
        {
          lessons: lessons
        }
      )
    case C.FILTER_LESSON_RESOURCES:
      const lesson = action.data.lesson
      return Object.assign( {}, state,
        {
          lessonFilter: lesson
        }
      )
    case C.FILTER_TYPE_RESOURCES:
      const fileType = action.data.fileType
      return Object.assign( {}, state,
        {
          fileTypeFilter: fileType
        }
      )
    case C.SEARCH_RESOURCES:
      const query = action.data.query
      return Object.assign( {}, state,
        {
          searchFilter: query
        }
      )
    default:
      return state
  }
}
