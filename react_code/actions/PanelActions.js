import * as C from '../constants/PanelConstants';

/*
 * action creators
 */

export function setPanelPercentage(percentage) {
  return {
    type: C.SET_PANEL_PERCENTAGE,
    percentage
  };
}

export function startPanelResizing() {
  return { type: C.START_PANEL_RESIZING };
}

export function stopPanelResizing() {
  return { type: C.STOP_PANEL_RESIZING };
}
