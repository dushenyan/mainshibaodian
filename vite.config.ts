import type { UserConfigExport } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import unocss from 'unocss/vite'
import { ViteAliases } from 'vite-aliases'

export default (): UserConfigExport => {
  return {
    server: {
      port: 1216,
    },
    optimizeDeps: {
      exclude: ['vitepress'],
    },
    plugins: [
      ViteAliases({
        dir: '.vitepress',
        prefix: '@',
        depth: 0,
        ovrConfig: true,
        dts: true,
      }),
      vueJsx(),
      unocss(),
    ],
    ssr: {
      noExternal: ['vitepress-plugin-nprogress'],
    },
  }
}
