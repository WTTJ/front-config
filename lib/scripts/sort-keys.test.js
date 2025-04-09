import { describe, expect, test } from 'vitest'

import { sortKeys } from './sort-keys'

const TRANSLATIONS = {
  headings: {
    jobsSearch: 'jobsSearch',
    jobs: 'jobs',
    jobs_search: 'jobs_search',
    'jobs-search': 'jobs-search',
    'jobs-home': 'jobs-home',
  },
}

const EXPECTED = {
  headings: {
    jobs: 'jobs',
    'jobs-home': 'jobs-home',
    'jobs-search': 'jobs-search',
    jobs_search: 'jobs_search',
    jobsSearch: 'jobsSearch',
  },
}

describe('sortKeys', () => {
  test('sorts keys correctly', () => {
    expect(JSON.stringify(sortKeys(TRANSLATIONS))).toBe(JSON.stringify(EXPECTED))
  })
})
