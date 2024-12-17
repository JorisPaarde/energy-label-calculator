import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import replace from '@rollup/plugin-replace'

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      jsxDev: mode !== 'production',
      babel: {
        plugins: ['@babel/plugin-transform-react-jsx']
      }
    }),
    replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify(mode),
        'global': 'window'
      }
    })
  ],
  
  base: '/',
  
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    
    lib: {
      entry: path.resolve(__dirname, 'src/wordpress-entry.jsx'),
      name: 'EnergyCalculator',
      formats: ['iife'],
      fileName: () => 'wordpress-widget.js'
    },
    
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'wordpress-widget.css'
          }
          return assetInfo.name
        }
      }
    }
  },
  
  server: {
    port: 3000,
    open: '/wordpress-test/index.html',
    cors: true
  }
}))
