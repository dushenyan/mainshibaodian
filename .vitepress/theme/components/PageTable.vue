<script setup lang="ts" name="PageTable">
import { useDocsTreeData } from '@theme/hooks/useDocsTreeData'

import { useRouter } from 'vitepress'
import { computed } from 'vue'

interface Props {
  data: any[]
  dirName: string
}

const props = withDefaults(defineProps<Props>(), {
})

const tree = useDocsTreeData(props.dirName)

const router = useRouter()

// 定义跳转函数
function navigateToPage(path: string) {
  router.go(path)
}

const computedTree = computed(() => {
  return tree.value || props.data
})
</script>

<template>
  <h1>Vue集合</h1>
  <ul>
    <li v-for="item in computedTree" :key="item.title">
      <span @click="navigateToPage(item.link)">{{ item.title }}</span>
    </li>
  </ul>
</template>

<style>
ul {
  margin: 8px 0;
}

li {
  margin: 0;
}
.VPDocFooter{
  display: none;
}
</style>
