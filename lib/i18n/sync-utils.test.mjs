import { readFileSync } from 'node:fs'
import { beforeEach, expect, vi, describe, it, expect } from 'vitest'
import { regex } from './sync-utils'

describe('regex', () => {
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
