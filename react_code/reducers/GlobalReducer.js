import * as C     from '../constants/GlobalConstants';

export default function global(state = {}, action) {
  const { type, data } = action;
  let activity, page, progress;
  let feedback = { showModal: false };

  function updateProgress(state) {
    const { progress, lesson } = state;

    let current = progress.current_activity + 1;
    let percentage = parseInt(((current - 1) / progress.total_activities) * 100, 10);
    let lessonId = lesson.id;

    let lessons = progress.lessons.map(l => {
      if(l.id === lessonId) {
        l.percentage = percentage;
      }

      return l;
    });

    return Object.assign({}, progress,
        { lessons, current_activity: current, percentage });
  }

  switch(type) {
    case C.CONTENT_LOADING:
      // show the loadingOverlay
      return Object.assign({}, state, { contentLoading: true });
    case C.CONTENT_LOADED:
      // hide the loadingOverlay
      return Object.assign({}, state, { contentLoading: false });
    case C.SET_ACTIVITY:
      progress = updateProgress(state);
      return Object.assign({}, state, { activity: action.activity, progress, feedback });
    case C.RECEIVE_USER:
      return Object.assign({}, state, { user: data });
    case C.ADD_ARTICLE:
      articles = state.articles;
      articles = articles.push({});
      return Object.assign({}, state, { articles: articles });
    case C.SET_PAGE:
      activity = action.page.activities[0];
      progress = updateProgress(state);
      return Object.assign({}, state, { page: action.page, activity, progress, feedback });
      
    case C.RECEIVE_PAGE:
      let page = data;
      activity = page.activities[0];
      progress = updateProgress(state);
      return Object.assign({}, state, { page: page, activity: activity, progress, feedback });

    case C.SET_LESSON:
      let updated_data = data;
      if(typeof updated_data.activity == "undefined" || updated_data.activity == null){
        updated_data.activity = updated_data.page.activities[0];
      }
      let newState = Object.assign({}, updated_data, { feedback, contentLoading: false });
      return Object.assign({}, state, newState);
    case C.REQUEST_LESSON:
      return Object.assign({}, state, { contentLoading: true });
    case C.SHOW_CHECKPOINT:
      let lesson = action.lesson;
      lesson.showCheckpoint = true;

    case C.COURSE_DELETED:
      var course_list = state.course_list.filter(c => c.id !== data);
      return Object.assign({}, state, { course_list: course_list });


    case C.LESSON_DELETED:
      var course_list = state.course_list.map(function(c) {
        if (c.id === data.id) {
          return data;
        } else {
          return c;
        }
      });
      return Object.assign({}, state, { course_list: course_list });

    // case C.RECEIVE_NEW_ARTICLE_DATA:
    //   var article_list = state.articles
    //   article_list.push(data)
    //   return Object.assign({}, state, { articles: article_list, article: data });

    case C.RECEIVE_ARTICLE_DATA:
      var article_list = state.articles.map(function(a) {
        if (a.id === data.id) {
          return data;
        } else {
          return a;
        }
      });
      return Object.assign({}, state, { articles: article_list, article: data });

    case C.RESET_ARTICLE_DATA:
      var article =  {id: null, en_title: "", en_body: "", en_main_idea: "", en_recall: "", is_hybrid: false};
      return Object.assign({}, state, { article: article });

    default:
      return state;
  }
}
