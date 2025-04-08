import { isTranslationTaskNeeded } from './check-utils'

describe('isTranslationTaskNeeded', () => {
  it('should return false if source and temp translations have the same keys', () => {
    const tempTranslations = {a: 'foo', b: 'bar'}
    const sourceTranslations = {a: 'foo', b: 'bar'}
    const result = isTranslationTaskNeeded(tempTranslations, sourceTranslations)
    expect(result).toBe(false)
  })

  it('should return true if temp translations have keys that do not exist in source translations', () => {
    const tempTranslations = {a: 'foo', b: 'bar'}
    const sourceTranslations = {a: 'foo'}
    const result = isTranslationTaskNeeded(tempTranslations, sourceTranslations)
    expect(result).toBe(true)
  })
  it('should return false if temp translations are empty', () => {
    const tempTranslations = {}
    const sourceTranslations = {a: 'foo', b: 'bar'}
    const result = isTranslationTaskNeeded(tempTranslations, sourceTranslations)
    expect(result).toBe(false)
  })
  it('should return false if both temp and source translations are empty', () => {
    const tempTranslations = {}
    const sourceTranslations = {}
    const result = isTranslationTaskNeeded(tempTranslations, sourceTranslations)
    expect(result).toBe(false)
  })
  it('should return false if every temp translations already exist in a larger source translation object', () => {
    const tempTranslations = {a: 'foo', b: 'bar'}
    const sourceTranslations = {a: 'foo', b: 'bar', c: 'baz'}
    const result = isTranslationTaskNeeded(tempTranslations, sourceTranslations)
    expect(result).toBe(false)
  })
})