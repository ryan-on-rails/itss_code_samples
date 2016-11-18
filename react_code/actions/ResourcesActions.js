import { setLoading, clearLoading } from './GlobalActions'
import api                          from '../lib/API'
import * as C                       from '../constants/ResourcesConstants'

export function requestResources() {
  return function(dispatch) {
    dispatch(setLoading())
    api.getResources()
      .then((response) => {
        dispatch(loadResources(response.data.resources))
        dispatch(clearLoading())
      })
  }
}

function loadResources(resources) {
  return {
    type: C.LOAD_RESOURCES,
    data: {
      lessons: resources.lessons
    }
  }
}

export function filterLessonResources(lesson) {
  return {
    type: C.FILTER_LESSON_RESOURCES,
    data: {
      lesson: lesson
    }
  }
}

export function filterTypeResources(fileType) {
  return {
    type: C.FILTER_TYPE_RESOURCES,
    data: {
      fileType: fileType
    }
  }
}

export function searchResources(query) {
  return {
    type: C.SEARCH_RESOURCES,
    data: {
      query: query
    }
  }
}
