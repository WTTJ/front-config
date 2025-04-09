import fs from 'fs'

// get i18n config variables from package.json
const { config } = JSON.parse(fs.readFileSync('package.json'))

export const isTranslationTaskNeeded = (tempTranslations, sourceTranslations) => {
  tempTranslations ||= JSON.parse(fs.readFileSync(`${config.i18n.locales_dir_path}/temp.json`))
  const tempKeys = Object.keys(tempTranslations)

  sourceTranslations ||= JSON.parse(
    fs.readFileSync(`${config.i18n.locales_dir_path}/${config.i18n.default_language_filename}.json`)
  )

  const idExists = id => Boolean(sourceTranslations[id])

  return tempKeys.length > 0 && !tempKeys.every(idExists)
}
