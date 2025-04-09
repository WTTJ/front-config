import { regex } from './sync-utils'

jest.mock('fs', () => {
  const originalFs = jest.requireActual('fs')
  return {
    ...originalFs,
    readFileSync: jest.fn(path => {
      if (path === 'package.json') {
        return JSON.stringify({
          config: {
            i18n: {
              app_name: 'employer-branding-components',
              locales_dir_path: './locales',
              default_language_filename: 'en.json',
              path_to_ignore: '',
              extract_from_pattern: '**/*.js',
            },
          },
        })
      }
      return originalFs.readFileSync(path)
    }),
  }
})

describe('regex', () => {
  it('should match IDs with prefixes', () => {
    const line = '+  id="employer-branding-components-8WKgF6"'
    for (const match of line.matchAll(regex)) {
      expect(match.groups.id).toBe('employer-branding-components-8WKgF6')
    }
  })

  it('should match IDs without prefixes', () => {
    const line = "-  id='XYZ789'"
    for (const match of line.matchAll(regex)) {
      expect(match?.groups?.id).toBe('XYZ789')
    }
  })

  it('should match multiple IDs on same line', () => {
    const multipleLines = "-  id='XYZ789' sdfa  id: 'ABC123' dfsdf id= 'DEF456'"
    let ids = []
    for (const matches of multipleLines.matchAll(regex)) {
      ids.push(matches.groups.id)
    }
    expect(ids).toEqual(['XYZ789', 'ABC123', 'DEF456'])
  })

  it('should handle different id notations', () => {
    const line1 = '+ id="GHI789"'
    for (const match1 of line1.matchAll(regex)) {
      expect(match1?.groups?.id).toBe('GHI789')
    }

    const line2 = '+ id: "JKL012"'
    for (const match2 of line2.matchAll(regex)) {
      expect(match2?.groups?.id).toBe('JKL012')
    }
  })

  it('should not match lines without IDs', () => {
    const line = '+  someOtherProperty="value"'
    for (const match of line.matchAll(regex)) {
      expect(match).toBeNull()
    }
  })
})
