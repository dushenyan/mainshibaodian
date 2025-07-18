import { defineConfig } from 'vitepress';
import { nav } from './config/nav.js'
import { sidebar } from './config/sidebar.js'
import { PluginTable } from './plugin/index.js'
import type MarkdownIt from 'markdown-it'
import { withSidebar } from 'vitepress-sidebar';
import { UserConfig } from 'vitepress';
import container from 'markdown-it-container';
import { renderSandbox } from 'vitepress-plugin-sandpack';
import { VitePressSidebarOptions } from 'vitepress-sidebar/types';

/**
 * 更多配置项参考：
 * 
 * @see app-configs https://vitepress.vuejs.org/config/app-configs.html
 */
const vitePressOptions: UserConfig = {
  base: '/',
  appearance: true,
  // 标签页logo
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
    ['link', { rel: 'manifest', href: '/manifest.webmanifest' }], // chrome pwa
  ],
  title: 'shenyan′面试集合',
  /**
   * 是否显示最后更新时间
   *
   * @see last-updated https://vitepress.vuejs.org/guide/theme-last-updated#last-updated
   */
  lastUpdated: true,
  /**
   * 主题配置
   *
   * @see theme-config https://vitepress.vuejs.org/guide/migration-from-vitepress-0#theme-config
   */
  cacheDir: './node_modules/cache',
  themeConfig: {
    logo: '/logo.png',
    /**
     * 最后更新时间的文案显示
     *
     * @see lastUpdatedText https://vitepress.vuejs.org/config/theme-configs#lastupdatedtext
     */
    lastUpdatedText: '最后更新时间',
    /**
     * 配置导航栏图表
     *
     * @see socialLinks https://vitepress.vuejs.org/config/theme-configs#sociallinks
     */
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/Tyh2001/vitepress-template'
      }
    ],
    // 搜索
    search: {
      provider: 'local',
    },
    // 编辑
    editLink: {
      pattern: 'https://github.com/shoppingzh/vitepress-template/edit/main/docs/:path',
      text: '在Github编辑',
    },
    outline: [2, 4],
    outlineTitle: '目录',
    nav,
    sidebar
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
     * @param { Object } md markdown 实例
     */
    config: (md: MarkdownIt): void => {
      md.use(PluginTable).use(container, 'sandbox', {
        render(tokens, idx) {
          return renderSandbox(tokens, idx, 'sandbox');
        },
      });
      md.renderer.rules.heading_close = (tokens, idx, options, env, slf) => {
        let htmlResult = slf.renderToken(tokens, idx, options);
        if (tokens[idx].tag === 'h1') htmlResult += `<ArticleMetadata />`; // [!code focus]
        return htmlResult;
      }
    }
  }
}

const vitePressSidebarOptions: VitePressSidebarOptions = {
  documentRootPath: '/',
  scanStartPath: '/',
  collapsed: false,
  capitalizeFirst: true
};

export default defineConfig(withSidebar(vitePressOptions, vitePressSidebarOptions));
