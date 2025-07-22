import type MarkdownIt from 'markdown-it'
import type { UserConfig } from 'vitepress'
import type { VitePressSidebarOptions } from 'vitepress-sidebar/types'
import container from 'markdown-it-container'
import { defineConfig } from 'vitepress'
import { renderSandbox } from 'vitepress-plugin-sandpack'
import { withSidebar } from 'vitepress-sidebar'
import { nav } from './config/nav'
import { sidebar } from './config/sidebar'
import { PluginTable } from './plugin'
import markdownBracketEscaper from './plugin/markdownBracketEscaper'
import runIndexOnStart from './plugin/runIndexOnStart'

const vitePressOptions: UserConfig = {
  title: 'shenyan′资源集合',
  lang: 'zh-CN',
  base: '/',
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' },
    ],
    ['link', { rel: 'manifest', href: '/manifest.webmanifest' },
    ], // chrome pwa
  ],

  cacheDir: './node_modules/cache',

  cleanUrls: true,
  rewrites: {
    '/docs/:page': '/:page',
  },

  metaChunk: true,

  lastUpdated: true,
  appearance: true,

  themeConfig: {
    logo: '/logo.png',
    lastUpdatedText: '最后更新时间',
    socialLinks: [
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
        },
        link: 'https://duhenyanblog.netlify.app/',
      },
      {
        icon: 'github',
        link: 'https://github.com/dushenyan/mainshibaodian',
      },
    ],
    lightModeSwitchTitle: '切换浅色',
    darkModeSwitchTitle: '切换深色',
    sidebarMenuLabel: '合集',
    returnToTopLabel: '返回顶部',
    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
    lastUpdated: {
      text: '最近更新时间: ',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium',
      },
    },
    search: {
      provider: 'local',
    },
    editLink: {
      pattern: 'https://github.com/dushenyan/mainshibaodian/edit/main/:path',
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
  vite: {
    plugins: [markdownBracketEscaper, runIndexOnStart],
  },
}

const vitePressSidebarOptions: VitePressSidebarOptions = {
  documentRootPath: '/',
  scanStartPath: '/docs',
  collapsed: false,
  capitalizeFirst: true,
}

// export default vitePressOptions
export default defineConfig(withSidebar(vitePressOptions, vitePressSidebarOptions))
