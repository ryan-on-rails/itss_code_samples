import api    from '../lib/API';
import * as C from '../constants/UserConstants';

/*
 * action creators
 */

function _setWatchedIntro() {
  return { type: C.SET_WATCHED_INTRO };
}

export function setWatchedIntro() {
  return function(dispatch) {
    dispatch(_setWatchedIntro());
    return api.updateUser({ watched_intro: true }, (err, resp, body) => {});
  }
}
export function setPreferredLanguage(data) {
  return {
    type: C.SET_PREFERRED_LANGUAGE,
    data: data
  };
}
export function setMonologueReplay(boolean) {
  return {
    type: C.SET_MONOLOGUE_REPLAY,
    data: boolean
  };
}
