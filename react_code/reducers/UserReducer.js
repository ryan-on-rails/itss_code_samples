import * as C from '../constants/UserConstants';

export default function user(state = {}, action) {
  const { type, data } = action;

  switch(type) {
    case C.SET_WATCHED_INTRO:
      return Object.assign({}, state, { watched_intro: true });

    case C.SET_PREFERRED_LANGUAGE:
      state.preferred_language = data;
      return Object.assign({}, state, { state });

    case C.SET_MONOLOGUE_REPLAY:
      state.replay_monologue = data.replay;
      state.preferred_language = data.language;
      return Object.assign({}, state, { state });

    default:
      return state;
  }
}
