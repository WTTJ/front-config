export function addMissingKeys(a, b) {
  Object.keys(a).forEach(key => {
    if (typeof a[key] === 'object' && a[key] !== null) {
      if (!b[key] || typeof b[key] !== 'object') {
        b[key] = {}
      }
      addMissingKeys(a[key], b[key])
    } else {
      if (!(key in b)) {
        b[key] = a[key]
      }
    }
  })
  return b
}
