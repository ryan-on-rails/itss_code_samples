import * as C                       from '../constants/AdminConstants';
import * as DashboardActions        from '../actions/DashboardActions';
import * as FeedbackActions         from '../actions/FeedbackActions';
import * as LessonActions           from '../actions/LessonActions';
import { setLoading, clearLoading, receiveUser } from './GlobalActions';
import api                          from '../lib/API';

/*
 * action creators
 */

export function requestingLessonData(data) {
  return {
    type: C.REQUESTING_LESSON_DATA,
    data: data
  };
}
export function receiveLessonData(data, dispatch) {
  return {
    type: C.RECEIVE_LESSON_DATA,
    data: data
  };
}
export function lessonDataReceived() {
  return {
    type: C.LESSON_DATA_RECEIVED,
    data: null
  };
}
export function getLessonData(lesson_id) {
  return function(dispatch) {
    // Indicate that response is being posted
    dispatch(setLoading());

    return api.getLessonData(lesson_id, (err, resp, body) => {
      dispatch(clearLoading());
      dispatch(receiveLessonData(body));
      //dispatch(lessonDataReceived());
    });
  }
}
export function getArticleData(article_id) {
  return function(dispatch) {
    // Indicate that response is being posted
    dispatch(setLoading());

    return api.getArticleData(article_id, (err, resp, body) => {
      if(resp.statusCode === 200){
        dispatch(receiveArticleData(body));
      }else{
         dispatch(handle_error(resp, err));
      }
      dispatch(clearLoading());
      //dispatch(lessonDataReceived());
    });
  }
}
export function receiveArticleData(data, dispatch) {
  return {
    type: C.RECEIVE_ARTICLE_DATA,
    data: data
  };
}
export function resetArticleData(dispatch) {
  return {
    type: C.RESET_ARTICLE_DATA,
    data: null
  };
}
export function getClassroomsForSchool(school_id) {
  return function(dispatch) {
    // Indicate that response is being posted
    dispatch(setLoading());
    if(school_id <= 0){
      return api.getClassroomsForNoSchool((err, resp, body) => {
        dispatch(clearLoading());
        dispatch(receiveClassrooms(body));
        //dispatch(lessonDataReceived());
      });
    }else{
      return api.getClassroomsForSchool(school_id, (err, resp, body) => {
        dispatch(clearLoading());
        dispatch(receiveClassrooms(body));
        //dispatch(lessonDataReceived());
      });
    }
  }
}
export function receiveClassrooms(data) {
  return {
    type: C.RECEIVE_CLASSROOMS,
    data: data
  };
}
export function setClassroom(classroom_id, user_id) {
  return function(dispatch) {
    // Indicate that response is being posted
    dispatch(setLoading());

    return api.setClassroom(classroom_id, user_id, (err, resp, body) => {
      dispatch(clearLoading());
      dispatch(receiveUser(body));
      if(window.location.hash.indexOf("dashboard") >= 0){
        dispatch(DashboardActions.requestClassroomStatus(body.classroom_id));
      }else{
        window.location.replace("/#/dashboard");
      }
    });
  }
}

// Course admin functions

export function addCourse() {
  return {
    type: C.CREATE_NEW_COURSE
  };
}
export function setCourse(course) {
  return {
    type: C.SET_COURSE,
    data: course
  };
}
export function editCourse(course) {
  return {
    type: C.EDIT_COURSE,
    data: course
  };
}
export function saveCourse(course) {
  return function(dispatch) {
    if(course.id === null){
      return api.createCourse(course, (err, resp, body) => {
        dispatch(receiveNewCourseData(body));
      });
    }
    else{
      return api.editCourse(course, (err, resp, body) => {
        dispatch(receiveCourseData(body));
      });
    }
  }
}
export function receiveNewCourseData(data) {
  return {
    type: C.RECEIVE_NEW_COURSE_DATA,
    data: data
  };
}
export function receiveCourseData(data) {
  return {
    type: C.RECEIVE_COURSE_DATA,
    data: data
  };
}
export function deleteCourse(course_id) {
  return function(dispatch) {
    return api.deleteCourse(course_id, (err, resp, body) => {
      dispatch(courseDeleted(course_id));
    });
  }
}
export function courseDeleted(course_id) {
  return {
    type: C.COURSE_DELETED,
    data: course_id
  };
}
export function createNewActivity(page_id) {
  return function(dispatch) {
    return api.createActivity(page_id, (err, resp, body) => {
      dispatch(receiveNewActivityData(body));
    });
  }
}
export function receiveNewActivityData(data) {
  return {
    type: C.RECEIVE_NEW_ACTIVITY_DATA,
    data: data
  };
}

// Lesson admin functions
export function addLesson(course) {
  return {
    type: C.CREATE_NEW_LESSON,
    data: course
  };
}
export function editLesson(lesson) {
  return {
    type: C.EDIT_LESSON,
    data: lesson
  };
}
export function saveLesson(lesson, course_id) {
  return function(dispatch) {
    if(lesson.id === null){
      return api.createLesson(lesson, course_id, (err, resp, body) => {
        dispatch(receiveNewLessonData(body, course_id));
      });
    }
    else{
      return api.editLesson(lesson, (err, resp, body) => {
        dispatch(receiveLessonData(body, course_id));
      });
    }
  }
}
export function receiveNewLessonData(data) {
  return {
    type: C.RECEIVE_NEW_LESSON_DATA,
    data: data
  };
}
export function receiveLessonData(data) {
  return {
    type: C.RECEIVE_LESSON_DATA,
    data: data
  };
}
export function deleteLesson(lesson_id, course_id) {
  return function(dispatch) {
    return api.deleteLesson(lesson_id, course_id, (err, resp, body) => {
      dispatch(lessonDeleted(body));
    });
  }
}
export function lessonDeleted(course) {
  return {
    type: C.LESSON_DELETED,
    data: course
  };
}

//Page level actions
export function addPage(lesson) {
  return {
    type: C.CREATE_NEW_PAGE,
    data: lesson
  };
}
export function savePageData(page) {

  return function(dispatch) {
    dispatch(setLoading());
    if(page.id === null){
      return api.createPage(page, (err, resp, body) => {
        dispatch(receiveNewPageData(body));
        dispatch(clearLoading());
      });
    }
    else{
      return api.editPage(page, (err, resp, body) => {
        dispatch(receivePageData(body));
        dispatch(clearLoading());
      });
    }
  }
}
export function deletePage(page) {
  return function(dispatch) {
    dispatch(deletingPage(page));
    if(page.id == null){      
      return dispatch(pageDeleted(page));
    }else{
      return api.deletePage(page, (err, resp, body) => {
        dispatch(pageDeleted(page));
      });
    }
  }
}
export function pageDeleted(page_id) {
  return {
    type: C.PAGE_DELETED,
    data: page_id
  };
}
export function deletingPage(page) {
  return {
    type: C.DELETING_PAGE,
    data: null
  };
}

export function activityDeleted() {
  return {
    type: C.ACTIVITY_DELETED,
    data: null
  };
}
export function updateActivityOnPage(page_id, activity) {
  return {
    type: C.UPDATE_ACTIVITY_ON_PAGE,
    data: {page_id: page_id, activity: activity}
  };
}
export function receiveNewPageData(data) {
  return {
    type: C.RECEIVE_NEW_PAGE_DATA,
    data: data
  };
}
export function receivePageData(data) {
  return {
    type: C.RECEIVE_PAGE_DATA,
    data: data
  };
}


export function saveArticle(article) {

  return function(dispatch) {
    dispatch(setLoading());
    if(article.id === null || typeof article.id === "undefined" ){
      return api.createArticle(article, (err, resp, body) => {
        if(resp.statusCode === 200){
          dispatch(receiveNewArticleData(body));
        }else{
           dispatch(handle_error(resp, err));
        }
        dispatch(clearLoading());
        window.location.replace("/#/admin/article/edit/"+body.id);
      });
    }
    else{
      return api.editArticle(article, (err, resp, body) => {
        if(resp.statusCode === 200){
          dispatch(receiveArticleData(body));
        }else{
           dispatch(handle_error(resp, err));
        }
        dispatch(clearLoading());
      });
    }
  }
}

export function receiveNewArticleData(data) {
  return {
    type: C.RECEIVE_NEW_ARTICLE_DATA,
    data: data
  };
}
export function receiveArticleData(data) {
  return {
    type: C.RECEIVE_ARTICLE_DATA,
    data: data
  };
}

export function saveMonologue(monologue) {

  return function(dispatch) {
    dispatch(setLoading());
    if(monologue.id === null || typeof monologue.id === "undefined" ){
      return api.createMonologue(monologue, (err, resp, body) => {
        dispatch(receiveNewMonologueData(body));
        dispatch(clearLoading());
      });
    }
    else{
      return api.editMonologue(monologue, (err, resp, body) => {
        dispatch(receiveMonologueData(body));
        dispatch(clearLoading());
      });
    }
  }
}

export function previewMonologue(monologue) {

  return function(dispatch) {
    dispatch(setLoading());
    return api.previewMonologue(monologue, (err, resp, body) => {
      dispatch(receivePreviewMonologueData(body));
      dispatch(clearLoading());
    });
  }
}
export function deleteMonologue(monologue) {

  return function(dispatch) {
    dispatch(setLoading());
    if(monologue.id){
      return api.deleteMonologue(monologue, (err, resp, body) => {
        dispatch(removeMonologue(monologue));
        dispatch(clearLoading());
      });
    }
    else{
      dispatch(removeMonologue(monologue));
      dispatch(clearLoading());
    }
  }
}
export function removeMonologue(data) {
  return {
    type: C.REMOVE_MONOLOGUE,
    data: data
  };
}
export function receiveMonologueData(data) {
  return {
    type: C.RECEIVE_MONOLOGUE_DATA,
    data: data
  };
}
export function receivePreviewMonologueData(data) {
  return {
    type: C.RECEIVE_PREVIEW_MONOLOGUE_DATA,
    data: data
  };
}
export function receiveNewMonologueData(data) {
  return {
    type: C.RECEIVE_NEW_MONOLOGUE_DATA,
    data: data
  };
}
export function saveLessonAttachment(file_data, lesson) {
   return function(dispatch) {
    dispatch(setLoading());
    return api.saveLessonAttachment(lesson.id, file_data)
    .then((res) => {
      dispatch(receiveLessonAttachments(res.data));
      dispatch(clearLoading());
    });
  }
}
export function deleteLessonAttachment(attachment) {
   return function(dispatch) {
    dispatch(setLoading());
    return api.deleteLessonAttachment(attachment, (err, resp, body) => {
      dispatch(removeLessonAttachments(attachment));
      dispatch(clearLoading());
    });
  }
}

export function receiveLessonAttachments(data) {
  return {
    type: C.RECEIVE_LESSON_ATTACHMENT,
    data: data
  };
}
export function removeLessonAttachments(data) {
  return {
    type: C.REMOVE_LESSON_ATTACHMENT,
    data: data
  };
}
export function saveSentenceSynonym(activity_id, sentence) {
  return function(dispatch) {
    dispatch(setLoading());
    return api.saveSentenceSynonym(activity_id, sentence)
    .then((res) => {
      dispatch(receiveSentence(res.data));
      dispatch(clearLoading());
    }, function(reason) {
      dispatch(clearLoading());
    });
  }
}
export function receiveSentence(data) {
  return {
    type: C.RECEIVE_SENTENCE,
    data: data
  };
}
export function showAlert(message) {
  if(typeof message != "string" && message.message != null){
    message = message.message;
  }
  return {
    type: C.SHOW_ALERT,
    data: { message }
  };
}

export function hideAlert() {
  return {
    type: C.HIDE_ALERT
  };
}

export function saveWordTranslation(activity_id, word_record, sentence_id) {
   return function(dispatch) {
    dispatch(setLoading());
    return api.saveWordTranslation(activity_id, word_record, sentence_id, (err, resp, body) => {
      dispatch(receiveWord(body));
      dispatch(clearLoading());
    });
  }
}
export function receiveWord(data) {
  return {
    type: C.RECEIVE_WORD,
    data: data
  };
}

export function toggleWordAbbv(activity_id, word_id, sentence_id) {
   return function(dispatch) {
    dispatch(setLoading());
    return api.toggleWordAbbv(activity_id, word_id, sentence_id, (err, resp, body) => {
      dispatch(receiveArticleData(body));
      dispatch(clearLoading());
    });
  }
}

export function handle_error(resp, error){
  let msg ="An Erro Occured.";
  if(false){
    msg = error.message ? error.message : error;
  }else{
    switch(resp.statusCode) {
      case 400:
          msg ="Something went wrong.";
          break;
      case 422:
          msg ="Something was wrong with the input.";
          break;
      case 408:
          msg ="The server timed out.";
          break;
      case 500:
          msg ="The server timed out.";
          break;
      default:
          break;
    }
  }
  return function(dispatch) {
    dispatch(showAlert(msg));
  }
}
