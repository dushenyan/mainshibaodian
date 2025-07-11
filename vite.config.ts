import type { UserConfigExport } from 'vite'
import unocss from 'unocss/vite'

export default (): UserConfigExport => {
  return {
    server: {
      port: 1216
    },
    optimizeDeps: {
      exclude: ['vitepress']
    },
    plugins: [
      unocss()
    ],
    ssr: {
      noExternal: ['vitepress-plugin-nprogress']
    },
  }
}
