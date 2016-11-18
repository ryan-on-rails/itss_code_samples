import React, { PropTypes} from 'react'
import { Link }            from 'react-router'

class ClassroomUtilities extends React.Component {
  static propTypes = {
    onSelectLoginRoster: PropTypes.func.isRequired
  }

  componentDidMount() {
    // clear the login roster select value so onChange always triggers
    document.getElementById('login-roster-format').selectedIndex = -1
  }

  render() {
    return (
      <ul className='classroom-status-utilities'>
        <li>
          <Link to='/dashboard/reports'>
            <button type='button' className='btn-dashboard btn-gold classroom-status-utility'>
              Reports
            </button>
          </Link>
        </li>
        <li>
          <Link to='/dashboard/resources'>
            <button type='button' className='btn-dashboard btn-gold classroom-status-utility'>
              Course Attachments
            </button>
          </Link>
        </li>
        <li>
          <div className='custom-select btn-login-roster btn-dashboard btn-gold classroom-status-utility'>
            <span className='login-roster-label'>Login Roster</span>
            <select
              onChange={this.props.onSelectLoginRoster}
              id='login-roster-format'
              className='btn-dashboard btn-gold classroom-status-utility'>
              <option value='html'>Printable</option>
              <option value='csv'>CSV</option>
            </select>
          </div>
        </li>
      </ul>
    )
  }
}

export default ClassroomUtilities
