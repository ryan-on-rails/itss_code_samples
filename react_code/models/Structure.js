import Lesson from './Lesson'

/* Structure
 *
 *   decorates a classroom structure from the api for easy access to its
 *   lessons and activities
 */
export default class Structure {
  constructor(structure) {
    this.structure_name = structure.structure_name
    this.lessons        = structure.lessons.map((lesson) => {
                            return new Lesson(lesson)
                          })
    this.activities     = this.lessons.reduce((activities, lesson) => {
                            return activities.concat(lesson.activities)
                          }, [])
  }
}
