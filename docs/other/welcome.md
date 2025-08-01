# welcome

## 欢迎使用

相信你已经基本上了解这个项目了，赶快开始吧！

## 我的开源

下面是一些的我开源，欢迎 `Star`~

- [fighting-design](https://github.com/FightingDesign/fighting-design) vue3 组件库
- [tyh-blog](https://github.com/Tyh2001/tyh-blog) 我的博客
- [tian-classmate](https://github.com/Tyh2001/tian-classmate) 我的简历
- [tyh-theme-vscode](https://github.com/Tyh2001/tyh-theme-vscode) vscode 主题插件

::: sandbox {template=vue3-ts}
:::

::: sandbox {showLineNumbers lightTheme=githubLight deps="vue3-toastify: latest"}

```vue App.vue
<script setup>
import { toast } from 'vue3-toastify'

function notify() {
  toast('Wow so easy !', {
    autoClose: 1000,
  }) // ToastOptions
}
</script>

<template>
  <div>
    <button @click="notify">
      Notify !
    </button>
  </div>
</template>
```

```js /src/main.js [active] [readOnly]
import { createApp } from 'vue'
import Vue3Toasity from 'vue3-toastify'
import App from './App.vue'
import 'vue3-toastify/dist/index.css'

createApp(App).use(
  Vue3Toasity,
  {
    autoClose: 3000,
  },
).mount('#app')
```

:::
