import { defineConfig, rollupVersion } from 'vite'
import { qwikVite } from '@builder.io/qwik/optimizer'

export default defineConfig(() => {
  return {
    build: {
      target: 'es2020',
      lib: {
        entry: './src/index.ts',
        formats: ['es', 'cjs'],
        fileName: (format) => `index.qwik.${format === 'es' ? 'mjs' : 'cjs'}`
      },
      rollupOptions: {
        external: ['graphql-request', 'graphql']
      },
      outDir: './dist'
    },
    plugins: [qwikVite()]
  }
})
