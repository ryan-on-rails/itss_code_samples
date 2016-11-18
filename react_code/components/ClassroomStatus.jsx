import React, { PropTypes }  from 'react';
import ClassroomChooser       from './admin_components/ClassroomChooser';
import { ClassroomUtilities,
         SortStudents,
         SearchStudents,
         MoveStudents,
         UnlockStudents,
         StudentTable      } from './classroom_status'

class ClassroomStatus extends React.Component {
  constructor(props) {
    super(props);

  }
  static propTypes = {
    handleSortTable:         PropTypes.func.isRequired,
    handleSearchTable:       PropTypes.func.isRequired,
    handleMoveStudents:      PropTypes.func.isRequired,
    handleUnlockStudents:    PropTypes.func.isRequired,
    handleSelectAllStudents: PropTypes.func.isRequired,
    handleSelectLoginRoster: PropTypes.func.isRequired,
    handleRefreshStudents:   PropTypes.func.isRequired,
    teacher:                 PropTypes.object.isRequired,
    structures:              PropTypes.array.isRequired,
    lessons:                 PropTypes.array.isRequired,
    activities:              PropTypes.array.isRequired,
    students:                PropTypes.array.isRequired
  }

  render() {
    return (
      <main id='classroom-status'>
        <header className='classroom-status-header'>
          <h1 className={`classroom-status-name classroom_id-${this.props.teacher.classroom_id}`}>{this.props.teacher.classroom.name}</h1>
          <ClassroomUtilities
            onSelectLoginRoster={this.props.handleSelectLoginRoster} />
          <ClassroomChooser />
          <div className="clearfix"></div>
        </header>
        <div className='dashboard-body classroom-status-body'>
          <div className='form-group classroom-status-form-left'>
            <SortStudents onSortTable={this.props.handleSortTable} />
            <SearchStudents onSearchTable={this.props.handleSearchTable} />
          </div>
          <form id='classroom-status-student-activities'>
            <div className='form-group classroom-status-form-right'>
              <MoveStudents
                onMoveStudents={this.props.handleMoveStudents}
                handleStudentsChangeLanguage={this.props.handleStudentsChangeLanguage}
                lessons={this.props.lessons} 
                onUnlockStudents={this.props.handleUnlockStudents}
                onRefreshStudents={this.props.handleRefreshStudents}
                />
            </div>
            <StudentTable
              onSelectAllStudents={this.props.handleSelectAllStudents}
              handleLoadStudentResponses={this.props.handleLoadStudentResponses}
              structures={this.props.structures}
              lessons={this.props.lessons}
              activities={this.props.activities}
              students={this.props.students} />
          </form>
        </div>
      </main>
    )
  }
}

export default ClassroomStatus;
