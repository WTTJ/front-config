import { promisify } from 'util'
import * as childProcess from 'child_process'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { vol } from 'memfs'

import {
  precommit,
  stagedFilesNumberCommand,
  translationTaskNeededMessage,
} from './precommitFunction.mjs'

vi.mock('child_process', () => ({ exec: vi.fn() }))

describe('', () => {
  const mockExit = vi.spyOn(process, 'exit').mockImplementation(code => {
    throw new Error(`Process exited with code: ${code}`)
  })

  const mockExec = errorCode =>
    vi.spyOn(childProcess, 'exec').mockImplementation((cmd, cb) => {
      if (cmd.includes('wc -l')) {
        return cb(null, { stdout: errorCode })
      }
      return cb(null, { stdout: '' })
    })

  const consoleMock = vi.spyOn(console, 'error').mockImplementation(() => undefined)

  afterEach(() => {
    consoleMock.mockClear()
    mockExit.mockClear()
  })

  it('should exit with error code 0 when no staged files inside extract_from_pattern path', async () => {
    // simulate 0 staged files
    mockExec('0')
    try {
      await precommit()
    } catch (e) {
      expect(e.message).toBe('Process exited with code: 0')
    }
  })

  it('should exit with error code 1 when there are files to translate with new translations', async () => {
    // simulate staged files
    mockExec('1')
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
    vi.clearAllMocks()
  })

  it('should exit with error code 0 when there are files to translate', async () => {
    // simulate staged files
    mockExec('1')
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
    vi.clearAllMocks()
  })

  it.skip('TEST', async () => {
    vol.fromJSON({
      'package.json': JSON.stringify({
        config: {
          i18n: {
            app_name: 'your-app-name',
            extract_from_pattern: 'src/**/*.js',
            locales_dir_path: '__mocks__/locales',
            default_language_filename: 'en-US',
            path_to_ignore: 'pouet',
          },
        },
      }),
    })
    const execute = promisify(childProcess.exec)
    console.log({ stagedFilesNumberCommand: stagedFilesNumberCommand() })
    let fail = false
    let output
    try {
      output = await execute(stagedFilesNumberCommand())
    } catch (e) {
      fail = true
    }
    expect(output.stderr).toBe('')
    expect(fail).toBe(false)
  })
})
