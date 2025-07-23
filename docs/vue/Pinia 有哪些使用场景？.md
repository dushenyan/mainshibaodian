---
sidebar: false
outline: [2, 3, 4]
---

Pinia 作为 Vue 的现代化状态管理库，适用于以下典型场景，结合代码示例说明其核心优势：

---

### **1. 复杂应用状态集中管理**
**场景**：跨组件共享用户信息、全局配置等
**优势**：替代 Vuex 的模块化方案，更简洁的类型支持
```typescript
// stores/user.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null as UserProfile | null,
    permissions: [] as string[]
  }),
  actions: {
    async fetchUser() {
      this.profile = await api.getUser()
    }
  }
})

// 组件中使用
const userStore = useUserStore()
userStore.fetchUser()
```

---

### **2. 需要 TypeScript 深度支持**
**场景**：大型项目需要严格类型检查
**优势**：自动推断状态/Getter/Action 类型
```typescript
// stores/counter.ts
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    list: [] as { id: number }[] // 明确数组类型
  }),
  getters: {
    doubleCount: state => state.count * 2 // 自动推断返回类型
  },
  actions: {
    increment(payload: number) { // 参数类型约束
      this.count += payload
    }
  }
})
```

---

### **3. 组件间状态共享**
**场景**：非父子组件通信（如购物车数据）
**优势**：直接引入 store，避免 props/emit 层层传递
```vue
<!-- ComponentA.vue -->
<script setup>
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
</script>

<template>
  <button @click="cartStore.addItem(product)">
    加入购物车
  </button>
</template>

<!-- ComponentB.vue -->
<template>
  <div>购物车数量：{{ cartStore.totalItems }}</div>
</template>
```

---

### **4. 需要状态持久化**
**场景**：用户登录态、主题偏好等持久化存储
**解决方案**：配合 `pinia-plugin-persistedstate`
```typescript
// stores/theme.ts
export const useThemeStore = defineStore('theme', {
  state: () => ({
    mode: 'light' as 'light' | 'dark'
  }),
  persist: {
    storage: localStorage, // 持久化到 localStorage
    paths: ['mode'] // 只持久化 mode 字段
  }
})
```

---

### **5. 服务端渲染 (SSR)**
**场景**：Next.js/Nuxt.js 中的状态同步
**优势**：内置 SSR 支持，避免数据污染
```typescript
// stores/ssr.ts
export const useSSRStore = defineStore('ssr', {
  state: () => ({
    data: null as any
  }),
  hydrate(initialState) { // SSR 数据水合
    if (initialState)
      this.$patch(initialState)
  }
})
```

---

### **6. 需要状态组合复用**
**场景**：多个页面共用相似逻辑（如分页、筛选）
**优势**：使用 `setup` 语法实现逻辑组合
```typescript
// stores/pagination.ts
export const usePaginationStore = defineStore('pagination', () => {
  const page = ref(1)
  const pageSize = ref(10)

  function nextPage() {
    page.value++
  }

  return { page, pageSize, nextPage }
})

// 在多个页面复用相同分页逻辑
```

---

### **7. 需要 DevTools 集成**
**场景**：开发阶段状态调试
**优势**：支持时间旅行调试和状态快照
```javascript
// 在浏览器开发者工具中：
// 1. 查看状态变化历史记录
// 2. 直接修改状态进行测试
// 3. 导入/导出状态快照
```

---

### **8. 需要轻量级替代 Vuex**
**场景**：中小项目不想引入 Vuex 的复杂度
**对比优势**：
| 特性         | Pinia | Vuex  |
|--------------|-------|-------|
| 代码量       | ~1KB  | ~5KB  |
| 类型支持     | 优秀  | 一般  |
| 模块热更新   | 支持  | 部分  |
| 学习曲线     | 低    | 中    |

---

### **何时不推荐使用 Pinia？**
1. **超小型项目**：仅需 `reactive()` 或 `provide/inject` 时
2. **非 Vue 生态**：考虑使用 Zustand（React）或 Nanostores（框架无关）

Pinia 通过上述场景的优雅解决方案，成为 Vue 生态状态管理的首选，尤其适合需要 **类型安全**、**代码组织** 和 **开发体验** 的项目。
