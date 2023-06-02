/* eslint-disable no-console */
import fs from 'fs'
import path from 'path'

import { sortObj } from 'jsonabc'
import { argv } from 'yargs'

const { fix } = argv

let status = 0

const localesRoot = path.join(process.cwd(), 'src/locales')

fs.readdir(localesRoot, (err, files) => {
  if (err) {
    return console.error("🔴 Can't read locales directory", localesRoot)
  }

  files.forEach(filename => {
    // Only treat .json files
    if (path.extname(filename) !== '.json') {
      return
    }
    try {
      const filepath = `${localesRoot}/${filename}`
      const translations = require(filepath)
      const sorted = sortObj(translations)

      const hasChanged = JSON.stringify(translations) !== JSON.stringify(sorted)

      // If fix, rewrite the file and show good / updated notification
      // Otherwise, show good / error notification
      if (fix) {
        if (hasChanged) {
          fs.writeFileSync(filepath, JSON.stringify(sorted, 0, 2))
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
