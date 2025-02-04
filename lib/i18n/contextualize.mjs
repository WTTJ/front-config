import fs from 'fs'

// get i18n config variables from package.json
const { config } = JSON.parse(fs.readFileSync('package.json'))

let result = {}

const translations = JSON.parse(
  fs.readFileSync(`${config.i18n.locales_dir_path}/${config.i18n.default_language_filename}.json`)
)
const formatTranslations = Object.entries(translations).reduce(async (acc, [key, translation]) => {
  await acc
  result[key] = {
    translation,
    context: `https://github.com/search?q=repo:WTTJ/${config.i18n.app_name}+${key}+NOT+path:${config.i18n.locales_dir_path}/&type=code`,
  }

  return acc
}, Promise.resolve())

const writeTranslations = async () => {
  await formatTranslations
  fs.writeFile(
    `${config.i18n.locales_dir_path}/contextualized-${config.i18n.default_language_filename}.json`,
    JSON.stringify(result, null, 2),
    'utf8',
    err => {
      if (err) {
        console.log('An error occured while writing JSON Object to File.')
        return console.log(err)
      }

      console.log(
        `✅ source locales have been contextualized in contextualized-${config.i18n.default_language_filename}.json`
      )
    }
  )
}

writeTranslations()
