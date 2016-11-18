import React, { PropTypes } from 'react'
import { Link }             from 'react-router'
import LoadingOverlay       from '../LoadingOverlay'
import ReportsHeader        from './ReportsHeader'

class LoginRoster extends React.Component {
  static propTypes = {
    classroom: PropTypes.number.isRequired,
    report:    PropTypes.object.isRequired
  }

  render() {
    if ( this.props.report.type !== 'login-roster' ) {
      // the loaded report is incorrect so don't try to render
      // it with incorrect data
      return (
        <div className="itss-dashboard-report">
          <LoadingOverlay loading={this.props.contentLoading}>
            <span>Generating Report...</span>
          </LoadingOverlay>
        </div>
      )
    } else {
      return (
        <div className="itss-dashboard-login-roster">
          <ReportsHeader classroom={this.props.classroom}>
            Login Roster
          </ReportsHeader>
          <header className="visible-print-block">
            <h2 className="classroom-status-name">
              Student Login Roster for Classroom {this.props.classroom}
            </h2>
          </header>
          <main className="dashboard-body">
            <div className="itss-dashboard-report">
              {this.props.report.data.map((student) => {
                return (
                  <div key={student.username} className="report-row">
                    <ul className="report-student">
                      <li>{`${student.last_name}, ${student.first_name}`}</li>
                      <li>
                        (<span className="report-green">Username:</span> <span className="report-turq">{`${student.username}`}</span>
                      </li>
                      <li>
                        <span className="report-green">Password:</span> <span className="report-turq">{`${student.password}`}</span>)
                      </li>
                      <li>--</li>
                      <li>
                        Lesson: <span className="report-turq">{student.lesson}</span>, Page: <span className="report-turq">{student.page_number}</span>
                      </li>
                    </ul>
                  </div>
                )
              })}
          </div>
          </main>
          <LoadingOverlay loading={this.props.contentLoading}>
            <span>Generating Login Roster...</span>
          </LoadingOverlay>
        </div>
      )
    }
  }
}

export default LoginRoster
