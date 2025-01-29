import fs from 'fs'
import path from 'path'
import util from 'util'

import { getNewToStaleIdMap } from './sync-utils.mjs'

const jsonsInDir = fs
  .readdirSync(process.env.LOCALES_DIR_PATH)
  .filter(file => path.extname(file) === '.json')

const locales = jsonsInDir.reduce((acc, file) => {
  const fileData = fs.readFileSync(path.join(process.env.LOCALES_DIR_PATH, file))
  const json = JSON.parse(fileData.toString())
  // don't use contextualized locales file when syncing
  if (file !== `contextualized-${process.env.DEFAULT_LANGUAGE_FILENAME}.json`) {
    acc[path.basename(file, '.json')] = json
  }
  return acc
}, {})

const {
  temp: newSourceLocale,
  [process.env.DEFAULT_LANGUAGE_FILENAME]: oldSourceLocale,
  ...targetLocales
} = locales

const { conflictingNewToStaleIdMap, newToStaleIdMap } = (await getNewToStaleIdMap()) || {
  conflictingNewToStaleIdMap: {},
  newToStaleIdMap: {},
}

Object.entries(targetLocales).forEach(async ([localeName, localeData]) => {
  let emptyKeysCount = 0
  const newTarget = Object.keys(newSourceLocale).reduce((acc, sourceKey) => {
    const translation = localeData[sourceKey] || localeData[newToStaleIdMap?.[sourceKey]] || ''
    acc[sourceKey] = translation
    if (translation === '') emptyKeysCount++
    return acc
  }, {})

  const toRevalidateKeys = Object.keys(newToStaleIdMap || {}).reduce((acc, key) => {
    if (newTarget[key]) {
      acc[key] = {
        is: newTarget[key],
        newSource: newSourceLocale[key],
        oldSource: oldSourceLocale[newToStaleIdMap[key]],
        oldId: newToStaleIdMap[key],
      }
    }
    return acc
  }, {})

  if (Object.keys(toRevalidateKeys).length > 0) {
    console.log(
      `\n👀 in ${localeName}.json, the following translations might need revalidation as the source translation changed:`,
      util.inspect(toRevalidateKeys, {
        colors: true,
        compact: false,
      }),
      '\n'
    )
  }

  if (Object.keys(conflictingNewToStaleIdMap).length > 0) {
    const conflictingTranslations = Object.keys(conflictingNewToStaleIdMap).reduce((acc, key) => {
      acc[key] = {
        is: targetLocales[localeName][conflictingNewToStaleIdMap[key]],
        newSource: newSourceLocale[key],
        oldSource: oldSourceLocale[conflictingNewToStaleIdMap[key]],
        oldId: conflictingNewToStaleIdMap[key],
      }
      return acc
    }, {})
    console.log(
      `\n🔍 in ${localeName}.json, we are not sure about the association between new / old ids in the following object:\n`,
      util.inspect(conflictingTranslations, {
        colors: true,
        compact: false,
      }),
      '\n'
    )
  }

  if (emptyKeysCount > 0) {
    console.log(
      `\n⚠️ ${localeName}.json still has ${emptyKeysCount}/${
        Object.keys(newTarget).length
      } untranslated keys (${
        Math.round((100 * (emptyKeysCount * 100)) / Object.keys(newTarget).length) / 100
      }%)\n`
    )
  }

  fs.writeFile(
    `${process.env.LOCALES_DIR_PATH}/${localeName}.json`,
    JSON.stringify(newTarget, null, 2),
    'utf8',
    err => {
      if (err) {
        console.log('An error occured while writing JSON Object to File.')
        return console.log(err)
      }

      console.log(`✅ ${localeName} locales have been synced in ${localeName}.json\n`)
    }
  )
})

// rename temp file to source file name
fs.rename(
  `${process.env.LOCALES_DIR_PATH}/temp.json`,
  `${process.env.LOCALES_DIR_PATH}/${process.env.DEFAULT_LANGUAGE_FILENAME}.json`,
  () => {
    console.log(`\ntemp.json file renamed to ${process.env.DEFAULT_LANGUAGE_FILENAME}!\n`)
  }
)
