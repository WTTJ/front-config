import { describe, it, expect, vi } from 'vitest'
import { isTranslationTaskNeeded } from './check-utils'
import { fs, vol } from 'memfs'

describe('isTranslationTaskNeeded', () => {
  it('should return false if source and temp translations have the same keys', () => {
    vol.fromJSON({
      '__mocks__/locales/temp.json': JSON.stringify({ a: 'foo', b: 'bar' }),
      '__mocks__/locales/en-US.json': JSON.stringify({ a: 'foo', b: 'bar' }),
    })
    const result = isTranslationTaskNeeded()
    expect(result).toBe(false)
  })

  it('should return true if temp translations have keys that do not exist in source translations', () => {
    vol.fromJSON({
      '__mocks__/locales/temp.json': JSON.stringify({ a: 'foo', b: 'bar' }),
      '__mocks__/locales/en-US.json': JSON.stringify({ a: 'foo' }),
    })
    const result = isTranslationTaskNeeded()
    expect(result).toBe(true)
  })

  it('should return false if temp translations are empty', () => {
    vol.fromJSON({
      '__mocks__/locales/temp.json': JSON.stringify({}),
      '__mocks__/locales/en-US.json': JSON.stringify({ a: 'foo', b: 'bar' }),
    })
    const result = isTranslationTaskNeeded()
    expect(result).toBe(false)
  })

  it('should return false if both temp and source translations are empty', () => {
    vol.fromJSON({
      '__mocks__/locales/temp.json': JSON.stringify({}),
      '__mocks__/locales/en-US.json': JSON.stringify({}),
    })
    const result = isTranslationTaskNeeded()
    expect(result).toBe(false)
  })

  it('should return false if every temp translations already exist in a larger source translation object', () => {
    vol.fromJSON({
      '__mocks__/locales/temp.json': JSON.stringify({ a: 'foo', b: 'bar' }),
      '__mocks__/locales/en-US.json': JSON.stringify({ a: 'foo', b: 'bar', c: 'baz' }),
    })
    const result = isTranslationTaskNeeded()
    expect(result).toBe(false)
  })
})
