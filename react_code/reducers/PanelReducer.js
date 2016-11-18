import * as C     from '../constants/PanelConstants';

const defaultState = {
  percentage: 50,
  resizing: false
};

export default function panels(state = defaultState, action) {
  switch(action.type) {
    case C.START_PANEL_RESIZING:
      return Object.assign({}, state, { resizing: true });
    case C.STOP_PANEL_RESIZING:
      return Object.assign({}, state, { resizing: false });
    case C.SET_PANEL_PERCENTAGE:
      return Object.assign({}, state, { percentage: action.percentage });
    default:
      return state;
  }
}
