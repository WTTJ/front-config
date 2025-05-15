import { promisify } from 'util'
import { exec } from 'child_process'

import { describe, expect, it } from 'vitest'
import { vol } from 'memfs'

import { stagedFilesNumberCommand } from './commands.mjs'

describe('test command functions', () => {
  it('should run git command without failing when path_to_ignore is set', async () => {
    vol.fromJSON({
      'package.json': JSON.stringify({
        config: {
          i18n: {
            app_name: 'your-app-name',
            default_language_filename: 'en-US',
            extract_from_pattern: 'src/**/*.js',
            locales_dir_path: '__mocks__/locales',
            path_to_ignore: 'pouet',
          },
        },
      }),
    })
    const execute = promisify(exec)
    let fail = false
    let output
    try {
      output = await execute(stagedFilesNumberCommand())
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
      fail = true
    }
    expect(output.stderr).toBe('')
    expect(fail).toBe(false)
  })

  it('should run git command without failing when path_to_ignore is not set', async () => {
    vol.fromJSON({
      'package.json': JSON.stringify({
        config: {
          i18n: {
            app_name: 'your-app-name',
            extract_from_pattern: 'src/**/*.js',
            locales_dir_path: '__mocks__/locales',
            default_language_filename: 'en-US',
          },
        },
      }),
    })
    const execute = promisify(exec)
    let fail = false
    let output
    try {
      output = await execute(stagedFilesNumberCommand())
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
      fail = true
    }
    expect(output.stderr).toBe('')
    expect(fail).toBe(false)
  })
})
