import fs from 'fs'

let result = {}

const translations = JSON.parse(
  fs.readFileSync(`${process.env.LOCALES_DIR_PATH}/${process.env.DEFAULT_LANGUAGE_FILENAME}.json`)
)
const formatTranslations = Object.entries(translations).reduce(async (acc, [key, translation]) => {
  await acc
  result[key] = {
    translation,
    context: `https://github.com/search?q=repo:WTTJ/${process.env.APP_NAME}+${key}+NOT+path:${process.env.LOCALES_DIR_PATH}/&type=code`,
  }

  return acc
}, Promise.resolve())

const writeTranslations = async () => {
  await formatTranslations
  fs.writeFile(
    `${process.env.LOCALES_DIR_PATH}/contextualized-${process.env.DEFAULT_LANGUAGE_FILENAME}.json`,
    JSON.stringify(result, null, 2),
    'utf8',
    err => {
      if (err) {
        console.log('An error occured while writing JSON Object to File.')
        return console.log(err)
      }

      console.log(
        `\n✅ source locales have been contextualized in contextualized-${process.env.DEFAULT_LANGUAGE_FILENAME}.json`
      )
    }
  )
}

writeTranslations()
