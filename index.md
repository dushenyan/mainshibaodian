---
layout: home
layoutClass: 'm-home-layout'

hero:
  name: shenyan'资源集合
  tagline: 开箱即用的Vite Press模板，快速搭建你的文档网站。
  image:
    src: /brand.svg
  actions:
    - theme: brand
      text: 快速入手
      link: /docs/other/hello
features:
  - icon: ⚡
    title: 简单
    details: 开箱即用，只需要简单配置，就可以马上使用。
  - icon: 🛠️
    title: 全面
    details: 集成组件库、TailwindCSS、SVG图标等默认解决方案，应有尽有！
  - icon: ✊
    title: 强大
    link: https://github.com/shoppingzh/press-util
    linkText: 更多
    details: 自动生成导航栏与侧边栏，你的烦恼即是我的烦恼。
---

<style>
/*爱的魔力转圈圈*/
.m-home-layout .image-src:hover {
  transform: translate(-50%, -50%) rotate(666turn);
  transition: transform 59s 1s cubic-bezier(0.3, 0, 0.8, 1);
}

.m-home-layout .details small {
  opacity: 0.8;
}

.m-home-layout .bottom-small {
  display: block;
  margin-top: 2em;
  text-align: right;
}
</style>
