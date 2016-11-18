import React, { PropTypes } from 'react'

class TeacherDashboard extends React.Component {

  componentDidMount() {
    $('html').addClass('dashboard')
  }

  render() {
    return (
      <div className="itss-dashboard">
        {this.props.children}
      </div>
    )
  }
}

export default TeacherDashboard
