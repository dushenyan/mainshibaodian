import type MarkdownIt from 'markdown-it'
import type { UserConfig } from 'vitepress'
import type { VitePressSidebarOptions } from 'vitepress-sidebar/types'
import container from 'markdown-it-container'
import { defineConfig } from 'vitepress'
import { renderSandbox } from 'vitepress-plugin-sandpack'
import { withSidebar } from 'vitepress-sidebar'
import { nav } from './config/nav.js'
import { sidebar } from './config/sidebar.js'
import { PluginTable } from './plugin/index.js'

/**
 * 更多配置项参考：
 *
 * @see app-configs https://vitepress.vuejs.org/config/app-configs.html
 */
const vitePressOptions: UserConfig = {
  base: '/',
  appearance: true,
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
    ['link', { rel: 'manifest', href: '/manifest.webmanifest' }], // chrome pwa
  ],
  title: 'shenyan′资源集合',
  lastUpdated: true,
  cacheDir: './node_modules/cache',
  themeConfig: {
    logo: '/logo.png',
    lastUpdatedText: '最后更新时间',
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/Tyh2001/vitepress-template',
      },
    ],
    search: {
      provider: 'local',
    },
    editLink: {
      pattern: 'https://github.com/shoppingzh/vitepress-template/edit/main/docs/:path',
      text: '在Github编辑',
    },
    outline: [2, 4],
    outlineTitle: '目录',
    nav,
    sidebar,
  },
  /**
   * 自定义 markdown 解析器
   *
   * @see markdown https://vitepress.vuejs.org/config/app-configs#markdown
   */
  markdown: {
    lineNumbers: false,
    image: {
      lazyLoading: true,
    },
    /**
     * 配置 Markdown-it 实例
     *
     * @param {object} md markdown 实例
     */
    config: (md: MarkdownIt): void => {
      md.use(PluginTable).use(container, 'sandbox', {
        render(tokens: any[], idx: number) {
          return renderSandbox(tokens, idx, 'sandbox')
        },
      })
      md.renderer.rules.heading_close = (tokens, idx, options, env, slf) => {
        let htmlResult = slf.renderToken(tokens, idx, options)
        if (tokens[idx].tag === 'h1')
          htmlResult += `<ArticleMetadata />` // [!code focus]
        return htmlResult
      }
    },
  },
  // 这里假设 docs 目录在项目根目录
  // async transformPageData(pageData) {
  //   console.log(pageData)
  //   // if (pageData.relativePath === 'index.md') {
  //   //   pageData.tree =
  //   // }
  //   return pageData
  // }
}

const vitePressSidebarOptions: VitePressSidebarOptions = {
  documentRootPath: '/',
  scanStartPath: '/docs',
  collapsed: false,
  capitalizeFirst: true,
}

// export default vitePressOptions
export default defineConfig(withSidebar(vitePressOptions, vitePressSidebarOptions))
