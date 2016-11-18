import React, { PropTypes } from 'react'

class UnlockStudents extends React.Component {
  static propTypes = {
    onUnlockStudents: PropTypes.func.isRequired
  }

  render() {
    return (
      <button
        onClick={this.props.onUnlockStudents}
        type='button'
        className='btn-dashboard btn-green'>
        <span className='fa fa-lock' aria-hidden='true'></span>
        &nbsp;Unlock Next Locked Activity
      </button>
    )
  }
}

export default UnlockStudents;
