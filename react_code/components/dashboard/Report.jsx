import React, { PropTypes } from 'react'
import LoadingOverlay       from '../LoadingOverlay'
import HighScoreData        from './reports/HighScoreData'
import GamingData           from './reports/GamingData'
import MainIdeaData         from './reports/MainIdeaData'
import RecentResponsesData  from './reports/RecentResponsesData'

class Report extends React.Component {
  static propTypes = {
    classroom: PropTypes.number.isRequired,
    type:      PropTypes.string.isRequired,
    report:    PropTypes.object.isRequired
  }

  // render report specific bodies
  renderData(type, student) {
    if ( type === 'high-score' ) {
      return (
        <HighScoreData
          questions={student.questions}
          gaming={student.gaming} />
      )
    } else if ( type === 'gaming' ) {
      return (
        <GamingData
          gaming={student.gaming} />
      )
    } else if ( type === 'main-idea-scores' ) {
      return (
        <MainIdeaData
          questions={student.main_idea_questions} />
      )
    } else if ( type === 'recent-responses' ) {
      return (
        <RecentResponsesData
          activity={student.activity}
          modelResponse={student.model_response}
          responses={student.responses} />
      )
    }
  }

  render() {
    if ( this.props.type !== this.props.report.type ) {
      // the loaded report is incorrect so don't try to render
      // it with incorrect data
      return (
        <div className="itss-dashboard-report">
          <LoadingOverlay loading={this.props.contentLoading}>
            <span>Generating Report...</span>
          </LoadingOverlay>
        </div>
      )
    } else if(this.props.report.data.length <= 0){
      return(<div className="no-report-data" ><h4>No Data Available</h4></div>);
    } else {
      return (
        <div className="itss-dashboard-report">
          <header className="report-header visible-print-block">
            <h2 className="classroom-status-name">
              {this.props.report.name} for Classroom {this.props.classroom}
            </h2>
          </header>
          <div className="itss-dashboard-report-data">
            {this.props.report.data.map(student => {
              const studentInfo = student.student_info
              return (
                <div key={studentInfo.username} className="report-row">
                  <ul className="report-student">
                    <li>{`${studentInfo.last_name}, ${studentInfo.first_name}`}</li>
                    <li>
                      (<span className="report-turq">{`${studentInfo.username}`}</span>)
                    </li>
                    <li>--</li>
                    <li>
                      Lesson: <span className="report-turq">{studentInfo.lesson}</span>, Page: <span className="report-turq">{studentInfo.page_number}</span>
                    </li>
                  </ul>
                  {this.renderData(this.props.report.type, student)}
                </div>
              )
            })}
          </div>
          <LoadingOverlay loading={this.props.contentLoading}>
            <span>Generating Report...</span>
          </LoadingOverlay>
        </div>
      )
    }
  }
}

export default Report
