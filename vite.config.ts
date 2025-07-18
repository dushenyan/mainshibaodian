import type { UserConfigExport } from 'vite'
import unocss from 'unocss/vite'
import { ViteAliases } from 'vite-aliases'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default (): UserConfigExport => {
  return {
    server: {
      port: 1216
    },
    optimizeDeps: {
      exclude: ['vitepress']
    },
    plugins: [
      vueJsx(),
      ViteAliases({
        dir: '.',
      }),
      unocss(),
    ],
    ssr: {
      noExternal: ['vitepress-plugin-nprogress']
    },
  }
}
