import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import { fileURLToPath } from "url"
import { createRequire } from "module"
import tailwindcss from "tailwindcss"
import autoprefixer from "autoprefixer"

const _require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Resolve the package root directory, then glob all JS/TS files.
 * Goes up from the resolved entry (e.g. dist/cjs/index.js) to the package root.
 * Handles yarn workspace hoisting where packages may live at monorepo root.
 */
function resolvePackageContentPath(packageName: string): string {
  try {
    const resolved = _require.resolve(packageName)
    // Walk up from dist/cjs/index.js (or dist/esm/index.js) to the package root
    // by finding the package.json location
    let dir = path.dirname(resolved)
    while (dir !== path.parse(dir).root) {
      try {
        _require.resolve(path.join(dir, "package.json"))
        // Found package root
        return path.join(dir, "**/*.{js,ts,jsx,tsx}")
      } catch {
        dir = path.dirname(dir)
      }
    }
    return path.join(path.dirname(resolved), "**/*.{js,ts,jsx,tsx}")
  } catch {
    return ""
  }
}

export default defineConfig({
  plugins: [react()],
  define: {
    __BASE__: JSON.stringify("/"),
    __BACKEND_URL__: JSON.stringify("/"),
    __STOREFRONT_URL__: JSON.stringify(""),
    __AUTH_TYPE__: JSON.stringify("session"),
    __JWT_TOKEN_STORAGE_KEY__: JSON.stringify(undefined),
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss({
          presets: [_require("@medusajs/ui-preset")],
          content: [
            path.resolve(__dirname, "index.html"),
            path.resolve(__dirname, "src/**/*.{js,ts,jsx,tsx}"),
            resolvePackageContentPath("@medusajs/ui"),
          ].filter(Boolean),
          darkMode: "class",
        } as any),
        autoprefixer(),
      ],
    },
  },
  server: {
    port: 5174,
    proxy: {
      "/admin": {
        target: "http://localhost:9000",
        changeOrigin: true,
      },
      "/auth": {
        target: "http://localhost:9000",
        changeOrigin: true,
      },
      "/store": {
        target: "http://localhost:9000",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
