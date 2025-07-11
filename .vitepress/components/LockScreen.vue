<template>
  <div v-if="isLocked" class="lock-screen">
    <div class="lock-screen-overlay">
      <div class="lock-screen-content">
        <h2>屏幕已锁定</h2>
        <input
          type="password"
          v-model="password"
          placeholder="请输入密码解锁"
          @keyup.enter="unlock"
        />
        <button @click="unlock">解锁</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 定义是否锁定的状态
const isLocked = ref(false);
// 定义用户输入的密码
const password = ref('');
// 正确的密码，可根据实际情况修改
const correctPassword = '123456'; 

// 锁定屏幕的方法
const lock = () => {
  isLocked.value = true;
  password.value = '';
};

// 解锁屏幕的方法
const unlock = () => {
  if (password.value === correctPassword) {
    isLocked.value = false;
  } else {
    alert('密码错误，请重试');
  }
};

// 暴露锁定和解锁方法
defineExpose({
  lock,
  unlock,
});
</script>

<style scoped>
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
