import React, { PropTypes } from 'react'

class SortStudents extends React.Component {
  static propTypes = {
    onSortTable: PropTypes.func.isRequired
  }

  render() {
    return (
      <form id='classroom-status-sort-students'>
        <label className='sr-only'>Sort Students By:</label>
        <div className='custom-select classroom-status-sort-students'>
          <select
            defaultValue='a-z'
            onChange={this.props.onSortTable}>
            <option value='a-z'>Name A-Z</option>
            <option value='z-a'>Name Z-A</option>
          </select>
          <span className='custom-select-arrow' aria-hidden='true'>▼</span>
        </div>
      </form>
    )
  }
}

export default SortStudents;
