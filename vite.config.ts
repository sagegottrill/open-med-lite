import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/** `immediate` (via PouchDB) and some Pouch browser entries use Node's `global`, which browsers lack. */
function nodeGlobalBrowserShim(): Plugin {
  return {
    name: 'node-global-browser-shim',
    enforce: 'pre',
    transform(code, id) {
      const path = id.replace(/\\/g, '/')
      const needsGlobal =
        path.includes('/immediate/lib/') ||
        path.includes('pouchdb-utils/lib/index-browser')
      if (!needsGlobal) return null
      if (code.startsWith('const global = globalThis;')) return null
      return `const global = globalThis;\n${code}`
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), nodeGlobalBrowserShim()],
  define: {
    // Helps app source and some deps; Pouch browser entry also needs the transform above.
    global: 'globalThis',
  },
  resolve: {
    alias: {
      events: 'events',
    },
  },
})
