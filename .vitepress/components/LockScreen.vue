<script setup lang="ts">
import { CACHE_KEY, useCache } from '@hooks/useCache'
import useJsencrypt from '@hooks/useJsencrypt'
import { ElMessage } from 'element-plus'
import { inBrowser } from 'vitepress'
import { onMounted, ref } from 'vue'

// 定义是否锁定的状态
const isLocked = ref(false)
// 定义用户输入的密码
const password = ref('')
// 正确的密码
const correctPassword = ref('')
// 24 小时不锁屏的标记
const skipLockKey = 'skip_lock_screen'

const wsCache = await useCache()

function secureRandomString(length: number) {
  if (inBrowser) {
    const array = new Uint8Array(length)
    window.crypto.getRandomValues(array)
    return Array.from(array, byte =>
      (`0${byte.toString(16)}`).slice(-2)).join('').slice(0, length)
  }
  else {
    return 'dushenyan'
  }
}

// 生成新密码
function generatePassword() {
  const newPassword = useJsencrypt.encrypt(secureRandomString(16))
  correctPassword.value = newPassword as string
  console.log(newPassword)

  // 缓存密码 5 分钟
  wsCache.set(CACHE_KEY.PASS_WORD, newPassword, {
    exp: 5 * 60 * 1000,
  })
  return newPassword
}

// 检查密码是否过期，过期则生成新密码
function checkPasswordExpiration() {
  const cachedPassword = wsCache.get(CACHE_KEY.PASS_WORD)
  if (!cachedPassword) {
    generatePassword()
  }
  else {
    correctPassword.value = cachedPassword
  }
}

// 锁定屏幕的方法
function lock() {
  checkPasswordExpiration()
  isLocked.value = true
  password.value = ''
}

// 解锁屏幕的方法
function unlock() {
  const skipLock = wsCache.get(skipLockKey)
  if (skipLock) {
    isLocked.value = false
    return
  }
  if (password.value === useJsencrypt.decrypt(correctPassword.value)) {
    isLocked.value = false
  }
  else {
    ElMessage.error('密码错误，请重试')
  }
}

// 控制台输入 lc 跳过验证
if (inBrowser) {
  window.lc = () => {
    isLocked.value = false
    // 24 小时内不锁屏
    wsCache.set(skipLockKey, true, {
      exp: 24 * 60 * 60 * 1000,
    })
  }
  window.decrypt = useJsencrypt.decrypt
}

onMounted(async () => {
  const skipLock = wsCache.get(skipLockKey)
  console.log(skipLock)
  if (!skipLock) {
    // 如果没有跳过标记，检查密码并锁定屏幕
    checkPasswordExpiration()
    // 可根据实际需求决定是否默认锁定屏幕
    isLocked.value = true
  }
  // 每 5 分钟检查一次密码是否过期
  setInterval(checkPasswordExpiration, 5 * 60 * 1000)
})

// 暴露锁定和解锁方法
await defineExpose({
  lock,
  unlock,
})
</script>

<template>
  <div v-if="isLocked" class="lock-screen">
    <div class="lock-screen-overlay">
      <div class="lock-screen-content">
        <h2>屏幕已锁定</h2>
        <input v-model="password" type="password" placeholder="请输入密码解锁" @keyup.enter="unlock">
        <button @click="unlock">
          解锁
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 样式部分保持不变 */
.lock-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
}

.lock-screen-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
}

.lock-screen-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.lock-screen-content input {
  margin: 10px 0;
  padding: 8px;
  width: 100%;
}

.lock-screen-content button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
