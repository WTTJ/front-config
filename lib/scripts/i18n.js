/* eslint-disable no-console */
import path from 'path'

import { argv } from 'yargs'

import FileSystem from './file-system'
import { sortKeys } from './sort-keys'
import { addMissingKeys } from './missing-keys'

const { fix } = argv

let status = 0

const localesRoot = path.join(process.cwd(), 'src/locales')

function transform(object, base, isBase) {
  if (isBase) {
    return sortKeys(object)
  } else {
    return sortKeys(addMissingKeys(base, object))
  }
}

FileSystem.readdir(localesRoot, (err, files) => {
  if (err) {
    return console.error("🔴 Can't read locales directory", localesRoot)
  }

  const baseFile = FileSystem.require(`${localesRoot}/en-US.json`)

  files.forEach(filename => {
    // Only treat .json files
    if (path.extname(filename) !== '.json') {
      return
    }

    try {
      const filepath = `${localesRoot}/${filename}`
      const translations = FileSystem.require(filepath)
      const output = transform(translations, baseFile, filename.endsWith('en-US.json'))
      const hasChanged = JSON.stringify(translations) !== JSON.stringify(output)

      // If fix, rewrite the file and show good / updated notification
      // Otherwise, show good / error notification
      if (fix) {
        if (hasChanged) {
          FileSystem.writeFileSync(filepath, JSON.stringify(output, 0, 2))
          console.info(`🔵 ${filename} updated`)
        } else {
          console.info(`🟢 ${filename} good`)
        }
      } else {
        if (hasChanged) {
          console.error(
            `🔴 ${filename} not ordered correctly. Run this script again with \`--fix\` to resolve the issue.`
          )
          status = 1
        } else {
          console.info(`🟢 ${filename} good`)
        }
      }
    } catch (error) {
      console.error(`🔴 ${filename}: ${error.code}`)
    }
  })

  // Return check success
  process.exit(status)
})
