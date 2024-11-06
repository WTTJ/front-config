import { describe, expect, test } from '@jest/globals'

import { addMissingKeys } from './missing-keys'

describe('addMissingKeys', () => {
  test('should add missing top-level keys from object a to object b', () => {
    const a = { x: 1, y: 2 }
    const b = { x: 10 }

    const result = addMissingKeys(a, b)
    expect(result).toEqual({ x: 10, y: 2 })
  })

  test('should add missing nested keys from object a to object b', () => {
    const a = { x: { y: 2, z: 3 } }
    const b = { x: { y: 10 } }

    const result = addMissingKeys(a, b)
    expect(result).toEqual({ x: { y: 10, z: 3 } })
  })

  test('should add multiple levels of missing nested keys', () => {
    const a = { x: { y: { z: 3 } } }
    const b = { x: {} }

    const result = addMissingKeys(a, b)
    expect(result).toEqual({ x: { y: { z: 3 } } })
  })

  test('should handle completely missing nested structures', () => {
    const a = { x: { y: { z: 3 } } }
    const b = {}

    const result = addMissingKeys(a, b)
    expect(result).toEqual({ x: { y: { z: 3 } } })
  })

  test('should not overwrite existing keys in object b', () => {
    const a = { x: 1, y: { z: 3 } }
    const b = { x: 100, y: { z: 30 } }

    const result = addMissingKeys(a, b)
    expect(result).toEqual({ x: 100, y: { z: 30 } })
  })

  test('should handle empty objects correctly', () => {
    const a = {}
    const b = { x: 1 }

    const result = addMissingKeys(a, b)
    expect(result).toEqual({ x: 1 })
  })

  test('should handle null values in object a', () => {
    const a = { x: null, y: { z: 3 } }
    const b = {}

    const result = addMissingKeys(a, b)
    expect(result).toEqual({ x: null, y: { z: 3 } })
  })

  test('should handle null values in object b', () => {
    const a = { x: 1, y: { z: 3 } }
    const b = { x: null }

    const result = addMissingKeys(a, b)
    expect(result).toEqual({ x: null, y: { z: 3 } })
  })
})
