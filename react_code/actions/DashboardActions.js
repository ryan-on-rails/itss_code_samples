import axios                        from 'axios'
import api                          from '../lib/API'
import { setLoading, clearLoading } from './GlobalActions'
import * as C                       from '../constants/DashboardConstants'

function changeLoadingText(text) {
  return {
    type: C.CHANGE_LOADING_TEXT,
    data: {
      text: text
    }
  }
}

function loadClassroomStatus(structures, student_response_data) {
  return {
    type: C.LOAD_CLASSROOM_STATUS,
    data: {
      structures:  structures,
      students:    student_response_data
    }
  }
}

/* requestClassroomStatus
 *
 *   request both the student responses and activities from the API,
 *   when they are loaded update store.dashboard and hide the
 *   loadingOverlay
 */
export function requestClassroomStatus(classroomId) {
  return function(dispatch) {
    dispatch(changeLoadingText('Loading Classroom Status View...'))
    dispatch(setLoading())
    axios.all([ api.getClassroomActivities(classroomId),
                api.getClassroomStudentResponseData(classroomId) ])
          .then(axios.spread((activities, student_responses) => {
            dispatch(
              loadClassroomStatus(
                activities.data.activities,
                student_responses.data.student_response_data
              )
            )
            dispatch(clearLoading())
          }))
  }
}

export function searchStudents(query) {
  return {
    type: C.SEARCH_STUDENTS,
    data: {
      query: query
    }
  }
}

export function sortStudents(order) {
  return {
    type: C.SORT_STUDENTS,
    data: {
      order: order
    }
  }
}

export function toggleActivityLock(activity_id, studentIds) {
  return function(dispatch) {
    return api.toggleActivityLock(activity_id, studentIds, (err, resp, body) => {
      dispatch(updateStudentLockedActivities(body));
    });
  }
}

function updateStudentLockedActivities(students) {
  return {
    type: C.UPDATE_STUDENT_LOCKED_ACTIVITIES,
    data: {
      students: students
    }
  }
}

function moveStudents(students) {
  return {
    type: C.MOVE_STUDENTS,
    data: {
      students: students
    }
  }
}

export function requestMoveStudents(classroomId, students, activityId) {
  const updatedStudents = students.map(student => {
    return api.putStudentCurrentActivity(student, activityId)
  })

  return (dispatch) => {
    dispatch(changeLoadingText('Moving Students To New Activity...'))
    dispatch(setLoading())
    axios.all(updatedStudents)
    .then(responses => {
      let successes = responses.filter(response => {
        return response.status === 200
      })
      let students = successes.map(response => {
        return {
          student_id: parseInt(response.data.student_id, 10),
          current_activity_id: response.data.current_activity_id
        }
      })

      dispatch(moveStudents(students))
      dispatch(clearLoading())
    })
  }
}

function updateStudentLanguages(students) {
  return {
    type: C.UPDATE_STUDENTS,
    data: {
      students: students
    }
  }
}

export function requestUpadteStudentsLanguage(studentIds, language_abbv) {
  return function(dispatch) {

    dispatch(setLoading());
    return api.updateStudentsLanguages(studentIds, language_abbv, (err, resp, body) => {
      dispatch(updateStudentLanguages(body));
      dispatch(clearLoading());
    });
  }
}
