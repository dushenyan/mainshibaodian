<template>
  <LockScreen ref="lockScreenRef" />
  <Layout>
    <template #layout-top>
      <el-backtop>
        <svg-icon name="zujian" class="text-2xl text-blue-500" />
      </el-backtop>
    </template>
    <template #doc-before>
      <DocBefore />
    </template>
  </Layout>
</template>

<script lang="ts">
export const injectKey = Symbol('Layout')
</script>

<script setup lang="ts">
// 具体使用参见：https://vitepress.vuejs.org/guide/theme-introduction#extending-the-default-theme
import Theme from 'vitepress/theme'
import mediumZoom, { Zoom } from 'medium-zoom'
import confetti from "canvas-confetti";
import { onBeforeMount, createApp, watch, nextTick } from 'vue'
import { onContentUpdated, inBrowser, useData } from 'vitepress'
import LockScreen from '@components/LockScreen.vue'
import HomeUnderline from '@components/HomeUnderline'

const { Layout } = Theme
const { frontmatter: fm } = useData();
let zoom: Zoom

onContentUpdated(() => {
  if (!zoom) return
  zoom.detach('.VPDoc img')
  zoom.attach('.VPDoc img')
})

onBeforeMount(() => {
  zoom = mediumZoom(undefined, {
    background: 'rgba(0, 0, 0, .75)',
  })
})

function performDOMOperations() {
  nextTick(() => {
    // 先检查是否在浏览器环境
    if (inBrowser) {
      // 查找目标节点
      const oldNode = window.document.querySelector(".VPHero .tagline");
      if (oldNode && oldNode.parentNode) {
        // 创建并挂载应用
        const app = createApp(HomeUnderline, {
          fm: fm.value
        })

        // 替换节点
        app.mount(oldNode)
        oldNode.parentNode.replaceChild(app._container as Node, oldNode)
      }
    }
  })
}

watch(
  fm,
  () => {
    performDOMOperations();
  },
  { immediate: true, deep: true }
);


if (inBrowser) {
  /* 纸屑 */
  confetti({
    particleCount: 100,
    spread: 170,
    origin: { y: 0.6 },
  });
}
</script>

<style lang="scss">
.medium-zoom-overlay {
  z-index: 1000
}

.medium-zoom-image {
  z-index: 2000
}
</style>
