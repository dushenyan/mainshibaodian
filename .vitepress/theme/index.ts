import { h, watch } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme as ThemeType } from 'vitepress'
import vpSearch from './components/vp-search.vue'
import '../styles/index.scss'
import type { VNode } from 'vue'
import elTable from '@plugin/element-ui.js'
import components from '@components/index.js'
import Layout from '../layout/index.vue'
import 'virtual:uno.css'
import vitepressNprogress from 'vitepress-plugin-nprogress'
import 'vitepress-plugin-nprogress/lib/css/index.css'
import { Sandbox } from 'vitepress-plugin-sandpack';
import 'vitepress-plugin-sandpack/dist/style.css';

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

    app.component('Sandbox', Sandbox);

    app.use(elTable)
    app.use(components)
  }
} satisfies ThemeType

