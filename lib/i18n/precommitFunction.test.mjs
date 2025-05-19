import { beforeEach, describe, expect, it, vi } from 'vitest'
import { vol } from 'memfs'

import { precommit, translationTaskNeededMessage } from './precommitFunction.mjs'

const mockExit = vi.spyOn(process, 'exit').mockImplementation(code => {
  throw new Error(`Process exited with code: ${code}`)
})

const consoleMock = vi.spyOn(console, 'error').mockImplementation(() => undefined)

const mocks = vi.hoisted(() => {
  return {
    exec: vi.fn(),
  }
})

vi.mock('child_process', () => {
  return {
    exec: mocks.exec,
  }
})

beforeEach(() => {
  consoleMock.mockClear()
  mockExit.mockClear()
})

describe('precommit function execution tests', () => {
  it('should exit with error code 0 when no staged files inside extract_from_pattern path', async () => {
    // simulate 0 staged files
    mocks.exec.mockImplementation((cmd, cb) => {
      if (cmd.includes('wc -l')) {
        return cb(null, { stdout: '0' })
      }
      return cb(null, { stdout: '' })
    })

    try {
      await precommit()
    } catch (e) {
      expect(e.message).toBe('Process exited with code: 0')
    }
    mocks.exec.mockRestore()
  })

  it('should exit with error code 1 when there are files to translate with new translations', async () => {
    // simulate staged files
    mocks.exec.mockImplementation((cmd, cb) => {
      if (cmd.includes('wc -l')) {
        return cb(null, { stdout: '1' })
      }
      return cb(null, { stdout: '' })
    })
    // simulate new translations
    vol.fromJSON({
      '__mocks__/locales/temp.json': JSON.stringify({ c: 'baz' }),
      '__mocks__/locales/en-US.json': JSON.stringify({ a: 'foo', b: 'bar' }),
    })
    try {
      await precommit()
    } catch (e) {
      expect(consoleMock).toHaveBeenCalledWith(translationTaskNeededMessage)
      expect(e.message).toBe('Process exited with code: 1')
    }
    mocks.exec.mockRestore()
  })

  it('should exit with error code 0 when there are files to translate', async () => {
    // simulate staged files
    mocks.exec.mockImplementation((cmd, cb) => {
      if (cmd.includes('wc -l')) {
        return cb(null, { stdout: '1' })
      }
      return cb(null, { stdout: '' })
    })
    // simulate no new translations
    vol.fromJSON({
      '__mocks__/locales/temp.json': JSON.stringify({ a: 'foo', b: 'bar' }),
      '__mocks__/locales/en-US.json': JSON.stringify({ a: 'foo', b: 'bar' }),
    })
    try {
      await precommit()
    } catch (e) {
      expect(e.message).toBe('Process exited with code: 0')
    }
    mocks.exec.mockRestore()
  })
})
