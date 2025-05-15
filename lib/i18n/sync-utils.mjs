import { readFileSync } from 'node:fs'
import { promisify } from 'util'
import { exec } from 'child_process'

const execute = promisify(exec)

// get i18n config variables from package.json
const { config } = JSON.parse(readFileSync('package.json'))

export const isTranslationTaskNeeded = () => {
  const tempTranslations = JSON.parse(readFileSync(`${config.i18n.locales_dir_path}/temp.json`))
  const tempKeys = Object.keys(tempTranslations)

  const sourceTranslations = JSON.parse(
    readFileSync(`${config.i18n.locales_dir_path}/${config.i18n.default_language_filename}.json`)
  )

  const idExists = id => Boolean(sourceTranslations[id])

  return tempKeys.length > 0 && !tempKeys.every(idExists)
}

/**
 * Captures both formats: with app prefixes like "employer-branding-components-8WKgF6" and without like "ABC123"
 *
 * id[=:] // Matches "id" followed by either = or :
 *
 * \s* // Matches any white space characters between 0 and unlimited times
 *
 * ['"] // Matches either single or double quote
 *
 * (?<id>(?:${config.i18n.app_name}-)? // Named capturing group "id" containing app name followed by hyphen
 *
 * \S{6} // Exactly 6 characters that can be word chars or hyphens
 *
 * ['"] // Closing quote (single or double)
 *
 * /g // Global flag
 */

export const regex = new RegExp(`id[=:]\\s*['"](?<id>(?:${config.i18n.app_name}-)?\\S{6})['"]`, 'g')

export const getNewToStaleIdMap = async () => {
  const excludeString = config.i18n.path_to_ignore ? `:^${config.i18n.path_to_ignore}` : ''
  const { stderr: stagedDiffError, stdout: stagedDiff } = await execute(
    `git diff --staged ${excludeString} '${config.i18n.extract_from_pattern}'`
  )
  const { stderr: unstagedDiffError, stdout: unstagedDiff } = await execute(
    `git diff ${excludeString} '${config.i18n.extract_from_pattern}'`
  )

  const diff = unstagedDiff?.concat(stagedDiff)
  if (diff) {
    const changesRegex = /(?<deleted>(?:^-[^-].+\n)+)(?<added>(?:^\+[^+].+\n)+)+/gm
    const changes = diff.matchAll(changesRegex)

    let changesList = []
    let newToStaleIdMap = {}
    let conflictingNewToStaleIdMap = {}

    for (let change of changes) {
      let { added, deleted } = change.groups
      const deletedChanges = deleted.matchAll(regex)

      // retrieve id.s from deleted lines
      let deletedIds = []
      for (let deletedChange of deletedChanges) {
        let { id: deletedId } = deletedChange.groups || {}
        deletedIds.push(deletedId)
      }

      // retrieve id.s from added lines
      const addedChanges = added.matchAll(regex)
      let addedIds = []
      for (let addedChange of addedChanges) {
        let { id: addedId } = addedChange.groups || {}
        addedIds.push(addedId)
      }

      // push arrays of id.s in deleted / added keys for each mofification couple
      changesList.push({ deleted: deletedIds, added: addedIds })
    }

    changesList.map(({ added, deleted }) => {
      if (deleted.length === 1 && added.length === 1) {
        let [a] = added
        let [d] = deleted
        newToStaleIdMap[a] = d
      } else {
        added.forEach(newId => {
          const hasMultipleDeletedIds = deleted.length > 1
          conflictingNewToStaleIdMap[newId] = hasMultipleDeletedIds ? deleted : deleted[0]
        })
      }
    })
    return { newToStaleIdMap, conflictingNewToStaleIdMap }
  }
  if (unstagedDiffError) {
    // eslint-disable-next-line no-console
    console.error(unstagedDiffError)
  }
  if (stagedDiffError) {
    // eslint-disable-next-line no-console
    console.error(stagedDiffError)
  }
}

getNewToStaleIdMap()
