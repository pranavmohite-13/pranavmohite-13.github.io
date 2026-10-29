import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Preload the two Latin font files visible in the first screen (headline + body).
function preloadFonts(): Plugin {
  const wanted = [/space-grotesk-latin-wght-normal.*\.woff2$/, /inter-latin-wght-normal.*\.woff2$/]
  return {
    name: 'preload-fonts',
    apply: 'build',
    transformIndexHtml(_html, ctx) {
      const files = Object.keys(ctx.bundle ?? {}).filter((f) => wanted.some((re) => re.test(f)))
      return files.map((file) => ({
        tag: 'link',
        attrs: { rel: 'preload', href: `/${file}`, as: 'font', type: 'font/woff2', crossorigin: '' },
        injectTo: 'head-prepend' as const,
      }))
    },
  }
}

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss(), preloadFonts()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
