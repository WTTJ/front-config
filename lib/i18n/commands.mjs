import { readFileSync } from 'node:fs'

export const stagedFilesNumberCommand = () => {
  const { config } = JSON.parse(readFileSync('package.json'))
  const excludeString = config.i18n.path_to_ignore
    ? `":(exclude)${config.i18n.path_to_ignore}"`
    : ''
  const extractFromString = config.i18n.extract_from_pattern

  return `git --no-pager diff --staged --name-only "${extractFromString}" ${excludeString} | wc -l`
}
