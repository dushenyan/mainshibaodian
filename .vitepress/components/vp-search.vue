<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const value = ref('')

function onEnter(): void {
  ElMessage({ type: 'success', message: '开始搜索' })
}
</script>

<template>
  <el-input v-model="value" type="text" placeholder="请输入...." :on-enter="onEnter" />
</template>

<style lang="scss" scoped>
.el-input {
  width: 200px;
  margin-left: 20px;
}
</style>
