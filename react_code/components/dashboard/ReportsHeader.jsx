import React, { PropTypes } from 'react'
import { Link }             from 'react-router'

class ReportsHeader extends React.Component {
  static propTypes = {
    classroom:    PropTypes.object.isRequired
  }

  render() {
    return (
      <header className='classroom-status-header hidden-print'>
        <h1 className='classroom-status-name'>
          <Link to='/dashboard'>
            <span className='title-inactive'>
              {this.props.classroom.name}
            </span>
          </Link>
          <span className='title-divider'>/</span>
          {this.props.children}
        </h1>
        <ul className='classroom-status-utilities'>
          <li>
            <Link to='/dashboard'>
              <button type='button' className='btn-dashboard btn-gold classroom-status-utility'>
                Student Status Table
              </button>
            </Link>
          </li>
          <li>
            <button onClick={(e) => {document.title=this.props.classroom.name; window.print(); document.title='ITSS | Intelligent Tutoring for the Structure Strategy'}} type='button' className='btn-dashboard btn-green classroom-status-utility'>
              Print
            </button>
          </li>
        </ul>
        <div className="clearfix"></div>
      </header>
    )
  }
}

export default ReportsHeader


