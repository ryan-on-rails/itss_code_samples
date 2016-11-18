import React, { PropTypes } from 'react'
import { Link }             from 'react-router'
import ReportsHeader        from './ReportsHeader'

class Reports extends React.Component {
  static propTypes = {
    onInvalidReport: PropTypes.func.isRequired,
    onLoadReport:    PropTypes.func.isRequired,
    classroom:       PropTypes.object.isRequired
  }

  render() {
    return (
      <div>
        <ReportsHeader classroom={this.props.classroom}>
          Reports
        </ReportsHeader>
        <div className='dashboard-body'>
          <form id='generate-report-form' className='text-right hidden-print'>
            <div className='report-select-group'>
              <label className='report-select-label' for='report-type'>Report:</label>
              <div className='custom-select report-select'>
                <select
                  id='report-type'
                  name='report-type'
                  onChange={this.props.onInvalidReport}
                  defaultValue='high-score'>
                  <option value='high-score'>High Score Report</option>
                  <option value='gaming'>Gaming Report</option>
                  <option value='main-idea-scores'>Main Idea Scores Report</option>
                  <option value='recent-responses'>Recent Responses Report</option>
                </select>
                <span className='custom-select-arrow' aria-hidden='true'>▼</span>
              </div>
              <label className='report-select-label' for='format'>Format:</label>
              <div className='custom-select report-select report-format-select'>
                <select
                  id='report-format'
                  name='format'
                  onChange={this.props.onInvalidReport}
                  defaultValue='html'>
                  <option value='html'>Printable</option>
                  <option value='csv'>CSV</option>
                </select>
                <span className='custom-select-arrow' aria-hidden='true'>▼</span>
              </div>
              <button
                id='generate-report'
                onClick={this.props.onLoadReport}
                type='button'
                className='btn-dashboard btn-red-orange submit'>
                Generate Report
              </button>
            </div>
          </form>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Reports

