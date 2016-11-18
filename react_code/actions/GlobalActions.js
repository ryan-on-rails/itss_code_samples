import api                  from '../lib/API';
import * as C               from '../constants/GlobalConstants';
import * as ActivityActions from '../actions/ActivityActions';

/*
 * action creators
 */

export function setLoading() {
  return {
    type: C.CONTENT_LOADING
  }
}

export function clearLoading() {
  return {
    type: C.CONTENT_LOADED
  }
}

export function receiveUser(data) {
  return {
    type: C.RECEIVE_USER,
    data: data
  };
}
export function setActivity(activity) {
  return {
    type: C.SET_ACTIVITY,
    activity: activity
  };
}

function setPage(page) {
  return {
    type: C.SET_PAGE,
    page: page
  };
}

function addArticle() {
  return {
    type: C.ADD_ARTICLE
  };
}

function clearResponses() {
  return {
    type: C.CLEAR_RESPONSES
  };
}

function showCheckpoint(lesson) {
  return {
    type: C.SHOW_CHECKPOINT,
    lesson: lesson
  };
}

function dispatchShowCheckpoint(lesson) {
  return function(dispatch) {
    return dispatch(showCheckpoint(lesson));
  };
}

function requestLesson() {
  return {
    type: C.REQUEST_LESSON
  };
}

function getNextLesson() {
  return function(dispatch) {
    // Indicate that lesson is being fetched
    dispatch(requestLesson());

    return api.getCurrentLesson((err, resp, body) => {
      body.lesson.showCheckpoint =false;
      dispatch(setLesson(body));
      dispatch(ActivityActions.setNextInstruction(false));
    });
  }
}

export function setUserLesson(id) {
  return function(dispatch) {
    return api.setUserLesson(id, (err, resp, body) => {
      dispatch(getNextLesson());
    });
  }
}
export function getPage(id) {
  return function(dispatch) {
    dispatch(setLoading());
    return api.getPage(id, (err, resp, body) => {
      dispatch(receivePage(body));
      dispatch(clearLoading());
    });
  }
}
function receivePage(page) {
  return {
    type: C.RECEIVE_PAGE,
    data: page
  };
}
function requestingPage(page_id) {
  return {
    type: C.REQUESTING_PAGE,
    data: page_id
  };
}

export function clearUserResponses(activity_id) {
  return function(dispatch) {
    return api.clearUserResponses(activity_id, (err, resp, body) => {
      if(resp.statusCode >= 200 && resp.statusCode < 300) {
        alert("Responses cleared successfully!");
      }

      // TODO: Does this do anything?
      dispatch(clearResponses());
    });
  }
}

export function setUserActivity(id, lesson) {
  return function(dispatch) {
    // We need to search the current lesson's
    // pages for the selected activity, as this is
    // where the full data resides
    lesson.pages.forEach(page => {
      page.activities.forEach(activity => {
        if(activity.id === id) {

          // First set the new page
          dispatch(setPage(page));

          // Then update the user's current activity
          // and set the activity state
          return api.setUserActivity(activity.id, (err, resp, body) => {
            dispatch(setActivity(activity));
            dispatch(ActivityActions.setNextInstruction());
          });
        }
      });
    });
  }
}

function setLesson(state) {
  return {
    type: C.SET_LESSON,
    data: state
  };
}

export function moveForward({ activity, page, lesson }) {
  if(!activity.last_on_page) {
    let nextAct = page.activities.find((a) => a.id === activity.next_activity_id);
    return setActivity(nextAct);
  } else if(page.next_page_id) {
    return getPage(page.next_page_id);
  } else if(lesson.checkpoint && !lesson.showCheckpoint) {
    return dispatchShowCheckpoint(lesson);
  } else if(lesson.default_next_lesson_id) {
    return getNextLesson();
  } else {
    throw 'Nowhere to go!';
  }
}
