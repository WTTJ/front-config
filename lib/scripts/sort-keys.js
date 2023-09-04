/**
 * Sort keys in the same way as Lokalise e.g.
 * jobs-search
 * jobs_search
 * jobs
 * Which is different to the default JS sort e.g.
 * jobs
 * jobs-search
 * jobs_search
 * @argument object Nested object where keys need to be sorted
 */

const DELIMITERS_ORDER = ['-', '_']

export const sortKeys = object => {
  const sortedObj = {}
  const keys = Object.keys(object).sort((a, b) => {
    const partsA = a.split(/([-_])/)
    const partsB = b.split(/([-_])/)

    // If first part of string doesn't match, compare alphabetically
    // e.g. jobs-search vs companies-search
    if (partsA[0] !== partsB[0]) {
      return a.localeCompare(b)
    }

    // If one string only has a first part, it should come last
    // e.g. jobs should come after jobs-search
    if (!partsA[1]) {
      return -1
    } else if (!partsB[1]) {
      return 1
    }

    // If both strings have the same first part but the separator is different, put dash (-) first
    // e.g. jobs-search should come before jobs_search
    if (partsA[1] !== partsB[1]) {
      const delimiterPositionA = DELIMITERS_ORDER.findIndex(e => e === partsA[1])
      const delimiterPositionB = DELIMITERS_ORDER.findIndex(e => e === partsB[1])
      return delimiterPositionA - delimiterPositionB
    }

    // If both strings have the same first part and the same separator, compare alphabetically
    // e.g. jobs-page should come before jobs-search
    return a.localeCompare(b)
  })

  for (var index in keys) {
    const key = keys[index]
    if (typeof object[key] === 'object') {
      sortedObj[key] = sortKeys(object[key])
    } else {
      sortedObj[key] = object[key]
    }
  }

  return sortedObj
}
