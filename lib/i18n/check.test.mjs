import { beforeEach, describe, expect, it, vi } from 'vitest'
import { vol } from 'memfs'

beforeEach(() => {
  vi.resetModules()
})

describe('isTranslationTaskNeeded', () => {
  const mockExit = vi.spyOn(process, 'exit').mockImplementation(vi.fn())
  vi.mock('child_process', () => ({
    exec: vi.fn((cmd, cb) => cb(null, 'mocked stdout', '')),
  }))

  it('should return exit code 1 because temp.json has more keys than en-US.json', async () => {
    vol.fromJSON({
      '__mocks__/locales/temp.json': JSON.stringify({ a: 'foo', b: 'bar' }),
      '__mocks__/locales/en-US.json': JSON.stringify({ a: 'foo' }),
    })
    await import('./check.mjs')
    expect(mockExit).toHaveBeenCalledWith(1)
  })

  it('should return exit code 0 because temp.json and en-US.json have the same keys', async () => {
    vol.fromJSON({
      '__mocks__/locales/temp.json': JSON.stringify({ a: 'foo', b: 'bar' }),
      '__mocks__/locales/en-US.json': JSON.stringify({ a: 'foo', b: 'bar' }),
    })
    await import('./check.mjs')
    expect(mockExit).toHaveBeenCalledWith(0)
  })

  it('should return exit code 1 because temp.json has less keys than en-US.json', async () => {
    vol.fromJSON({
      '__mocks__/locales/temp.json': JSON.stringify({ a: 'foo' }),
      '__mocks__/locales/en-US.json': JSON.stringify({ a: 'foo', b: 'bar' }),
    })
    await import('./check.mjs')
    expect(mockExit).toHaveBeenCalledWith(1)
  })
})
