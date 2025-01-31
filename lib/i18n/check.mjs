import fs from 'fs'

// get i18n config variables from package.json
const { config } = JSON.parse(fs.readFileSync('package.json'))

export const isTranslationTaskNeeded = () => {
  const tempTranslations = JSON.parse(fs.readFileSync(`${config.i18n.locales_dir_path}/temp.json`))
  const tempKeys = Object.keys(tempTranslations)
  const sourceTranslations = JSON.parse(
    fs.readFileSync(`${config.i18n.locales_dir_path}/${config.i18n.default_language_filename}.json`)
  )

  const idExists = id => Boolean(sourceTranslations[id])

  if (tempKeys.length > 0 && !tempKeys.every(idExists)) {
    console.error('=============================================')
    console.error(
      '⚠️ This commit is going to be aborted because new translations have been found. Please add synced locales and check that everything is OK before commiting again'
    )
    console.error('=============================================')
    return true
  }
  return false
}
