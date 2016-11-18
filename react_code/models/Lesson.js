/* Lessons
 *
 *   decorates a classroom lesson from the api for easy access to its
 *   activities
 */
export default class Lesson {
  constructor(lesson) {
    this.lesson_id    = lesson.lesson_id
    this.lesson_title = lesson.lesson_title
    this.lesson_published = lesson.lesson_published
    this.activities   = lesson.pages.reduce((activities, page) => {
                           return activities.concat(page.activities)
                         }, [])
  }
}
