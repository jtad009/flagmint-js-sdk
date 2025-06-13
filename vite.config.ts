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
    lib: {
      entry: './index.ts',
      name: 'flagmint',
      fileName: (format) => `flagmint.${format}.js`,
      formats: ['es', 'cjs', 'umd']
    },
    rollupOptions: {
      external: [], // no need to externalize crypto if we polyfill it
      output: {
        globals: { /* no need for crypto here */ }
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

