import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import polyfillNode from 'rollup-plugin-polyfill-node';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'sdk'),
      'crypto': 'crypto-browserify'
    }
  },
  build: {
     target: 'es2015',
    lib: {
      entry: './index.ts',
      name: 'flagmint',
      fileName: (format) => `flagmint.${format}.js`,
      formats: ['es', 'cjs', 'umd']
    },
    rollupOptions: {
      external: ['ws'], // Externalize ws for Node.js environments
      output: {
        globals: {
          'ws': 'ws'
        }
      },
      plugins: [
        polyfillNode()
      ]
    }
  },
  plugins: [
    dts({ insertTypesEntry: true, tsConfigFilePath: './tsconfig.json',  entryRoot: '.' })
  ]
});

