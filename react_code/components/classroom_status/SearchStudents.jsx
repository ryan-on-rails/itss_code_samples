import React, { PropTypes } from 'react'

class SearchStudents extends React.Component {
  static propTypes = {
    onSearchTable: PropTypes.func.isRequired
  }

  render() {
    return (
      <form id='classroom-status-search-students' onSubmit={this.props.onSearchTable}>
        <label className='sr-only'>Search Students</label>
        <input name='search' className='form-control' placeholder='Search Students' />
        <button type='button' className='btn-dashboard btn-red-orange' onClick={this.props.onSearchTable}>
          <span className='fa fa-search' aria-hidden='true'></span>
          <span className='sr-only'>Search</span>
        </button>
      </form>
    )
  }
}

export default SearchStudents;
