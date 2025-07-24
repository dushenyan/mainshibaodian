/**
 * 顶部导航栏菜单
 *
 * @see Nav https://vitepress.vuejs.org/guide/theme-nav#nav
 */
export const nav = [
  {
    text: '资源导航',
    activeMatch: '/docs/nav',
    link: '/docs/nav/index',
  },
  {
    text: '技术集合',
    items: [
      {
        text: 'Vue',
        activeMatch: '/docs/vue',
        link: '/docs/vue/index',
      },
      {
        text: 'TypeScript',
        activeMatch: '/docs/typescript',
        link: '/docs/typescript/index',
      },
      {
        text: 'ES6',
        activeMatch: '/docs/ES6',
        link: '/docs/ES6/index',
      },
      {
        text: 'playgounds',
        activeMatch: '/docs/playgounds',
        link: '/docs/playgounds/index',
      },
      {
        text: '其他',
        activeMatch: '/docs/other',
        link: '/docs/other/index',
      },
    ],
  },
]
