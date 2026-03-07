const path = require("path")

/**
 * Dynamically resolve the actual paths to @medusajs packages,
 * since yarn workspace hoisting may place them at the monorepo root
 * rather than in admin/node_modules/.
 */
function resolvePackagePath(packageName) {
  try {
    return path.join(
      path.dirname(require.resolve(packageName)),
      "**/*.{js,ts,jsx,tsx}"
    )
  } catch (_e) {
    return ""
  }
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@medusajs/ui-preset")],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    resolvePackagePath("@medusajs/ui"),
  ].filter(Boolean),
  darkMode: "class",
}
