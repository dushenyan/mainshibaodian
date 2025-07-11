<template>
  <LockScreen ref="lockScreenRef" />
  <HomeUnderline />
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
import { onBeforeMount, ref, onMounted, useTemplateRef } from 'vue'
import { onContentUpdated, inBrowser } from 'vitepress'
import LockScreen from '../components/LockScreen.vue'

const { Layout } = Theme
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

// 引用锁屏组件
const lockScreenRef = useTemplateRef('lockScreenRef')

// 模拟空闲一段时间后锁定屏幕
onMounted(() => {
  setTimeout(() => {
    lockScreenRef.value!.lock();
  }, 300000); // 5分钟后锁定屏幕
});


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
