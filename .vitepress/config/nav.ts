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
        text: 'JavaScript',
        activeMatch: '/docs/JavaScript',
        link: '/docs/JavaScript/index',
      },
      {
        text: 'Vue',
        activeMatch: '/docs/Vue',
        link: '/docs/Vue/index',
      },
      {
        text: 'TypeScript',
        activeMatch: '/docs/TypeScript',
        link: '/docs/TypeScript/index',
      },
      {
        text: 'ES6',
        activeMatch: '/docs/ES6',
        link: '/docs/ES6/index',
      },
      {
        text: 'PlayGrounds',
        activeMatch: '/docs/PlayGrounds',
        link: '/docs/PlayGrounds/index',
      },
      {
        text: '其他',
        activeMatch: '/docs/other',
        link: '/docs/other/index',
      },
    ],
  },
]
