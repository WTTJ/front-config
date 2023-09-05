/*!
  JSON ABC | License: MIT.
  https://github.com/ShivrajRath/jsonabc
*/

// Is a value an Object?
function isPlainObject(val) {
  return Object.prototype.toString.call(val) === '[object Object]'
}

/**
 * Sort keys in the same way as Lokalise e.g.
 * jobs-search
 * jobs_search
 * jobsSearch
 * jobs
 * Which is different to the default JS sort e.g.
 * jobs
 * jobs-search
 * jobs_search
 * jobsSearch
 * @argument object Nested object where keys need to be sorted
 **/
export function sortKeys(object) {
  let sortedObject = {}

  if (isPlainObject(object)) {
    sortedObject = {}
    Object.keys(object)
      .sort(function (a, b) {
        if (a.toLowerCase() < b.toLowerCase()) return -1
        if (a.toLowerCase() > b.toLowerCase()) return 1
        return 0
      })
      .forEach(function (key) {
        sortedObject[key] = sortKeys(object[key])
      })
  } else {
    sortedObject = object
  }

  return sortedObject
}
