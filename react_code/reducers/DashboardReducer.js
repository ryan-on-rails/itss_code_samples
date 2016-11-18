import Fuse                from 'fuse.js'
import report              from './ReportReducer';
import resources           from './ResourcesReducer';
import responses           from './ResponsesReducer';
import * as C              from '../constants/DashboardConstants'
import * as DashboardUtils from '../lib/DashboardUtils'

export default function dashboard(state = {
                                    structures: [],
                                    lessons:    [],
                                    activities: [],
                                    students:   new Fuse([]),
                                    studentsSearchFilter: '',
                                    studentsSortFilter:   'a-z',
                                    loadingText: 'Loading Classroom Status View...'
                                  }, action) {
  return Object.assign(
    dashboardReducer(state, action),
    { report: report(state.report, action) },
    { resources: resources(state.resources, action) },
    { responses: responses(state.responses, action) }
  )
}

function dashboardReducer(state = {}, action) {
  switch(action.type) {
    case C.CHANGE_LOADING_TEXT:
      return Object.assign( {}, state,
        {
          loadingText: action.data.text
        }
      )
    case C.LOAD_CLASSROOM_STATUS:
      const {
        structures,
        lessons,
        activities
      } = DashboardUtils.parseStructures(action.data.structures)

      let {
        students
      } = DashboardUtils.parseStudents(action.data.students)
      students = new Fuse(students,
                          { keys: ['first_name', 'last_name'] })

      return Object.assign( {}, state,
        {
          structures: structures,
          lessons:    lessons,
          activities: activities,
          students:   students
        }
      )
    case C.SEARCH_STUDENTS:
      const query = action.data.query

      return Object.assign( {}, state,
        {
          studentsSearchFilter: query
        }
      )
    case C.UPDATE_STUDENT_LOCKED_ACTIVITIES:
      let new_students = action.data.students;
      let current_students = state.students.list;
      for (var key in new_students) {
        let lockedActivities = new_students[key];
        let index = current_students.findIndex((student) => {
          return student.student_id.toString() === key.toString(); 
        });
        if ( index >= 0 ) { current_students[index].locked_activities = lockedActivities; }
      }
      current_students = new Fuse(current_students, { keys: ['first_name', 'last_name'] });
      return Object.assign( {}, state,
        {
          students: current_students
        }
      )
    case C.SORT_STUDENTS:
      const order = action.data.order

      return Object.assign( {}, state,
        {
          studentsSortFilter: order
        }
      )
    case C.UPDATE_STUDENTS:
      let _students =  state.students.list;
      let updated_students =  action.data.students;

      updated_students.forEach((student)=>{
        _students = _students.map(function(_student){
          if(_student.student_id == student.student_id){
            return student;
          }else{
            return _student;
          }
        });
      });
      _students = new Fuse(_students, { keys: ['first_name', 'last_name'] })
      return Object.assign({}, state, { students: _students});

    case C.MOVE_STUDENTS:
      const newStudentData = action.data.students
      let moveStudents = state.students.list

      newStudentData.forEach(newData => {
        const index = moveStudents.findIndex(student => {
          return student.student_id === newData.student_id
        })

        if ( index !== -1 ) {
          // update the student with the new current activity
          let student = moveStudents[index]
          student.current_activity_id = newData.current_activity_id
          moveStudents[index] = student
        }
      })

      moveStudents = new Fuse(moveStudents,
                              { keys: ['first_name', 'last_name'] })

      return Object.assign( {}, state,
        {
          students: moveStudents
        }
      )
    default:
      return state
  }
}
