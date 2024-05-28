import { groupByPath } from './group-coverage'

const jestThresholds = {
  global: {
    lines: 70,
  },
  'src/components/SearchNew': {
    lines: 89,
  },
  'src/pages/Jobs/Show': {
    lines: 70,
  },
  'src/pages/Home/CandidateHub': {
    lines: 70,
  },
  'src/pages/Organizations/Show': {
    lines: 75,
  },
  'src/pages/Organizations/CompanyNews': {
    lines: 25,
  },
  'src/utils/search': {
    lines: 90,
  },
}

const viteThresholds = {
  lines: 70,
  '**/components/SearchNew/**': {
    lines: 89,
  },
  '**/pages/Jobs/Show/**': {
    lines: 70,
  },
  '**/pages/Home/CandidateHub/**': {
    lines: 70,
  },
  '**/pages/Organizations/Show/**': {
    lines: 75,
  },
  '**/pages/Organizations/CompanyNews/**': {
    lines: 25,
  },
  '**/utils/search/**': {
    lines: 90,
  },
}

const coverage = [
  { path: 'global', total: 8106, covered: 5925, skipped: 0, pct: 73.09 },
  { path: 'src/components/SearchNew', total: 774, covered: 701, skipped: 0, pct: 90.57 },
  { path: 'src/components/SearchNew/pages', total: 26, covered: 13, skipped: 0, pct: 50 },
  { path: 'src/pages/Jobs/Show', total: 555, covered: 413, skipped: 0, pct: 74.41 },
  { path: 'src/pages/Home/CandidateHub', total: 168, covered: 129, skipped: 0, pct: 76.79 },
  { path: 'src/pages/Organizations/Show', total: 506, covered: 357, skipped: 0, pct: 70.55 },
  { path: 'src/pages/Organizations/CompanyNews', total: 99, covered: 27, skipped: 0, pct: 27.27 },
  { path: 'src/utils/search', total: 786, covered: 748, skipped: 0, pct: 95.17 },
]

const groupedCoverage = {
  total: { lines: { total: 8106, covered: 5925, skipped: 0, pct: 73.09 } },
  'src/components/SearchNew': { lines: { total: 800, covered: 714, skipped: 0, pct: 89.25 } },
  'src/pages/Jobs/Show': { lines: { total: 555, covered: 413, skipped: 0, pct: 74.41 } },
  'src/pages/Home/CandidateHub': { lines: { total: 168, covered: 129, skipped: 0, pct: 76.79 } },
  'src/pages/Organizations/Show': { lines: { total: 506, covered: 357, skipped: 0, pct: 70.55 } },
  'src/pages/Organizations/CompanyNews': {
    lines: { total: 99, covered: 27, skipped: 0, pct: 27.27 },
  },
  'src/utils/search': { lines: { total: 786, covered: 748, skipped: 0, pct: 95.17 } },
}

describe('groupByPath', () => {
  test('should group Jest coverage by threshold path', () => {
    expect(groupByPath({ coverage, thresholds: jestThresholds })).toEqual(groupedCoverage)
  })
  test('should group Vite coverage by threshold path', () => {
    expect(groupByPath({ coverage, thresholds: viteThresholds })).toEqual(groupedCoverage)
  })
})
