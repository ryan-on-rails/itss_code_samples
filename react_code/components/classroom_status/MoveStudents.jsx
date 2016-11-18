import React, { PropTypes } from 'react'
import { flattenArray }     from '../../lib/AppUtils'

class MoveStudents extends React.Component {
  static propTypes = {
    onRefreshStudents: PropTypes.func.isRequired,
    onMoveStudents: PropTypes.func.isRequired,
    lessons:        PropTypes.array.isRequired
  }

  render() {
    return (
      <div className='classroom-status-move-students-group'>
        <button
          onClick={this.props.onRefreshStudents}
          type='button'
          className='btn-dashboard btn-red-orange submit'>
          <span className='fa fa-refresh' aria-hidden='true'></span>
          <span className='sr-only'>refresh</span>
        </button>
        <div className='custom-select custom-select-turq classroom-status-move-students'>
          <select name='activity' defaultValue=''>
            <option disabled value=''>Select Activity</option>
            {this.props.lessons.map((lesson) => {
              var disabled = lesson.lesson_published ? "" : "disabled";
              return lesson.activities
                       .reduce((cells, activity, lesson_index) => {
                         return cells.concat(
                           <option value={activity.id} disabled={!lesson.lesson_published}>
                             {lesson.lesson_title+' - Activity '+(lesson_index+1)}
                           </option>
                         )
                        }, [])
            })}
          </select>
          <span className='custom-select-arrow' aria-hidden='true'>▼</span>
        </div>
        <button
          onClick={this.props.onMoveStudents}
          type='button'
          className='btn-dashboard btn-red-orange submit'>
          <span className='fa fa-check' aria-hidden='true'></span>
          <span className='sr-only'>Save</span>
          Move Selected Students
        </button>
        <button
          onClick={this.props.onUnlockStudents}
          type='button'
          className='btn-dashboard btn-green'>
          <span className='fa fa-lock' aria-hidden='true'></span>
          &nbsp;Toggle Activity Lock
        </button>

        <div className='custom-select custom-select-turq classroom-status-reassign-langauge'>
          <select name='langauge' defaultValue='' className='langauge'>
            <option disabled value=''>Reassign Language</option>
            <option value='en'>English</option>
            <option value='es'>Spanish</option>
            <option value='hybrid'>Hybrid</option>
          </select>
          <span className='custom-select-arrow' aria-hidden='true'>▼</span>
        </div>
        <button
          onClick={this.props.handleStudentsChangeLanguage}
          type='button'
          className='btn-dashboard btn-red-orange submit'>
          <span className='fa fa-check' aria-hidden='true'></span>
          <span className='sr-only'>Save</span>
        </button>
      </div>
    )
  }
}

export default MoveStudents;
