import React, { PropTypes } from 'react'
import { connect }          from 'react-redux'
import LoginRoster          from '../components/dashboard/LoginRoster'
import * as ReportActions   from '../actions/ReportActions'

class LoginRosterContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.requestLoginRoster(this.props.classroom)
  }

  render() {
    return (
      <LoginRoster
        contentLoading={this.props.contentLoading}
        classroom={this.props.classroom}
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
    requestLoginRoster: (classroom) => {
      dispatch(ReportActions.requestLoginRoster(classroom))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginRosterContainer)

