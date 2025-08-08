<script setup lang="ts">
import type { DocsTreeData } from '@theme/hooks/useDocsTreeData'
import { getTitleSet, useDocsTreeData } from '@theme/hooks/useDocsTreeData'
import { useRouter } from 'vitepress'
import { ref, watch } from 'vue'

defineOptions({
  name: 'PageTable',
})

const props = withDefaults(defineProps<Props>(), {
})

interface Props {
  data?: any[]
  dirName?: string
}

const router = useRouter()

function navigateToPage(path?: string) {
  router.go(decodeURIComponent(path ?? ''))
}

const titleSet = getTitleSet()
const activeName = ref([...titleSet][0])
const computedTree = ref<DocsTreeData>(undefined)

watch(() => activeName.value, () => {
  computedTree.value = useDocsTreeData(activeName.value)
}, {
  immediate: true,
  deep: true,
})
</script>

<template>
  <div class="page-table">
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="name in titleSet" :key="name" :label="name.toUpperCase()" :name="name" />
    </el-tabs>
    <ul class="page-table-list">
      <li
        v-for="item in computedTree" :key="item.title" class="page-table-item" tabindex="0"
        @click="navigateToPage(item.link)"
      >
        <span class="title" :title="item.title">{{ item.title }}</span>
        <div v-if="item.metadata && item.metadata.tags" class="tag-group">
          <span v-for="tag in item.metadata.tags" :key="tag" :type="tag" class="tag-flag">
            {{ tag }}
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.page-table {
  width: 80vw;
  margin: 15px auto 60px;

  h1 {
    font-size: 24px;
    font-weight: 600;
    color: var(--vp-c-text-1);
    padding-bottom: 10px;
  }

  .page-table-list {
    margin: 8px auto;
    padding: 0 !important;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .page-table-item {
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      padding: 10px 14px;
      border: 1px solid var(--vp-c-bg-soft);
      border-radius: 8px;
      background-color: var(--vp-c-bg-alt);
      cursor: pointer;
      transition: all 0.25s;
      user-select: none;
      outline: none;

      .title {
        flex-grow: 1;
        font-weight: 600;
        font-size: 16px;
        color: var(--vp-c-text-1);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .tag-group {
        margin-top: 8px;

        .tag-flag {
          margin-right: 8px;
          padding: 2px 4px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          border: 1px solid var(--vp-c-bg-soft);
          transition: all 0.25s;
          color: var(--vp-c-brand);
          background-color: var(--vp-c-bg);
          border-color: var(--vp-c-brand);
        }
      }
    }
  }

  .page-table-item:hover,
  .page-table-item:focus {
    background-color: var(--vp-c-bg);
    border-color: var(--vp-c-brand);
    box-shadow: var(--vp-shadow-2);
  }
}
</style>
