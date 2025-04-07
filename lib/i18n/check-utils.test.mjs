import { isTranslationTaskNeeded } from './check-utils'

describe('isTranslationTaskNeeded', () => {
  it('should return false if source and temp translations have the same keys', () => {
    const tempTranslations = {a: 'foo', b: 'bar'}
    const sourceTranslations = {a: 'foo', b: 'bar'}
    const result = isTranslationTaskNeeded(tempTranslations, sourceTranslations)
    expect(result).toBe(false)
  })

  it('should return true if source and temp translations have different keys', () => {
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
  it('should return false if source translations has more elements', () => {
    const tempTranslations = {a: 'foo', b: 'bar'}
    const sourceTranslations = {a: 'foo', b: 'bar', c: 'baz'}
    const result = isTranslationTaskNeeded(tempTranslations, sourceTranslations)
    expect(result).toBe(false)
  })
})