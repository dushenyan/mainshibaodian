<script setup lang="ts">
import { useDocsTreeData } from '@theme/hooks/useDocsTreeData'
import { useRouter } from 'vitepress'
import { computed } from 'vue'

defineOptions({
  name: 'PageTable',
})

const props = withDefaults(defineProps<Props>(), {
})

interface Props {
  data: any[]
  dirName: string
}

const tree = useDocsTreeData(props.dirName)
const router = useRouter()

function navigateToPage(path: string) {
  router.go(decodeURIComponent(path))
}

const computedTree = computed(() => {
  return tree.value || props.data
})
</script>

<template>
  <div class="page-table">
    <h1>{{ props.dirName }}</h1>
    <ul class="page-table-list">
      <li
        v-for="item in computedTree" :key="item.title" class="page-table-item" tabindex="0"
        @click="navigateToPage(item.link)"
      >
        <span class="title" :title="item.title">{{ item.title }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.page-table {
  width: 80vw;
  margin: 30px auto 60px;

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
      align-items: center;
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
