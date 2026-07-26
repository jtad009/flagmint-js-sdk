import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import polyfillNode from 'rollup-plugin-polyfill-node';
import path from 'path';

import { readFileSync } from 'fs';

// Read package.json dynamically to keep version metrics synced automatically
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));


export default defineConfig({
  define: {
    '__SDK_VERSION__': JSON.stringify(pkg.version)
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'sdk'),
      'crypto': 'crypto-browserify'
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  build: {
     target: 'es2015',
    lib: {
      entry: './index.ts',
      name: 'flagmint',
      fileName: (format) => `flagmint.${format}.js`,
      formats: ['es', 'cjs', 'umd']
    },
    minify: false, 
    sourcemap: true,
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

