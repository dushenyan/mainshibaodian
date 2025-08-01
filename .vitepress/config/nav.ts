import docsTree from './docsTree.json'

interface NavItem {
  text: string
  activeMatch: string
  link: string
}

function getJiShuJiHe(): NavItem[] {
  const arr: NavItem[] = []
  docsTree.forEach((item) => {
    // 过滤项
    if (['nav'].includes(item.title))
      return
    arr.push({
      text: item.title,
      activeMatch: `/docs/index?name=${item.title}`,
      link: `/docs/index?name=${item.title}`,
    })
  })
  return arr
}

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
    items: getJiShuJiHe(),
  },
]
