import type { Theme as ThemeType } from 'vitepress'
import components from '@components/index.js'
import elTable from '@plugin/elementUI.js'
import vitepressNprogress from 'vitepress-plugin-nprogress'
import { Sandbox } from 'vitepress-plugin-sandpack'
import DefaultTheme from 'vitepress/theme'
import Layout from '../layout/index.vue'
import '../styles/index.scss'
import 'virtual:uno.css'
import 'vitepress-plugin-nprogress/lib/css/index.css'
import 'vitepress-plugin-sandpack/dist/style.css'

export default {
  extends: DefaultTheme,
  Layout,
  // Layout() {
  //   return h(DefaultTheme.Layout, null, {
  //     /**
  //      * 导航栏插入搜索的输入框插槽
  //      *
  //      * 更多插槽参考
  //      *
  //      * @see 布局插槽 https://vitepress.dev/zh/guide/extending-default-theme#layout-slots
  //      */
  //     'nav-bar-content-before': (): VNode => h(vpSearch)
  //   })
  // },
  enhanceApp(ctx) {
    const { app, router } = ctx

    DefaultTheme.enhanceApp(ctx)

    vitepressNprogress(ctx)

    app.component('Sandbox', Sandbox)

    app.use(elTable)
    app.use(components)
  },
} satisfies ThemeType
