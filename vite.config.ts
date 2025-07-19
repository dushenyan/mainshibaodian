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
      ViteAliases({
        dir: './.vitepress',
        prefix: '@',
        depth: 0,
      }),
      vueJsx(),
      unocss(),
    ],
    ssr: {
      noExternal: ['vitepress-plugin-nprogress']
    },
  }
}
