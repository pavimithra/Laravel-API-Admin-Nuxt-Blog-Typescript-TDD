import { defineVitestConfig } from '@nuxt/test-utils/config'
import { fileURLToPath } from 'node:url'
import { configDefaults } from 'vitest/config'

export default defineVitestConfig({
    test: {
        globals: true,
        environment: 'happy-dom',
        root: fileURLToPath(new URL('./', import.meta.url)),
        exclude: [...configDefaults.exclude, 'e2e/*'],
    }
})