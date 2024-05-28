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
    const thresholdsPaths = Object.keys(thresholds).slice(1)
    const { path, ...total } = coverage[0]

    const coverageByPath = thresholdsPaths.reduce(
      (prev, group) => {
        const matches = coverage.filter(item => new RegExp(group).test(item.path))

        // We're only interested in `lines` (not `statements`, `branches` etc)
        prev[group] = {
          lines: matches.reduce(getTotalCoverageForPath, {}),
        }

        return prev
      },
      { total: { lines: total } }
    )

    return coverageByPath
  } catch (err) {
    return undefined
  }
}
