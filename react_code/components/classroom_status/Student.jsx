import React, { PropTypes } from 'react'

class Student extends React.Component {
  static propTypes = {
    student:            PropTypes.object.isRequired,
    activities:         PropTypes.array.isRequired
  }

  render() {

    let lang = () => {
      if(this.props.student.is_hybrid){
        return(<div className="language-display">Hyb</div>);
      }else if(this.props.student.is_spanish){
        return(<div className="language-display">SPA</div>);
      }else{
        return(<div className="language-display">ENG</div>);
      }
    }
    return (
      <tr className='classroom-status-table-student-row'>
        <th className='classroom-status-table-student-header'>
          <label>
            <input type='checkbox' className='student-checkbox' name='students' value={this.props.student.student_id} />
            {this.props.student.last_name}, {this.props.student.first_name}
          </label>
          {lang()}
        </th>
        {this.props.activities.map(function(activity,index) {
          let key = `${this.props.student.student_id}-${index}-${activity.id}`;
          let response = this.props.student.responses.find((response) => {
            return response.activity_id === activity.id
          })
          if (activity.id === this.props.student.current_activity_id) {
            // this cell is the student's current activity, display a star
            return (
              <td
                key={key}
                className='classroom-status-data status-current'
                onClick={this.props.onLoadStudentResponses(this.props.student.student_id, activity.id)}>
                <span className='fa fa-star' aria-hidden='true'></span>
                <span className='sr-only'>Current Activity</span>
              </td>
            )
          } else if (this.props.student.locked_activities.indexOf(activity.id) >= 0) {
            return (
              <td
                key={key}
                className='classroom-status-data status-locked' >
                <span className='fa fa-lock' aria-hidden='true'></span>
                <span className='sr-only'>Locked Activity</span>
              </td>
            )
          } else if (response === undefined) {
            // this cell has no response data
            var published_class = activity.lesson_published ? "published" : "unpublished";
            return (
              <td
                key={key}
                className={`classroom-status-data ${published_class}`} />
            )
          } else if (response.has_passing_score) {
            // this cell is a passed activity, display a check mark
            return (
              <td
                key={key}
                className='classroom-status-data status-passed'
                onClick={this.props.onLoadStudentResponses(this.props.student.student_id, activity.id)}>
                <span className='fa fa-check' aria-hidden='true'></span>
                <span className='sr-only'>Complete</span>
              </td>
            )
          } else {
            // this cell is an attemtped activity, display attempt count
            return (
              <td
                key={key}
                className='classroom-status-data status-tried'
                onClick={this.props.onLoadStudentResponses(this.props.student.student_id, activity.id)}>
                {response.attempts}
              </td>
            )
          }
        }.bind(this))}
      </tr>
    )
  }
}

export default Student;
