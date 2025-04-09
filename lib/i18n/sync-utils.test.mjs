import fs from 'fs'
import { regex } from './sync-utils'
import { expect, vi, describe, it, expect } from 'vitest'

describe('regex', () => {
  vi.mock('fs', async importOriginal => {
    const original = await importOriginal()
    return {
      default: {
        ...original,
        readFileSync: vi.fn(path => {
          if (path.includes('package.json')) {
            return JSON.stringify({
              config: {
                i18n: {
                  app_name: 'your-app-name',
                },
              },
            })
          }
          return original.readFileSync(path)
        }),
      },
    }
  })

  it('should match IDs with prefixes', () => {
    const line = '+  id="your-app-name-8WKgF6"'
    let matchingId = ''
    for (const match of line.matchAll(regex)) {
      matchingId = match?.groups?.id
    }
    expect(matchingId).toBe('your-app-name-8WKgF6')
  })

  it('should match IDs without prefixes', () => {
    const line = "-  id='XYZ789'"
    let matchingId = ''
    for (const match of line.matchAll(regex)) {
      matchingId = match?.groups?.id
    }
    expect(matchingId).toBe('XYZ789')
  })

  it('should match multiple IDs on same line', () => {
    const multipleLines = "-  id='XYZ789' sdfa  id: 'ABC123' dfsdf id= 'DEF456'"
    let matchingIds = []
    for (const matches of multipleLines.matchAll(regex)) {
      matchingIds.push(matches.groups.id)
    }
    expect(matchingIds).toEqual(['XYZ789', 'ABC123', 'DEF456'])
  })

  it('should handle different id notations', () => {
    const line1 = '+ id="GHI789"'
    let matchingId1 = ''
    for (const match1 of line1.matchAll(regex)) {
      matchingId1 = match1?.groups?.id
    }
    expect(matchingId1).toBe('GHI789')

    const line2 = '+ id: "JKL012"'
    let matchingId2 = ''
    for (const match2 of line2.matchAll(regex)) {
      matchingId2 = match2?.groups?.id
    }
    expect(matchingId2).toBe('JKL012')
  })

  it('should not match lines without IDs', () => {
    const line = '+  someOtherProperty="value"'
    let matchingId = ''
    for (const match of line.matchAll(regex)) {
      matchingId = match?.groups?.id
    }
    expect(matchingId).toBe('')
  })
})
