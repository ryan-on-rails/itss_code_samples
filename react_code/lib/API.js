import request from 'request';
import axios   from 'axios';

let origin = `${window.location.protocol}//${window.location.hostname}`;
if(window.location.port != "" || window.location.port != 80){
  origin +=`:${window.location.port}`
}

let apiRequest = request.defaults({
  baseUrl: `${origin}/api/v1`,
  json: true
});

let apiAxiosRequest = axios.create({
  baseURL: `${origin}/api/v1`,
  responseType: 'json'
})

let api = (function() {
  return {
    submitResponse(response, cb) {
      return apiRequest.post('/responses', {
        body: { response: response }
      }, cb);
    },

    clearUserResponses(activity_id, cb) {
      return apiRequest.post('/responses/delete', {
        body: { activity_id: activity_id }
      }, cb);
    },

    updateUser(userParams, cb) {
      return apiRequest.put('/users/current', {
        body: userParams
      }, cb);
    },

    setUserLesson(lessonId, cb) {
      return apiRequest.post('/users/current_lesson', {
        body: { lesson_id: lessonId }
      }, cb);
    },

    setUserActivity(activityId, cb) {
      return apiRequest.post('/users/current_activity', {
        body: { activity_id: activityId }
      }, cb);
    },

    getCurrentLesson(cb) {
      return apiRequest.get('/lessons/current', {}, cb);
    },

    getLessonData(lesson_id, cb) {
      return apiRequest.post('/lessons/data', {
        body: {lesson_id: lesson_id}
      }, cb);
    },

    getArticleData(article_id, cb) {
      return apiRequest.get(`/articles/${article_id}`, {
        body: {id: article_id}
      }, cb);
    },

    getClassroomStudentResponseData(classroomId) {
      return apiAxiosRequest.get(`/classroom/${classroomId}/student_response_data`)
    },

    getClassroomActivities(classroomId) {
      return apiAxiosRequest.get(`/classroom/${classroomId}/activities`)
    },

    putStudentCurrentActivity(studentId, activityId) {
      return apiAxiosRequest.put(`/users/${studentId}`, {
        current_activity_id: parseInt(activityId, 10)
      })
    },

    getStudentResponses(studentId, activityId) {
      // mimick an axios request for our eventual api endpoint
      return apiAxiosRequest.get(`/students/${studentId}/response_data`,
                                 { params: { activity_id: activityId } })
    },

    getResources() {
      return apiAxiosRequest.get(`/lessons/all_resources`)
    },

    getLoginRoster(classroomId) {
      return apiAxiosRequest.get(`/classroom/${classroomId}/roster`)
    },

    getReport(classroomId, report) {
      switch(report) {
        case 'high-score':
          return apiAxiosRequest.get(`/classroom/${classroomId}/high_score_report`)
        case 'gaming':
          return apiAxiosRequest.get(`/classroom/${classroomId}/gaming_report`)
        case 'main-idea-scores':
          return apiAxiosRequest.get(`/classroom/${classroomId}/main_idea_report`)
        case 'recent-responses':
          return apiAxiosRequest.get(`/classroom/${classroomId}/recent_activity_report`)
        default:
          return new Promise(
            (resolve, reject) => {
              resolve({})
            }
          )
      }
    },

    toggleActivityLock(activity_id, student_ids, cb) {
      return apiRequest.put(`/activities/${activity_id}/toggle_lock`, {
        body: {student_ids: student_ids}
      }, cb);
    },
    createCourse(course, cb) {
      return apiRequest.post(`/courses`, {
        body: {course: course}
      }, cb);
    },
    editCourse(course, cb) {
      return apiRequest.put(`/courses/${course.id}`, {
        body: {course: course}
      }, cb);
    },
    getPage(page_id, cb) {
      return apiRequest.get(`/pages`, {}, cb);
    },
    deleteCourse(course_id, cb) {
      return apiRequest.del(`/courses/${course_id}`, {
        body: {id: course_id}
      }, cb);
    },
    createActivity(activity, cb) {
      return apiRequest.post(`/activities`, {
        body: {activity: activity}
      }, cb);
    },
    createLesson(lesson, course_id, cb) {
      return apiRequest.post(`/lessons`, {
        body: {lesson: lesson, course_id: course_id}
      }, cb);
    },
    editLesson(lesson, cb) {
      return apiRequest.put(`/lessons/${lesson.id}`, {
        body: {lesson: lesson}
      }, cb);
    },
    deleteLesson(lesson_id, course_id, cb) {
      return apiRequest.del(`/lessons/${lesson_id}`, {
        body: {id: lesson_id, course_id: course_id}
      }, cb);
    },
    createPage(page, cb) {
      return apiRequest.post(`/pages`, {
        body: {page: page}
      }, cb);
    },
    editPage(page, cb) {
      return apiRequest.put(`/pages/${page.id}`, {
        body: {id: page.id, page: page}
      }, cb);
    },
    deletePage(page, cb) {
      return apiRequest.del(`/pages/${page.id}`, {
        body: {id: page.id}
      }, cb);
    },
    createArticle(article, cb) {
      return apiRequest.post(`/articles`, {
        body: {article: article}
      }, cb);
    },
    editArticle(article, cb) {
      return apiRequest.put(`/articles/${article.id}`, {
        body: {id: article.id, article: article}
      }, cb);
    },

    getClassroomsForSchool(school_id, cb) {
      return apiRequest.get(`/schools/${school_id}/classrooms`, {
        body: {id: school_id}
      }, cb);
    },
    getClassroomsForNoSchool(cb) {
      return apiRequest.get(`/schools/classrooms`, {
        body: {}
      }, cb);
    },

    setClassroom(classroom_id, user_id, cb) {
      return apiRequest.put(`/users/${user_id}/set_classroom`, {
        body: {id: user_id, classroom_id: classroom_id}
      }, cb);
    },
    createMonologue(monologue, cb) {
      return apiRequest.post(`/audio/monologue`, {
        body: {monologue: monologue}
      }, cb);
    },
    previewMonologue(monologue, cb) {
      return apiRequest.post(`/audio/monologue/preview`, {
        body: {monologue: monologue}
      }, cb);
    },
    editMonologue(monologue, cb) {
      return apiRequest.put(`/audio/${monologue.id}/monologue`, {
        body: {id: monologue.id, monologue: monologue}
      }, cb);
    },
    deleteMonologue(monologue, cb) {
      return apiRequest.del(`/audio/${monologue.id}/monologue`, {
        body: {id: monologue.id}
      }, cb);
    },
    saveLessonAttachment(lesson_id, la_file_data) {
      var data = new FormData();
      data.append('id', lesson_id);
      data.append('file', la_file_data);
      return apiAxiosRequest.post(`/lessons/${lesson_id}/file`, data);
    },
    deleteLessonAttachment(lesson_attachment, cb) {
      return apiRequest.del(`/audio/${lesson_attachment.id}/file`, {
        body: {id: lesson_attachment.id}
      }, cb);
    },
    saveSentenceSynonym(activity_id, sentence, cb) {
      var data = new FormData();
      data.append('id', activity_id);
      for ( var key in sentence ) {
          data.append(key, sentence[key]);
      }
      // data.append('sentence', JSON.stringify(sentence));
      return apiAxiosRequest.put(`articles/${activity_id}/sentence_synonym`, data);
    },
    saveWordTranslation(activity_id, word_record, sentence_id, cb) {
      return apiRequest.put(`/articles/${activity_id}/word_translations`, {
        body: {id: activity_id, word: word_record, sentence_id: sentence_id}
      }, cb);
    },
    toggleWordAbbv(activity_id, word_id, sentence_id, cb) {
      return apiRequest.put(`/articles/${activity_id}/common_abbv`, {
        body: {id: activity_id, word_id: word_id, sentence_id: sentence_id}
      }, cb);
    },
    updateStudentsLanguages(student_ids, language_abbv, cb) {
      return apiRequest.put(`/students/set_language`, {
        body: {student_ids: student_ids, language_abbv: language_abbv}
      }, cb);
    }
  }
})();

export default api;
