import { combineReducers } from 'redux';
import global              from './GlobalReducer';
import lesson              from './LessonReducer';
import page                from './PageReducer';
import activity            from './ActivityReducer';
import panels              from './PanelReducer';
import feedback            from './FeedbackReducer';
import user                from './UserReducer';
import admin               from './AdminReducer';
import dashboard           from './DashboardReducer';

function rootReducer(state = {}, action) {
  let admin_object = create_admin_object(state);

  return global({
    contentLoading: state.contentLoading,
    lesson: lesson(state.lesson, action),
    course_list: state.course_list,
    course: admin_object.course || {lessons:[]},
    lesson_list: state.lesson_list,
    user: user(state.user, action),
    page: page(state.page, action),
    admin: admin(admin_object, action),
    activity: activity(state.activity, action),
    panels: panels(state.panels, action),
    feedback: feedback(state.feedback, action),
    progress: state.progress,
    schools: state.schools,
    feedbacks: state.feedbacks,
    dashboard: dashboard(state.dashboard, action),
    articles: state.articles,
    article: state.article
  }, action);
}

function create_admin_object(state){
  if(!state.user.admin){ return {};} 
  let admin_object = Object.assign({},state);
  admin_object.lesson = (admin_object.admin && admin_object.admin.lesson) ? admin_object.admin.lesson : admin_object.lesson;
  admin_object.article = (admin_object.article && admin_object.admin.article) ? admin_object.admin.article : admin_object.article;
  //admin_object.user = (admin_object.user && admin_object.admin.user) ? admin_object.admin.user : admin_object.user;
  delete admin_object.admin;
  //delete admin_object.dashboard;
  delete admin_object.panels;
  return admin_object;
}

export default rootReducer;
