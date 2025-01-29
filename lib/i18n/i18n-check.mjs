import fs from 'fs'

const tempTranslations = JSON.parse(fs.readFileSync(`${process.env.LOCALES_DIR_PATH}/temp.json`))
const tempKeys = Object.keys(tempTranslations)
const sourceTranslations = JSON.parse(
  fs.readFileSync(`${process.env.LOCALES_DIR_PATH}/${process.env.DEFAULT_LANGUAGE_FILENAME}.json`)
)

const idExists = id => Boolean(sourceTranslations[id])

if (tempKeys.length > 0 && !tempKeys.every(idExists)) {
  console.error('=============================================')
  console.error(
    '⚠️ This commit is going to be aborted because new translations have been found. Please add synced locales and check that everything is OK before commiting again'
  )
  console.error('=============================================')
  process.exit(1)
} else {
  process.exit(0)
}
