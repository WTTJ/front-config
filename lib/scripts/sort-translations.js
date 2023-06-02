
/* eslint-disable no-console */
import fs from 'fs'
import path from 'path'

import { sortObj } from 'jsonabc'
import { argv } from 'yargs'

const { fix } = argv

const LOCALES = ['cs-CZ', 'en-US', 'es-ES', 'fr-FR', 'sk-SK']

let status = 0

LOCALES.forEach(file => {
  const filepath = path.join(__dirname, `../src/locales/${file}.json`)
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const translations = require(filepath)
    const sorted = sortObj(translations)

    const hasChanged = JSON.stringify(translations) !== JSON.stringify(sorted)

    // If fix, rewrite the file and show good / updated notification
    // Otherwise, show good / error notification
    if (fix) {
      if (hasChanged) {
        fs.writeFileSync(filepath, JSON.stringify(sorted, 0, 2))
        console.info(`🔵 ${file} updated`)
      } else {
        console.info(`🟢 ${file}`)
      }
    } else {
      if (hasChanged) {
        console.error(
          `🔴 ${file} not ordered correctly. Run this script again with \`--fix\` to resolve the issue.`
        )
        status = 1
      } else {
        console.info(`🟢 ${file}`)
      }
    }
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.error(`🔴 ${file} not found`)
    } else {
      console.error(`🔴 ${file}: ${error.code}`)
    }
  }
})

// Return check success
process.exit(status)
