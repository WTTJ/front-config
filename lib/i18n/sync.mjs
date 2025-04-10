import { readdirSync, readFileSync, rename, writeFile } from 'node:fs'
import path from 'path'
import util from 'util'

import { getNewToStaleIdMap } from './sync-utils.mjs'

// get i18n config variables from package.json
const { config } = JSON.parse(readFileSync('package.json'))

const jsonsInDir = readdirSync(config.i18n.locales_dir_path).filter(
  file => path.extname(file) === '.json'
)

const locales = jsonsInDir.reduce((acc, file) => {
  const fileData = readFileSync(path.join(config.i18n.locales_dir_path, file))
  const json = JSON.parse(fileData.toString())
  // don't use contextualized locales file when syncing
  if (file !== `contextualized-${config.i18n.default_language_filename}.json`) {
    acc[path.basename(file, '.json')] = json
  }
  return acc
}, {})

const {
  temp: newSourceLocale,
  [config.i18n.default_language_filename]: oldSourceLocale,
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
        oldId: newToStaleIdMap[key],
        toRevalidate: newTarget[key],
        oldSourceTranslation: oldSourceLocale[newToStaleIdMap[key]],
        newSourceTranslation: newSourceLocale[key],
      }
    }
    return acc
  }, {})

  if (Object.keys(toRevalidateKeys).length > 0) {
    // eslint-disable-next-line no-console
    console.log(
      `\n👀 in ${localeName}.json, the following translations might need revalidation as the source translation changed:`,
      util.inspect(toRevalidateKeys, {
        colors: true,
        compact: false,
      })
    )
  }

  if (Object.keys(conflictingNewToStaleIdMap).length > 0) {
    const conflictingTranslations = Object.keys(conflictingNewToStaleIdMap).reduce((acc, key) => {
      acc[key] = {
        oldId: conflictingNewToStaleIdMap[key],
        toRevalidate: targetLocales[localeName][conflictingNewToStaleIdMap[key]],
        oldSourceTranslation: oldSourceLocale[conflictingNewToStaleIdMap[key]],
        newSourceTranslation: newSourceLocale[key],
      }
      return acc
    }, {})
    // eslint-disable-next-line no-console
    console.log(
      `\n🔍 in ${localeName}.json, we are not sure about the association between new / old ids in the following object:\n`,
      util.inspect(conflictingTranslations, {
        colors: true,
        compact: false,
      })
    )
  }

  if (emptyKeysCount > 0) {
    // eslint-disable-next-line no-console
    console.log(
      `\n⚠️ ${localeName}.json still has ${emptyKeysCount}/${
        Object.keys(newTarget).length
      } untranslated keys (${
        Math.round((100 * (emptyKeysCount * 100)) / Object.keys(newTarget).length) / 100
      }%)`
    )
  }

  writeFile(
    `${config.i18n.locales_dir_path}/${localeName}.json`,
    JSON.stringify(newTarget, null, 2),
    'utf8',
    err => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('An error occured while writing JSON Object to File.')
        // eslint-disable-next-line no-console
        return console.log(err)
      }

      // eslint-disable-next-line no-console
      console.log(`✅ ${localeName} locales have been synced in ${localeName}.json`)
    }
  )
})

// rename temp file to source file name
rename(
  `${config.i18n.locales_dir_path}/temp.json`,
  `${config.i18n.locales_dir_path}/${config.i18n.default_language_filename}.json`,
  () => {
    // eslint-disable-next-line no-console
    console.log(`✅ temp.json file renamed to ${config.i18n.default_language_filename}!`)
  }
)
