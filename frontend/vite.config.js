import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

import { dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('http://localhost:5000'),
    'import.meta.env.VITE_BACKEND_URL': JSON.stringify('http://localhost:5000'),
  },
})
