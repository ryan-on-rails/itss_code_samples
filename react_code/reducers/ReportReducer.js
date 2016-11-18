import * as C from '../constants/ReportConstants'

export default function report(state = {
                                 name: '',
                                 type: '',
                                 data: []
                               }, action) {
  switch(action.type) {
    case C.LOAD_REPORT:
      const report = action.data.report
      return report
    default:
      return state
  }
}

