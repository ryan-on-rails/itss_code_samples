import React              from 'react'
import { connect }        from 'react-redux'
import Report             from '../components/dashboard/Report'
import * as ReportActions from '../actions/ReportActions'

class ReportContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.requestReport(this.props.classroom,
                             this.props.params.reportType)
  }

  /*
   *  request a new report whenever the route changes, even if the
   *  component isn't reloaded. since the login roster data is also
   *  stored in state.dashboard.report we also need to re-request the
   *  report if it has been loaded
   */
  componentWillUpdate(next) {
    if ( next.contentLoading !== this.props.contentLoading ) {
      // don't request a new report if just showing the loading wheel
    } else if ( this.props.report.type === 'login-roster' ||
                (next.params.reportType !== this.props.params.reportType) ) {
      this.props.requestReport(next.classroom,
                               next.params.reportType)
    }
  }

  render() {
    return (
      <Report
        contentLoading={this.props.contentLoading}
        classroom={this.props.classroom}
        type={this.props.params.reportType}
        report={this.props.report} />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    contentLoading: state.contentLoading,
    classroom:      state.user.classroom_id,
    report:         state.dashboard.report
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestReport: (classroom, report) => {
      dispatch(ReportActions.requestReport(classroom, report))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportContainer)
