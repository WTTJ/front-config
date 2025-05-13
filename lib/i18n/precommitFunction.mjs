import { readFileSync } from 'node:fs'
import { promisify } from 'util'
import { exec } from 'child_process'

import { isTranslationTaskNeeded } from './sync-utils.mjs'

export const translationTaskNeededMessage =
  '⚠️ This commit is going to be aborted because new translations have been found. Please add synced locales and check that everything is OK before commiting again'

export const stagedFilesNumberCommand = () => {
  const { config } = JSON.parse(readFileSync('package.json'))
  // const excludeString = config.i18n.path_to_ignore ? `:^${config.i18n.path_to_ignore}` : ''
  const excludeString = config.i18n.path_to_ignore
    ? `":(exclude)${config.i18n.path_to_ignore}"`
    : ''
  const extractFromString = config.i18n.extract_from_pattern
  // return `git --no-pager diff --staged ${excludeString} --name-only "${extractFromString}" | wc -l`
  return `git --no-pager diff --staged --name-only "${extractFromString}" ${excludeString} | wc -l`
}

export const precommit = async () => {
  const execute = promisify(exec)

  // get i18n config variables from package.json
  const { config } = JSON.parse(readFileSync('package.json'))
  const { stdout: stagedFilesNumber } = await execute(stagedFilesNumberCommand())
  console.log({
    stagedFilesNumber,
    command: stagedFilesNumberCommand(),
    config: config.i18n,
  })
  if (parseInt(stagedFilesNumber) === 0) {
    // exit early with no error because there is nothing to translate
    process.exit(0)
  }

  // function that returns the list of staged files to extract translations from
  const getExtractFrom = async () => {
    const exclusionPaths = [config.i18n.path_to_ignore, '**/*.d.ts'].filter(Boolean)
    const exclusionString = exclusionPaths.map(path => `":(exclude)${path}"`).join(' ')
    const { stdout: extractFromFileList } = await execute(`
      git --no-pager diff --staged --name-only "${config.i18n.extract_from_pattern}" ${exclusionString}
    `)
    return extractFromFileList?.replace(/\n/g, ' ').trim()
  }

  // extract translations from staged files and create
  // object of new translations in a temp.json file
  const extractFromFileList = await getExtractFrom()
  const extractCommand = `yarn run formatjs extract ${extractFromFileList} --out-file ${config.i18n.locales_dir_path}/temp.json --flatten --extract-source-location`
  const { stderr: extractError } = await execute(extractCommand)
  // eslint-disable-next-line no-console
  extractError && console.error(extractError)

  if (isTranslationTaskNeeded()) {
    // eslint-disable-next-line no-console
    console.error('=============================================')
    // eslint-disable-next-line no-console
    console.error(translationTaskNeededMessage)
    // eslint-disable-next-line no-console
    console.error('=============================================')
    // translation script needs to be launched because temp file translations are new
    // eslint-disable-next-line no-console
    console.log('🛠  Translating')
    // eslint-disable-next-line no-console
    console.log('=============================================')
    const { stdout: translationOutput } = await execute('yarn i18n:translate')
    // eslint-disable-next-line no-console
    console.log(translationOutput)

    // we exit with error so that commit hook aborts because new translations need to be checked
    // and added to the commit
    process.exit(1)
  } else {
    // no need to translate anything either because temp file object is empty
    // or because the translations it contains already exist in source locale
    await execute(`rm -f ${config.i18n.locales_dir_path}/temp.json`)

    process.exit(0)
  }
}
