import { defineConfig } from 'vite'
import { resolve } from 'path'
import { copyFileSync, existsSync } from 'fs'

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        flugschule: resolve(__dirname, 'src/flugschule/index.html'),
        charter: resolve(__dirname, 'src/charter/index.html'),
        flotte: resolve(__dirname, 'src/flotte/index.html')
      },
      // Copy SEO files to root of dist
      external: [],
      output: {
        // Optimize chunk splitting
        manualChunks: {
          vendor: ['tailwindcss']
        },
        // Optimize asset naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif)$/i.test(assetInfo.name)) {
            return `assets/images/[name]-[hash][extname]`
          }
          if (/\.(css)$/i.test(assetInfo.name)) {
            return `assets/css/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    },
    // Optimize for static hosting and performance
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    cssMinify: true,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn']
      },
      format: {
        comments: false
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Optimize assets
    assetsInlineLimit: 4096 // Inline assets smaller than 4kb
  },
  server: {
    port: 3000,
    open: true,
    host: true
  },
  preview: {
    port: 3000,
    host: true
  },
  // Optimize assets
  assetsInclude: ['**/*.webp', '**/*.avif'],
  css: {
    postcss: './postcss.config.js'
  },
  // Enable experimental features for better performance
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js') {
        return { js: `"${filename}"` }
      } else {
        return { relative: true }
      }
    }
  },
  plugins: [
    {
      name: 'copy-seo-files',
      writeBundle() {
        // Copy sitemap.xml and robots.txt to dist root
        const files = ['sitemap.xml', 'robots.txt'];
        files.forEach(file => {
          const src = resolve(__dirname, 'src', file);
          const dest = resolve(__dirname, 'dist', file);
          if (existsSync(src)) {
            copyFileSync(src, dest);
            console.log(`Copied ${file} to dist root`);
          }
        });
      }
    }
  ]
})