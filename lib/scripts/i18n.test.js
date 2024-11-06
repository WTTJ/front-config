/* eslint-disable no-console */
import path from 'path'

import { beforeEach, describe, expect, jest, test } from '@jest/globals'

import FileSystem from './file-system'

jest.mock('./file-system')

describe('i18n', () => {
  const localesRoot = path.join(process.cwd(), 'src/locales')
  let processExitSpy

  beforeEach(() => {
    processExitSpy = jest.spyOn(process, 'exit').mockImplementation(code => code)
  })

  afterEach(() => {
    processExitSpy.mockRestore()
    jest.clearAllMocks()
  })

  test("should log an error if the locales directory can't be read", () => {
    jest.isolateModules(() => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      FileSystem.readdir.mockImplementation((_, callback) => {
        callback(new Error('Cannot read directory'))
      })

      require('./i18n')

      expect(consoleErrorSpy).toHaveBeenCalledWith("🔴 Can't read locales directory", localesRoot)
      consoleErrorSpy.mockRestore()
    })
  })

  test('should process JSON files and log good status if they are already sorted', () => {
    jest.isolateModules(() => {
      const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})

      FileSystem.readdir.mockImplementation((_, callback) => {
        callback(null, ['file1.json', 'file2.json'])
      })
      FileSystem.require.mockReturnValue({ a: 1, b: 2 })

      require('./i18n')

      expect(consoleInfoSpy).toHaveBeenCalledWith('🟢 file1.json good')
      expect(consoleInfoSpy).toHaveBeenCalledWith('🟢 file2.json good')
      consoleInfoSpy.mockRestore()
    })
  })

  test('should log an error if JSON files are out-of-sync with base translations and --fix is not set', () => {
    jest.isolateModules(() => {
      const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      FileSystem.readdir.mockImplementation((_, callback) => {
        callback(null, ['file1.json', 'en-US.json'])
      })
      FileSystem.require.mockImplementation(filepath => {
        if (filepath.endsWith('en-US.json')) {
          return { a: 1, b: 2, c: 3 }
        }
        return { b: 2, a: 1 }
      })

      require('./i18n')

      expect(consoleInfoSpy).toHaveBeenCalledWith('🟢 en-US.json good')
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '🔴 file1.json not ordered correctly. Run this script again with `--fix` to resolve the issue.'
      )
      consoleErrorSpy.mockRestore()
    })
  })

  test('should log an error if JSON files are not ordered and --fix is not set', () => {
    jest.isolateModules(() => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      FileSystem.readdir.mockImplementation((_, callback) => {
        callback(null, ['file1.json'])
      })
      FileSystem.require.mockReturnValue({ b: 2, a: 1 })

      require('./i18n')

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '🔴 file1.json not ordered correctly. Run this script again with `--fix` to resolve the issue.'
      )
      consoleErrorSpy.mockRestore()
    })
  })

  test('should update JSON files if they are not ordered and --fix is set', () => {
    jest.isolateModules(() => {
      const originalProcessArgv = process.argv
      process.argv.push('--fix')
      const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})

      FileSystem.readdir.mockImplementation((_, callback) => {
        callback(null, ['file1.json'])
      })
      FileSystem.require.mockReturnValue({ b: 2, a: 1 })

      require('./i18n')

      expect(FileSystem.writeFileSync).toHaveBeenCalledWith(
        `${localesRoot}/file1.json`,
        JSON.stringify({ a: 1, b: 2 }, 0, 2)
      )
      expect(console.info).toHaveBeenCalledWith('🔵 file1.json updated')
      consoleInfoSpy.mockRestore()
      process.argv = originalProcessArgv
    })
  })

  test('should update JSON files if they are out-of-sync with base translations and --fix is set', () => {
    jest.isolateModules(() => {
      const originalProcessArgv = process.argv
      process.argv.push('--fix')
      const consoleErrorSpy = jest.spyOn(console, 'info').mockImplementation(() => {})
      FileSystem.readdir.mockImplementation((_, callback) => {
        callback(null, ['fr-FR.json', 'en-US.json'])
      })
      FileSystem.require.mockImplementation(filepath => {
        if (filepath.endsWith('en-US.json')) {
          return { goodbye: 'goodbye', thanks: 'thanks', hello: 'hello' }
        }
        return { thanks: 'merci', hello: 'bonjour' }
      })

      require('./i18n')

      expect(FileSystem.writeFileSync).toHaveBeenNthCalledWith(
        1,
        `${localesRoot}/fr-FR.json`,
        JSON.stringify({ goodbye: 'goodbye', hello: 'bonjour', thanks: 'merci' }, 0, 2)
      )
      expect(FileSystem.writeFileSync).toHaveBeenNthCalledWith(
        2,
        `${localesRoot}/en-US.json`,
        JSON.stringify({ goodbye: 'goodbye', hello: 'hello', thanks: 'thanks' }, 0, 2)
      )

      expect(console.info).toHaveBeenNthCalledWith(1, '🔵 fr-FR.json updated')
      expect(console.info).toHaveBeenNthCalledWith(2, '🔵 en-US.json updated')
      consoleErrorSpy.mockRestore()
      process.argv = originalProcessArgv
    })
  })

  test('should ignore non-JSON files', () => {
    jest.isolateModules(() => {
      const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})

      FileSystem.readdir.mockImplementation((_, callback) => {
        callback(null, ['file1.txt', 'file2.json'])
      })
      FileSystem.require.mockReturnValue({ a: 1, b: 2 })

      require('./i18n')

      expect(consoleInfoSpy).toHaveBeenCalledWith('🟢 file2.json good')
      expect(consoleInfoSpy).not.toHaveBeenCalledWith('🟢 file1.txt good')
      consoleInfoSpy.mockRestore()
    })
  })
})
