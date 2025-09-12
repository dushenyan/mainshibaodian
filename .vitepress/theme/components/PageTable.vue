<script setup lang="ts">
import type { DocsTreeData } from '@theme/hooks/useDocsTreeData'
import { getTitleSet, useDocsTreeData } from '@theme/hooks/useDocsTreeData'
import { EmitType, useEmits } from '@theme/hooks/useEmits'
import { useRouter } from 'vitepress'
import { computed, ref, watch } from 'vue'
import { supabase } from '@/request'
import { useAppStore } from '@/stores'

defineOptions({
  name: 'PageTable',
})

const props = withDefaults(defineProps<Props>(), {
  activeName: undefined,
})

interface Props {
  data?: any[]
  dirName?: string
  activeName?: string
}

const router = useRouter()
const appStore = useAppStore()

const titleSet = getTitleSet()
const _activeName = ref<string | undefined>(appStore.getActiveName || [...titleSet][0])
const computedTree = ref<DocsTreeData>(undefined)

function navigateToPage(path?: string) {
  useEmits().emit(EmitType.ListDrawerClose, { a: 1 })
  appStore.setActiveName(_activeName.value)
  router.go(decodeURIComponent(path ?? ''))
}

watch(() => props.activeName, (val) => {
  if (!props.activeName) {
    return
  }
  _activeName.value = val
}, {
  immediate: true,
})

// 外部携带的 activeName 不需要展示tab
const showTabs = computed(() => {
  // 1.activeName 没赋值 可以显示
  // 2.赋值了但是不等于undefined 单显示状态 不用显示
  return !props.activeName
})

watch(() => _activeName.value, () => {
  computedTree.value = useDocsTreeData(_activeName.value as string)
}, {
  immediate: true,
})

// supabase.from('messages').select('*').then((res) => {
//   console.log('res', res)
// })
</script>

<template>
  <div class="page-table">
    <el-tabs v-if="showTabs" v-model="_activeName">
      <el-tab-pane v-for="name in titleSet" :key="name" :label="name.toUpperCase()" :name="name" />
    </el-tabs>
    <ul class="page-table-list">
      <li
        v-for="item in computedTree" :key="item.title" class="page-table-item" tabindex="0"
        @click="navigateToPage(item.link)"
      >
        <div class="item-left">
          <span class="title" :title="item.title">{{ item.title }}</span>
          <div v-if="item.metadata && item.metadata.tags" class="tag-group">
            <span v-for="tag in item.metadata.tags" :key="tag" :type="tag" class="tag-flag">
              {{ tag }}
            </span>
          </div>
        </div>
        <div v-show="item.metadata && item.metadata.progress" class="item-right">
          <el-progress
            :percentage="item.metadata ? item.metadata.progress : 0" type="dashboard"
            color="var(--vp-c-brand)" class="progress-bar"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.page-table {
  margin: 15px auto 60px;
  max-width: 85vw;

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

      .item-left {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
      }

      .progress-bar {
        flex-shrink: 0;
        width: 66px;

        :deep(.el-progress-circle) {
          height: 100% !important;
          width: 100% !important;
        }
      }

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
        display: flex;
        flex-wrap: wrap;

        .tag-flag {
          display: inline-block;
          margin-right: 8px;
          padding: 0px 4px;
          line-height: 1.5em;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          border: 1px solid var(--vp-c-bg-soft);
          transition: all 0.25s;
          color: var(--vp-c-brand);
          background-color: var(--vp-c-bg);
          border-color: var(--vp-c-brand);
          margin-top: 8px;

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

/* 移动端：≤768px */
@media (max-width: 768px) {
  .page-table {
    margin: 10px auto 40px;

    .page-table-list {
      gap: 12px;

      .page-table-item {
        padding: 14px 12px;
        flex-direction: row;
        align-items: flex-start;

        .progress-bar {
          flex-shrink: 0;
          width: 55px;

          :deep(.el-progress-circle) {
            height: 100% !important;
            width: 100% !important;
          }
        }

        .title {
          font-size: 15px;
          white-space: normal;
          word-break: break-all;
        }

        .tag-group {
          margin-top: 6px;

          .tag-flag {
            font-size: 11px;
            padding: 3px 5px;
          }
        }
      }
    }
  }
}

/* PC 端：>768px */
@media (min-width: 769px) {
  .page-table {

    .page-table-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(calc(1120px / 2), 1fr));
      gap: 12px;

      .page-table-item {
        flex-direction: row;
        padding: 12px 14px;

        .title {
          font-size: 16px;
        }

        .tag-group {
          display: flex;
          flex-direction: wrap;
        }
      }
    }
  }
}
</style>
