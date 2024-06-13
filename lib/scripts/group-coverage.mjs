const getTotalCoverageForPath = (prev, item) => {
  // Add up all values for path
  prev = {
    ...prev,
    total: (prev.total || 0) + (item?.total || 0),
    covered: (prev.covered || 0) + (item?.covered || 0),
    skipped: (prev.skipped || 0) + (item?.skipped || 0),
  }
  // Round to 2 decimal places
  prev.pct = Number(((prev.covered / prev.total) * 100).toFixed(2))

  return prev
}

export const groupByPath = ({ coverage, thresholds }) => {
  try {
    // Jest and Vite have different threshold definition patterns so we set them to be the same:
    // Vite uses `**/components/SearchNew/**`
    // We convert to Jest format `src/components/SearchNew`
    const thresholdsPaths = Object.keys(thresholds)
      .slice(1)
      .map(key => key.replace(/^\*{2}/, 'src').replace(/\/\*{2}$/, ''))

    // Jest and Vite have different coverage patterns so we set them to be the same:
    // Vite uses `{ lines: 10, 'my_path': { lines: 4 } }`
    // We convert to Jest format `{ global: { lines: 10 }, 'my_path': { lines: 4 } }`
    if (thresholds.lines) {
      thresholds.global = { lines: thresholds.lines }
      delete thresholds.lines
    }

    const { path, ...totalCoverage } = coverage[0]

    const coverageByPath = thresholdsPaths.reduce(
      (prev, group) => {
        const matches = coverage.filter(item => new RegExp(group).test(item.path))

        // We're only interested in `lines` (not `statements`, `branches` etc)
        prev[group] = {
          lines: matches.reduce(getTotalCoverageForPath, {}),
        }

        return prev
      },
      { total: { lines: totalCoverage } }
    )

    return coverageByPath
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('groupByPath', err)
    return undefined
  }
}
