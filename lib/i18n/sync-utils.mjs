import { promisify } from 'util'
import { exec } from 'child_process'

const execute = promisify(exec)

export const getNewToStaleIdMap = async () => {
  const excludeString = process.env.PATH_TO_IGNORE ? `:^${process.env.PATH_TO_IGNORE}` : ''
  const { stderr: stagedDiffError, stdout: stagedDiff } = await execute(
    `git diff --staged ${excludeString} '${process.env.EXTRACT_FROM_PATTERN}'`
  )
  const { stderr: unstagedDiffError, stdout: unstagedDiff } = await execute(
    `git diff ${excludeString} '${process.env.EXTRACT_FROM_PATTERN}'`
  )

  const diff = unstagedDiff.concat(stagedDiff)
  if (diff) {
    const changesRegex = /(?<deleted>(?:^-[^-].+\n)+)(?<added>(?:^\+[^+].+\n)+)+/gm
    const changes = diff.matchAll(changesRegex)

    let changesList = []
    let newToStaleIdMap = {}
    let conflictingNewToStaleIdMap = {}

    for (let change of changes) {
      let { added, deleted } = change.groups
      const regex = /^[-|+].+?id[=|:][^'|"]?['|"](?<id>\S{6})['|"]/gm
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
    console.error(unstagedDiffError)
  }
  if (stagedDiffError) {
    console.error(stagedDiffError)
  }
}

getNewToStaleIdMap()
