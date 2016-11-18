import Structure from '../models/Structure'

/* parseStructures
 *
 *   extracts all of the structures, lessons, and activities for the
 *   classroom status table from the API data
 */
export const parseStructures = (data) => {
  let structures = data.map((structure) => {
                       return new Structure(structure)
                     })
  let lessons    = structures.reduce((lessons, structure) => {
                       return lessons.concat(structure.lessons)
                     }, [])
  let activities = lessons.reduce((activities, lesson) => {
                      var _activities = lesson.activities.length ? lesson.activities :[{}];
                       return activities.concat(_activities)
                     }, [])

  return {
    structures: structures,
    lessons:    lessons,
    activities: activities
  }
}

export const parseStudents = (data) => {
  let students = data

  return {
    students: students
  }
}

export const parseReport = (data, reportType) => {
  switch(reportType) {
    case 'high-score':
      return data.map(student => { return flattenObject(student) })
    case 'gaming':
      return data.map(student => { return flattenObject(student) })
    default:
      return data
  }
}

const flattenObject = (object) => {
  let toReturn = {}

  for (var i in object) {
    if (!object.hasOwnProperty(i)) continue;

    if ((typeof object[i]) == 'object') {
      var flatObject = flattenObject(object[i]);
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;
        toReturn[i + '_' + x] = flatObject[x];
      }
    } else {
      toReturn[i] = object[i];
    }
  }
  return toReturn;
}
