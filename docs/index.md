---
layout: page
---

<script setup lang="ts">
import { ref } from 'vue'
// 原生方式获取查询参数
const getQueryParam = (paramName: string): string | undefined => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(paramName) || undefined;
};

// 获取 name 参数
const name = ref(getQueryParam('name'));
</script>


<PageTable :dirName="name"/>

