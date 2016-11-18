import React, { PropTypes } from 'react'
import { connect }          from 'react-redux'
import Reports              from '../components/dashboard/Reports'
import api                  from '../lib/API'
import * as CSV             from '../lib/CSV'
import { parseReport }      from '../lib/DashboardUtils'

class ReportsContainer extends React.Component {
  constructor(props) {
    super(props)

    this.handleLoadReport = this.handleLoadReport.bind(this)
  }

  handleInvalidReport() {
    const report = $('#report-type').val()
    const format = $('#report-format').val()
    const button = $('#generate-report')

    button.removeClass('btn-disabled');

    if ( (report === 'recent-responses' || report === 'main-idea-scores')
          && format === 'csv' ) {
      button.addClass('btn-disabled');
      button.prop('disabled', true);
    } else {
      button.prop('disabled', false);
    }
  }

  handleLoadReport() {
    const report = $('#report-type').val()
    const format = $('#report-format').val()

    if (format === 'html') {
      this.context.router.push(`/dashboard/reports/${report}`)
    } else if (format === 'csv' && report !== 'recent-responses') {
      // fetch the report json data from the api
      api.getReport(this.props.classroom, report)
        .then(response => {
          // flatten api data to single rows
          const report_data = parseReport(response.data.report_data, report)
          // parse JSON to a CSV
          const csv = CSV.parseJSON(report_data)
          // auto download it
          CSV.sendDownload(csv, `classroom-${this.props.classroom}-${report}.csv`)
        })
    }
  }

  render() {
    return (
      <div className="itss-dashboard-reports">
        <Reports
          onInvalidReport={this.handleInvalidReport}
          onLoadReport={this.handleLoadReport}
          classroom={this.props.classroom}>
          {this.props.children}
        </Reports>
      </div>
    )
  }
}

ReportsContainer.contextTypes = {
  router: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    classroom: state.user.classroom
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportsContainer)
