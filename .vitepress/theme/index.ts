import type { Theme as ThemeType } from 'vitepress'

import ElementPlus from 'element-plus'
import { useData } from 'vitepress'
import vitepressNprogress from 'vitepress-plugin-nprogress'

import { Sandbox } from 'vitepress-plugin-sandpack'
import DefaultTheme from 'vitepress/theme'
import { h, watch } from 'vue'
import { pinia } from '@/stores'
import Layout from '../layout/index.vue'
import components from './components/index'
import './styles/index.scss'

import 'virtual:uno.css'

let homePageStyle: HTMLStyleElement | undefined

export default {
  extends: DefaultTheme,
  Layout: () => {
    const props: Record<string, any> = {}
    // 获取 frontmatter
    const { frontmatter } = useData()

    /* 添加自定义 class */
    if (frontmatter.value?.layoutClass) {
      props.class = frontmatter.value.layoutClass
    }

    return h(Layout, props)
  },
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

    app.use(ElementPlus)

    app.use(pinia)

    app.component('Sandbox', Sandbox)
    app.use(components)

    if (typeof window !== 'undefined') {
      watch(
        () => router.route.data.relativePath,
        () =>
          updateHomePageStyle(
            /* /vitepress-nav-template/ 是为了兼容 GitHub Pages */
            location.pathname === '/',
          ),
        { immediate: true },
      )
    }
  },
} satisfies ThemeType

if (typeof window !== 'undefined') {
  // detect browser, add to class for conditional styling
  const browser = navigator.userAgent.toLowerCase()
  if (browser.includes('chrome')) {
    document.documentElement.classList.add('browser-chrome')
  }
  else if (browser.includes('firefox')) {
    document.documentElement.classList.add('browser-firefox')
  }
  else if (browser.includes('safari')) {
    document.documentElement.classList.add('browser-safari')
  }
}

// Speed up the rainbow animation on home page
function updateHomePageStyle(value: boolean): void {
  if (value) {
    if (homePageStyle)
      return

    homePageStyle = document.createElement('style')
    homePageStyle.innerHTML = `
    :root {
      animation: rainbow 12s linear infinite;
    }`
    document.body.appendChild(homePageStyle)
  }
  else {
    if (!homePageStyle)
      return

    homePageStyle.remove()
    homePageStyle = undefined
  }
}
