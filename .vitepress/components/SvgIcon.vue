<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name?: string
  inline?: string
}
const props = defineProps<Props>()
const symbolId = computed(() => `${props.name}`)
</script>

<template>
  <!-- 修改判断条件为 props.name -->
  <i v-if="props.name" class="svg-icon inline-block">
    <svg aria-hidden="true">
      <!-- 使用 href 替代 xlink:href -->
      <use :href="symbolId" />
    </svg>
  </i>
  <i v-else class="svg-icon inline-block" v-html="inline" />
</template>

<style scoped lang="scss">
.svg-icon {
  display: inline-flex;
  vertical-align: middle;
  align-items: center;
  width: 1em;
  height: 1em;

  :deep(svg) {
    width: 1em;
    height: 1em;
    fill: currentColor;
  }
}
</style>
