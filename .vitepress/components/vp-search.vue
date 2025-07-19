<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const value = ref('')

const onEnter = (): void => {
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
