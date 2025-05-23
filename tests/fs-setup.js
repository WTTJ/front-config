import { vi } from 'vitest'
import { vol } from 'memfs'

vi.mock('node:fs')
vi.mock('node:fs/promises')

// reset the state of in-memory fs
vol.reset()
vol.fromJSON({
  'package.json': JSON.stringify({
    config: {
      i18n: {
        app_name: 'your-app-name',
        extract_from_pattern: 'src/**/*.js',
        locales_dir_path: '__mocks__/locales',
        default_language_filename: 'en-US',
      },
    },
  }),
})
