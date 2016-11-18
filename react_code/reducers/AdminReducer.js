import * as C from '../constants/AdminConstants';
function compare_articles(a,b) {
  if (a.en_title.toLowerCase() < b.en_title.toLowerCase())
    return -1;
  if (a.en_title.toLowerCase() > b.en_title.toLowerCase())
    return 1;
  return 0;
}

export default function admin(state = {}, action) {
  const { type, data } = action;
  switch(type) {

    case C.SHOW_ALERT:
      return Object.assign({}, state, {
        alertVisible: true, alertMessage: data.message
      });
    case C.HIDE_ALERT:
      return Object.assign({}, state, {
        alertVisible: false, alertMessage: ''
      });

    case C.RECEIVE_LESSON_DATA:
      var course = {lessons: []};
      for(var index in state.course_list){
        if(data.course_ids.indexOf(state.course_list[index].id) >= 0){
          course = state.course_list[index];
          break;
        }
      }
      return Object.assign({}, state, { lesson: data, course: course, feedbacks: (state.feedbacks || []), isLoading:false});

    case C.RECEIVE_ARTICLE_DATA:
      return Object.assign({}, state, { article: data, isLoading:false});

    case C.RECEIVE_PAGE_DATA:
      var lesson = state.lesson;
      lesson.pages = lesson.pages.map(function(page){
        if(page.id === data.id){
          return data;
        }
        else{
          return page;
        }
      });
      return Object.assign({}, state, { lesson: lesson, isLoading:false});
      
    // case C.RECEIVE_USER:
    //   return Object.assign({}, state, { user: data, isLoading:false});

    case C.CREATE_NEW_COURSE:
      let create_new_course = true;

      return Object.assign({}, state, { create_new_course });
    case C.CREATE_NEW_COURSE:
      return Object.assign({}, state, { course: data });

    case C.LESSON_DATA_RECEIVED:
      return state

    case C.RECEIVE_NEW_COURSE_DATA:
      var course_list = state.course_list;
      course_list.push(data);
      return Object.assign({}, state, { course: {}, course_list: course_list });

    case C.RECEIVE_COURSE_DATA:
      var course_list = state.course_list.map(function(c){
        if(c.id === data.id){
          return data;
        }
        else{
          return c;
        }
      });
      return Object.assign({}, state, { course: null, course_list: course_list });

    case C.EDIT_COURSE:
      return Object.assign({}, state, { course: data, create_new_course: true });

    case C.UPDATE_ACTIVITY_ON_PAGE:
      let lesson = state.admin.lesson;
      let page_id = data.page_id;
      let activity = data.activity;
      lesson.pages = lesson.pages.map(function(page){
        if(page.id === page_id){
          page.activities = page.activities.map(function(_activity){
            if(_activity.id == activity.id){
              return activity;
            }
            else{
              return _activity;
            }
          });
        }
        return page;
      });
      return Object.assign({}, state, { lesson: lesson});

    case C.COURSE_DELETED:
      var course_list = state.course_list.filter(c => c.id !== data);
      return Object.assign({}, state, { course_list: course_list });

    case C.CREATE_NEW_ACTIVITY:
      return Object.assign({}, state, {});

    case C.CREATE_NEW_LESSON:
      return Object.assign({}, state, { course: data, create_new_lesson: true });

    case C.EDIT_LESSON:

      var course = {lessons: []};
      for(var index in state.course_list){
        if(data.course_ids.indexOf(state.course_list[index].id) >= 0){
          course = state.course_list[index];
          break;
        }
      }
      return Object.assign({}, state, { lesson: data, course: course, create_new_lesson: true });

    case C.LESSON_DELETED:
      var course_list = state.course_list.map(function(c) {
        if (c.id === data.id) {
          return data;
        } else {
          return c;
        }
      });
      return Object.assign({}, state, { course_list: course_list });

    case C.PAGE_DELETED:
      var _index = null;
      var lesson = state.lesson;
      lesson.pages.some(function(p, index) {
        if (p.id === data.id && p.position === data.position) {
          _index = index;
          return true;
        }
      });
      lesson.pages.splice( _index, 1);
      return Object.assign({}, state, { lesson: lesson });

    case C.RECEIVE_NEW_LESSON_DATA:
      var course = {lessons: []};
      for(var index in state.course_list){
        if(data.course_ids.indexOf(state.course_list[index].id) >= 0){
          course = state.course_list[index];
          break;
        }
      }
      var lesson_list = course.lessons;
      lesson_list.push(data);
      course.lessons = lesson_list;
      return Object.assign({}, state, { lesson: {}, course: course, lesson_list: lesson_list });

    case C.CREATE_NEW_PAGE:
      var position = data.pages.length + 1;
      var newActivity = {
        id: null,
        type: "InfoActivity",
        category: "Info",
        instructions: "Enter your page activity instructions here.",
        position: 1,
        page_id: null,
        autopass: false,
        created_at: Date.now()
      }

      var newPage = {
        activities: [newActivity],
        content_elements: [],
        id: null,
        lesson_id: data.id,
        position: position,
        created_at: Date.now()
      }

      data.pages.push(newPage);

      return Object.assign({}, state, { lesson: data});

    case C.RECEIVE_NEW_PAGE_DATA:
      return Object.assign({}, state, { lesson: data });

    case C.RECEIVE_CLASSROOMS:
      let schools = state.schools;
      let school = data;
      schools = schools.map(function(_school){
        if(_school.id === school.id){
          return school;
        }
        else{
          return _school;
        }
      });

      return Object.assign({}, state, { schools: schools });

    case C.RECEIVE_NEW_ARTICLE_DATA:
      var article_list = state.articles;
      if(typeof data.id !== "undefined" && data.id !== null){
        article_list.push(data);
      }
      article_list.sort(compare_articles);

      return Object.assign({}, state, { articles: article_list, article: data });

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

    case C.RECEIVE_MONOLOGUE_DATA:
      var lesson = state.lesson;
      lesson.pages = lesson.pages.map(function(page) {
        page.activities = page.activities.map(function(act){
          act.monologues = act.monologues.map(function(mon){
            if(mon.id === data.id){
              return data;
            }
            else{
              return mon;
            }
          });
          return act;
        });
        return page;
      });

      return Object.assign({}, state, { lesson: lesson });
    case C.RECEIVE_PREVIEW_MONOLOGUE_DATA:
      var lesson = state.lesson;
      lesson.pages = lesson.pages.map(function(page) {
        page.activities = page.activities.map(function(act){
          if(act.id !== data.activity_id) return act;
          act.monologues = act.monologues.map(function(mon){
            if(mon.slug === data.slug){
              data.preview = true;
              return data;
            }
            else{
              return mon;
            }
          });
          return act;
        });
        return page;
      });

      return Object.assign({}, state, { lesson: lesson });

    case C.REMOVE_MONOLOGUE:
      var lesson = state.lesson;
      lesson.pages = lesson.pages.map(function(page) {
        page.activities = page.activities.map(function(act){
          if(act.id !== data.activity_id) return act;
          if(data.id){
            act.monologues = act.monologues.filter(function(mon){
              return mon.id !== data.id; 
            });
          }else{
            act.monologues = act.monologues.filter(function(mon){
              return (mon.position !== data.position ); 
            });
          }
          return act;
        });
        return page;
      });

      return Object.assign({}, state, { lesson: lesson });

    case C.RECEIVE_NEW_MONOLOGUE_DATA:
      var lesson = state.lesson;
      lesson.pages = lesson.pages.map(function(page) {
        page.activities = page.activities.map(function(act){
          if(act.id !== data.activity_id) return act;
          act.monologues = act.monologues.map(function(mon){
            if(!mon.id && mon.slug === data.slug){
              data.preview = true;
              return data;
            }
            else{
              return mon;
            }
          });
          return act;
        });
        return page;
      });

      return Object.assign({}, state, { lesson: lesson });

    case C.RECEIVE_WORD:
      var article = state.article;
      var new_word = data;
      var paragraphs = null;
      if(new_word.language_abbv == "es"){
        paragraphs = article.es_body_paragraphs;
      }else{
        paragraphs = article.en_body_paragraphs;
      }
      if(paragraphs){
        paragraphs.forEach((paragraph,i) => {
          paragraph.sentences.forEach((sentence,index) => {
            sentence.words = sentence.words.map((word,t) => {
              if(new_word.id == word.id){
                return new_word;
              }else{
                return word;
              }
            });
          });
        });
      }
      if(new_word.language_abbv == "es"){
        article.es_body_paragraphs = paragraphs;
      }else{
        article.en_body_paragraphs = paragraphs;
      }
      return Object.assign({}, state, { article: article });

    case C.RECEIVE_SENTENCE:
      var article = state.article;
      var new_sentence = data;
      if(new_sentence.words[0].language_abbv == "es"){
        paragraphs = article.es_body_paragraphs;
      }else{
        paragraphs = article.en_body_paragraphs;
      }
      if(paragraphs){
        paragraphs = paragraphs.map((paragraph,i) => {
          paragraph.sentences = paragraph.sentences.map((sentence,index) => {
           if(new_sentence.id == sentence.id){
              return new_sentence;
            }else{
              return sentence;
            }
          });
          return paragraph
        });
      }
      if(new_sentence.words[0].language_abbv == "es"){
        article.es_body_paragraphs = paragraphs;
      }else{
        article.en_body_paragraphs = paragraphs;
      }
      return Object.assign({}, state, { article: article });

    case C.RECEIVE_LESSON_ATTACHMENT:
      var lesson = state.lesson;
      lesson.lesson_attachments.push(data);
      return Object.assign({}, state, { lesson: lesson });

    case C.REMOVE_LESSON_ATTACHMENT:
      var lesson = state.lesson;
      var lesson_attachments = lesson.lesson_attachments.filter(la => la.id !== data.id);
      lesson.lesson_attachments = lesson_attachments;
      return Object.assign({}, state, { lesson: lesson });

    default:
      return state;
  }
}
