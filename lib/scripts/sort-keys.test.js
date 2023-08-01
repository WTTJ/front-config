import { describe, expect, test } from '@jest/globals'

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
    'jobs-home': 'jobs-home',
    'jobs-search': 'jobs-search',
    jobs_search: 'jobs_search',
    jobs: 'jobs',
    jobsSearch: 'jobsSearch',
  },
}

describe('sortKeys', () => {
  test('sorts keys correctly', () => {
    expect(JSON.stringify(sortKeys(TRANSLATIONS))).toBe(JSON.stringify(EXPECTED))
  })
})
