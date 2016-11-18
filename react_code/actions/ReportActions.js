import { setLoading, clearLoading } from './GlobalActions'
import api                          from '../lib/API'
import * as C                       from '../constants/ReportConstants'

export function requestLoginRoster(classroom) {
  return function(dispatch) {
    dispatch(setLoading())
    api.getLoginRoster(classroom)
      .then((response) => {
        dispatch(loadReport({ name: 'Login Roster',
                              type: 'login-roster',
                              data: response.data }))
        dispatch(clearLoading())
      })
  }
}

export function requestReport(classroom, report) {
  const reportName = mapSlugToName(report)

  return function(dispatch) {
    dispatch(setLoading())
    api.getReport(classroom, report)
      .then((response) => {
        dispatch(loadReport({ name: reportName, type: report, data: response.data.report_data }))
        dispatch(clearLoading())
      })
  }
}

/* mapSlugToName
 *   returns a report title based on the different report slugs
 *   hopefully this could be something on a Report model in the future
 */
function mapSlugToName(reportSlug) {
   switch(reportSlug) {
    case 'high-score':
      return 'High Score Report'
    case 'gaming':
      return 'Gaming Report'
    case 'main-idea-scores':
      return 'Main Idea Scores Report'
    case 'recent-responses':
      return 'Recent Responses Report'
    default:
      return 'Report'
  }
}

function loadReport(report) {
  return {
    type: C.LOAD_REPORT,
    data: {
      report: report
    }
  }
}
