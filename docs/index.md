---
layout: page
---

<script setup lang="ts">
import { ref, watch } from 'vue'
import { inBrowser } from 'vitepress'

// 原生方式获取查询参数
const getQueryParam = (paramName: string): string | undefined => {
  if(inBrowser){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(paramName) || undefined;
  }
  return undefined;
};

// 获取 name 参数
const name = ref(getQueryParam('name'));
// 用于强制重新渲染的 key
const renderKey = ref(0);
renderKey.value += 1;
</script>

<!-- 使用 key 属性强制重新渲染 -->
<PageTable :dirName="name" :key="renderKey" />
