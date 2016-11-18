import React, { PropTypes } from 'react'
import Student              from './Student'
import { flattenArray }     from '../../lib/AppUtils'

class StudentTable extends React.Component {
  static propTypes = {
    structures: PropTypes.array.isRequired,
    lessons:    PropTypes.array.isRequired,
    activities: PropTypes.array.isRequired,
    students:   PropTypes.array.isRequired
  }

  render() {
    return (
      <div className='scroll-wrapper classroom-status-table-scroll-wrapper'>
        <table id='classroom-status-table'>
          <thead>
            <tr>
              <th className='sr-only classroom-status-table-students-col'>Students</th>
              {this.props.structures.map((structure) => {
                return structure.lessons.map((lesson) => {
                  var published_class = lesson.lesson_published ? "published" : "unpublished";
                  return (
                    <th
                      key={lesson.lesson_id}
                      colSpan={lesson.activities.length}
                      className={`classroom-status-table-lesson-header ${published_class}`}>
                      {structure.structure_name + ' - ' + lesson.lesson_title}
                      <br/>
                      {(lesson.lesson_published ? "" : "Unpublished")}
                    </th>
                  )
                }).reduce(flattenArray, [])
              }).reduce(flattenArray, [])}
            </tr>
            <tr>
              <td></td>
              {this.props.lessons.map((lesson) => {
                return lesson.activities
                         .map((activity, lesson_index) => {
                           return (
                             <th
                               key={activity.id}
                               className='classroom-status-table-activity-header'>
                               {lesson_index+1}
                             </th>
                           )
                         })
                         .reduce(flattenArray, [])
                })}
            </tr>
          </thead>
          <tbody>
            {this.props.students.map(function(student) {
              return <Student key={student.student_id}
                              onLoadStudentResponses={this.props.handleLoadStudentResponses}
                              student={student}
                              activities={this.props.activities} />
            }.bind(this))}
          </tbody>
        </table>
        <div className='classroom-status-select-all'>
          <input
            onChange={this.props.onSelectAllStudents}
            type='checkbox'
            name='student-all-checkbox'
            className='select-all-checkbox' />
          SELECT ALL
        </div>
      </div>
    )
  }
}

export default StudentTable
