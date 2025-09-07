<script setup lang="ts">
import type { Zoom } from 'medium-zoom'
import type { SandpackPredefinedTemplate } from '../types'
import { sandpackTemplateOptions } from '@config/emnus'
import HomeUnderline from '@theme/components/HomeUnderline'
import LockScreen from '@theme/components/LockScreen.vue'
import { EmitType, useEmits } from '@theme/hooks/useEmits'
import confetti from 'canvas-confetti'
import mediumZoom from 'medium-zoom'
import { inBrowser, onContentUpdated, useData, useRoute } from 'vitepress'
import { Sandbox } from 'vitepress-plugin-sandpack'
import Theme from 'vitepress/theme'
// 具体使用参见：https://vitepress.vuejs.org/guide/theme-introduction#extending-the-default-theme
import { computed, createApp, nextTick, onBeforeMount, ref, watch } from 'vue'

import { useAppStore } from '@/stores'

// export const injectKey = Symbol('Layout')

const { Layout } = Theme
const { frontmatter: fm } = useData()
let zoom: Zoom

onContentUpdated(() => {
  if (!zoom)
    return
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
      const oldNode = window.document.querySelector('.VPHero .tagline')
      if (oldNode && oldNode.parentNode) {
        // 创建并挂载应用
        const app = createApp(HomeUnderline, {
          fm: fm.value,
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
    performDOMOperations()
  },
  { immediate: true, deep: true },
)

if (inBrowser) {
  /* 纸屑 */
  confetti({
    particleCount: 100,
    spread: 170,
    origin: { y: 0.6 },
  })
}

const showEditDrawer = ref(false)

const showListDrawer = ref(false)

function handleClick(e: MouseEvent, type: string) {
  e.preventDefault()
  if (type === 'list') {
    showListDrawer.value = !showListDrawer.value
    useEmits({
      name: EmitType.ListDrawerClose,
      onCallback: (val: any) => {
        console.log(val)
        showListDrawer.value = false
      },
    })
  }
  else if (type === 'edit') {
    showEditDrawer.value = !showEditDrawer.value
  }
  else if (type === 'back') {
    if (inBrowser) {
      window.history.back()
    }
  }
}

const appStore = useAppStore()

const activeName = computed(() => appStore.getActiveName)

const sandpackTemplateValue = ref<SandpackPredefinedTemplate>('vite')
</script>

<template>
  <Suspense>
    <Layout v-bind="$attrs">
      <template #doc-top>
        <div class="fixed-edit-btn" style="bottom: 160px;" @click="handleClick($event, 'list')">
          List
        </div>
        <div class="fixed-edit-btn" @click="handleClick($event, 'edit')">
          Edit
        </div>
        <el-drawer
          v-model="showEditDrawer" :with-header="false" append-to-body :close-on-click-modal="false"
          size="100%"
        >
          <div class="sandbox-container">
            <div class="sandbox-title">
              在线编辑
              <el-select v-model="sandpackTemplateValue" placeholder="Select" style="width: 240px">
                <el-option v-for="(item, index) in sandpackTemplateOptions" :key="index" :label="item" :value="item">
                  {{ item }}
                </el-option>
              </el-select>
            </div>
            <div class="sandbox-content">
              <div class="sandbox">
                <ClientOnly>
                  <Sandbox
                    :template="sandpackTemplateValue" :autorun="false" show-line-numbers show-refresh-button
                    show-console-button
                  />
                </ClientOnly>
              </div>
            </div>
          </div>
        </el-drawer>
        <el-drawer v-model="showListDrawer" :with-header="false" append-to-body size="60%">
          <div class="list-container">
            <PageTable :active-name="activeName" />
          </div>
        </el-drawer>
      </template>
      <template #layout-top>
        <!-- <LockScreen /> -->
        <el-backtop />
      </template>
    </Layout>
  </Suspense>
</template>

<style lang="scss">
.medium-zoom-overlay {
  z-index: 1000
}

.medium-zoom-image {
  z-index: 2000
}

.fixed-edit-btn {
  position: fixed;
  right: 40px;
  bottom: 100px;
  height: 40px;
  width: 40px;
  background-color: var(--el-bg-color-overlay);
  box-shadow: var(--el-box-shadow-lighter);
  text-align: center;
  line-height: 40px;
  color: var(--vp-c-brand);
  cursor: pointer;
  z-index: 9999;
}

.sandbox-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
</style>
