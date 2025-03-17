import { regex } from './sync-utils'

describe('regex', () => {
  it('should match IDs with prefixes', () => {
    const line = '+  id="employer-branding-components-8WKgF6"'
    const match = line.match(regex)
    expect(match?.groups?.id).toBe('employer-branding-components-8WKgF6')
  })

  it('should match IDs without prefixes', () => {
    const line = "-  id='XYZ789'"
    const match = line.match(regex)
    expect(match?.groups?.id).toBe('XYZ789')
  })

  it('should handle different id notations', () => {
    const line1 = '+ id="GHI789"'
    const match1 = line1.match(regex)
    expect(match1?.groups?.id).toBe('GHI789')

    const line2 = '+ id: "JKL012"'
    const match2 = line2.match(regex)
    expect(match2?.groups?.id).toBe('JKL012')
  })

  it('should not match lines without IDs', () => {
    const line = '+  someOtherProperty="value"'
    const match = line.match(regex)
    expect(match).toBeNull()
  })
})
