import fs from 'fs'
import os from 'os'
import path from 'path'

import { afterAll, beforeAll, describe, expect, test } from '@jest/globals'

import FileSystem from './file-system'

describe('FileSystem', () => {
  let tempDir

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'file-system-test'))
  })

  afterAll(() => {
    fs.rmdirSync(tempDir, { recursive: true })
  })

  describe('readdir', () => {
    test('should read files in a directory', done => {
      const testFilePath1 = path.join(tempDir, 'file1.json')
      const testFilePath2 = path.join(tempDir, 'file2.json')

      fs.writeFileSync(testFilePath1, '{"hello": "world"}')
      fs.writeFileSync(testFilePath2, '{"foo": "bar"}')

      FileSystem.readdir(tempDir, (err, files) => {
        expect(err).toBeNull()
        expect(files).toContain('file1.json')
        expect(files).toContain('file2.json')
        done()
      })
    })

    test('should return an error if the directory does not exist', done => {
      const nonExistentPath = path.join(tempDir, 'non-existent-dir')

      FileSystem.readdir(nonExistentPath, (err, files) => {
        expect(err).toBeDefined()
        expect(files).toBeUndefined()
        done()
      })
    })
  })

  describe('require', () => {
    test('should require a module correctly', () => {
      const modulePath = path.resolve(__dirname, './file-system')
      const result = FileSystem.require(modulePath)
      expect(result).toBeDefined()
    })

    test('should throw an error if the module does not exist', () => {
      const modulePath = path.resolve(__dirname, './non-existent-module')
      expect(() => FileSystem.require(modulePath)).toThrow()
    })
  })

  describe('writeFileSync', () => {
    test('should write content to a file', () => {
      const testFilePath = path.join(tempDir, 'writeTest.txt')
      const content = 'Hello, this is a test'

      FileSystem.writeFileSync(testFilePath, content)

      const fileContent = fs.readFileSync(testFilePath, 'utf-8')
      expect(fileContent).toBe(content)
    })

    test('should throw an error if the file cannot be written', () => {
      const testFilePath = path.join(tempDir, 'non-existent-dir', 'writeTest.txt')
      const content = 'Hello, this is a test'

      expect(() => FileSystem.writeFileSync(testFilePath, content)).toThrow()
    })
  })
})
