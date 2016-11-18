import React, { PropTypes }  from 'react'
import { connect }           from 'react-redux'
import ClassroomStatus       from '../components/ClassroomStatus'
import Responses             from '../components/classroom_status/Responses'
import LoadingOverlay        from '../components/LoadingOverlay'
import * as DashboardActions from '../actions/DashboardActions';
import * as ResponsesActions from '../actions/ResponsesActions';
import api                   from '../lib/API'
import * as CSV              from '../lib/CSV'

class ClassroomStatusContainer extends React.Component {
  constructor(props) {
    super(props);

    this.props.requestClassroomStatus(this.props.teacher.classroom_id)

    this.handleSearchTable            = this.handleSearchTable.bind(this)
    this.handleUnlockStudents         = this.handleUnlockStudents.bind(this)
    this.handleSortTable              = this.handleSortTable.bind(this)
    this.handleMoveStudents           = this.handleMoveStudents.bind(this)
    this.handleStudentsChangeLanguage = this.handleStudentsChangeLanguage.bind(this)
    this.handleRefreshStudents        = this.handleRefreshStudents.bind(this)
    this.handleUnlockStudents         = this.handleUnlockStudents.bind(this)
    this.handleSelectAllStudents      = this.handleSelectAllStudents.bind(this)
    this.handleSelectLoginRoster      = this.handleSelectLoginRoster.bind(this)
    this.handleLoadStudentResponses   = this.handleLoadStudentResponses.bind(this)
  }

 /* handleSearchTable
  *   pulls a query string from the search field and passes it to
  *   store.dashboard.studentsSearchFilter
  */
  handleSearchTable(event) {
    event.preventDefault()
    let query = $('#classroom-status-search-students [name=search]').val()
    this.props.searchStudents(query)
  }

 /* handleSortTable
  *   pulls the order from the sort dropdown and passes it to
  *   store.dashboard.studentsSortFilter
  */
  handleSortTable(event) {
    let order = event.target.value
    this.props.sortStudents(order)
  }

  /* [ TODO ]
   * move these sort definitions to a Student model?
   */
  sortStudentAlphabeticalAsc(a, b) {
    if      (a.last_name < b.last_name)   return -1;
    else if (a.last_name > b.last_name)   return  1;
    else if (a.first_name < b.first_name) return -1;
    else if (a.first_name > b.first_name) return  1;
    else    return 0;
  }

  sortStudentAlphabeticalDes(a, b) {
    if      (a.last_name > b.last_name)   return -1;
    else if (a.last_name < b.last_name)   return  1;
    else if (a.first_name > b.first_name) return -1;
    else if (a.first_name < b.first_name) return  1;
    else    return 0;
  }

 /* filteredStudents
  *   narrows down the students to be displayed by applying the
  *   studentsSearchFilter and then sorts them by the studentsSortFilter
  */
  filteredStudents() {
    let students = this.props.students

    if (this.props.studentsSearchFilter === '') {
      students = students.list
    } else {
      students = students.search(this.props.studentsSearchFilter)
    }
    // students is now an array, not a Fuse object

    switch(this.props.studentsSortFilter) {
      case 'a-z':
        students = students.sort(this.sortStudentAlphabeticalAsc)
        break;
      case 'z-a':
        students = students.sort(this.sortStudentAlphabeticalDes)
        break;
      default:
        students
    }

    return students
  }

 /* handleMoveStudents
  *   [ TODO ]
  *   calls the api to set each selected students current activity to
  *   the activity chosen in the MoveStudent dropdown
  */
  handleMoveStudents(event) {
    let activity = $('#classroom-status-student-activities [name=activity]').val()
    if(typeof activity == "undefined" || activity == null){ return false;}
    let selectedStudents = $('.student-checkbox:checked').get()
                            .map(student => {
                              student.checked = false;
                              return student.value
                            })
    this.props.requestMoveStudents(this.props.teacher.classroom_id, selectedStudents, activity)
  }


  /* handleMoveStudents

  */
  handleStudentsChangeLanguage(event) {
    let language_abbv = $('.classroom-status-reassign-langauge select.langauge').val()
    if(typeof language_abbv == "undefined" || language_abbv == null){ return false;}
    let student_ids = $('.student-checkbox:checked').get()
                            .map(student => {
                              return student.value
                            });

    if(typeof student_ids == "undefined" || student_ids.length == 0){ return false;}
    this.props.requestUpadteStudentsLanguage(student_ids, language_abbv)
  }

  /* handleRefreshStudents
  *   calls the api to refresh the list of students
  */
  handleRefreshStudents(event) {
    this.props.requestClassroomStatus(this.props.teacher.classroom_id);
  }

 /* handleUnlockStudents
  *   [ TODO ]
  *   calls the api to unlock the next activity for each selected student
  */
  handleUnlockStudents(event) {
    const { dispatch, state } = this.props;
    let activity_id = $('#classroom-status-student-activities [name=activity]').val()
    let selectedStudentIds = $('.student-checkbox:checked').get()
                            .map(student => {
                              return student.value
                            })
    this.props.handleUnlockStudents(activity_id, selectedStudentIds);

  }

 /* handleSelectAllStudents
  *   when the checkbox this is bound to is toggled, it changes all of
  *   the student checkboxes in the table to match its state
  */
  handleSelectAllStudents(event) {
    let checkboxes = $('.student-checkbox');
    if (event.target.checked) {
      checkboxes.prop("checked", true)
    } else {
      checkboxes.prop("checked", false)
    }
  }

 /* handleSelectLoginRoster
  *   when Login Roster is clicked the user is given a choice of formats.
  *   this determines whether they are taken to the login roster page
  *   or if they are just given a CSV file
  */
  handleSelectLoginRoster(event) {
    let format = event.target.value

    if (format === 'html') {
      this.context.router.push('/dashboard/login-roster')
    } else if (format === 'csv') {
      const classroom = this.props.teacher.classroom_id
      // fetch the login roster json data from the api
      api.getLoginRoster(classroom)
        .then((response) => {
          // parse JSON to a CSV
          const csv = CSV.parseJSON(response.data)
          // auto download it
          CSV.sendDownload(csv, `classroom-${classroom}-login-roster.csv`)
        })
    }
    $("#login-roster-format").val('');
  }

  /* handleLoadStudentResponses
   *   creates an event handler that looks up the student responses
   *   for the given student id, then opens the student-responses-modal
   */
  handleLoadStudentResponses(studentId, activityId) {
    return (event) => {
      this.props.requestStudentResponses(studentId, activityId)
      $('.btn-model').removeClass('active')
      $('#student-responses-modal').modal()
    }
  }

  render() {
    return (
      <div className="itss-dashboard-classroom-status">
        <ClassroomStatus
          handleSortTable={this.handleSortTable}
          handleSearchTable={this.handleSearchTable}
          handleMoveStudents={this.handleMoveStudents}
          handleUnlockStudents={this.handleUnlockStudents}
          handleSelectAllStudents={this.handleSelectAllStudents}
          handleSelectLoginRoster={this.handleSelectLoginRoster}
          handleRefreshStudents={this.handleRefreshStudents}
          handleLoadStudentResponses={this.handleLoadStudentResponses}
          handleStudentsChangeLanguage={this.handleStudentsChangeLanguage}
          teacher={this.props.teacher}
          structures={this.props.structures}
          lessons={this.props.lessons}
          activities={this.props.activities}
          students={this.filteredStudents()} />
        <Responses />
        <LoadingOverlay loading={this.props.contentLoading}>
          <span>{this.props.loadingText}</span>
        </LoadingOverlay>
      </div>
    )
  }
}

ClassroomStatusContainer.contextTypes = {
  router: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    teacher:    state.user,
    structures: state.dashboard.structures,
    lessons:    state.dashboard.lessons,
    activities: state.dashboard.activities,
    students:   state.dashboard.students,
    studentsSearchFilter: state.dashboard.studentsSearchFilter,
    studentsSortFilter:   state.dashboard.studentsSortFilter,
    loadingText:          state.dashboard.loadingText,
    contentLoading:       state.contentLoading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestClassroomStatus: (classroomId) => {
      dispatch(DashboardActions.requestClassroomStatus(classroomId))
    },
    searchStudents: (query) => {
      dispatch(DashboardActions.searchStudents(query))
    },
    handleUnlockStudents: (activity_id, selectedStudentIds) => {
      dispatch(DashboardActions.toggleActivityLock(activity_id, selectedStudentIds));
    },
    sortStudents: (query) => {
      dispatch(DashboardActions.sortStudents(query))
    },
    requestMoveStudents: (classroomId, students, activityId) => {
      dispatch(DashboardActions.requestMoveStudents(classroomId, students, activityId))
    },
    requestUpadteStudentsLanguage: (student_ids, language_abbv) => {
      dispatch(DashboardActions.requestUpadteStudentsLanguage(student_ids, language_abbv))
    },
    requestStudentResponses: (studentId, activityId) => {
      dispatch(ResponsesActions.requestStudentResponses(studentId, activityId))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassroomStatusContainer)
