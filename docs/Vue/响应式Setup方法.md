---
tags: ['基础使用','访问Props详解','上下文详解','与渲染函数结合使用']
---

# 响应式Setup方法

## 基础使用指南

### 一、组合式API简介

Vue 3引入了组合式API(Composition API)，这是对传统选项式API(Options API)的补充和增强。setup()函数是组合式API的核心入口，它允许我们更灵活地组织组件逻辑。

与选项式API相比，组合式API的主要优势在于：
- 更好的逻辑复用
- 更灵活的代码组织
- 更好的TypeScript支持
- 更清晰的逻辑关系

### 二、setup()基础用法

#### 1. 基本结构

```html
<template>
  <div>
    <p>计数: {{ count }}</p>
    <button @click="increment">增加</button>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    // 定义响应式数据
    const count = ref(0)
    
    // 定义方法
    const increment = () => {
      count.value++
    }
    
    // 返回模板中可用的数据和方法
    return {
      count,
      increment
    }
  }
}
</script>
```

#### 2. 响应式数据声明

在setup()中，我们使用ref和reactive来创建响应式数据：

```html
<template>
  <div>
    <p>姓名: {{ user.name }}</p>
    <p>年龄: {{ user.age }}</p>
    <button @click="updateUser">更新用户</button>
  </div>
</template>

<script>
import { reactive } from 'vue'

export default {
  setup() {
    // 使用reactive创建响应式对象
    const user = reactive({
      name: '张三',
      age: 25
    })
    
    const updateUser = () => {
      user.name = '李四'
      user.age += 1
    }
    
    return {
      user,
      updateUser
    }
  }
}
</script>
```

### 三、setup()进阶用法

#### 1. 计算属性

```html
<template>
  <div>
    <p>原始消息: {{ message }}</p>
    <p>反转消息: {{ reversedMessage }}</p>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  setup() {
    const message = ref('Hello Vue 3!')
    
    const reversedMessage = computed(() => {
      return message.value.split('').reverse().join('')
    })
    
    return {
      message,
      reversedMessage
    }
  }
}
</script>
```

#### 2. 监听器

```html
<template>
  <div>
    <p>计数: {{ count }}</p>
    <button @click="count++">增加</button>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  setup() {
    const count = ref(0)
    
    watch(count, (newValue, oldValue) => {
      console.log(`计数从 ${oldValue} 变为 ${newValue}`)
    })
    
    return {
      count
    }
  }
}
</script>
```

### 四、生命周期钩子

在setup()中使用生命周期钩子：

```html
<template>
  <div>
    <p>组件已挂载: {{ isMounted ? '是' : '否' }}</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const isMounted = ref(false)
    
    onMounted(() => {
      isMounted.value = true
      console.log('组件已挂载')
    })
    
    return {
      isMounted
    }
  }
}
</script>
```

### 五、可运行的完整示例

下面是一个使用Vite打包后可直接在HTML中使用的完整示例：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vue 3 Composition API Demo</title>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>
  <div id="app">
    <user-profile></user-profile>
  </div>

  <script>
    const { createApp, ref, reactive, computed, watch, onMounted } = Vue
    
    const UserProfile = {
      template: `
        <div>
          <h2>用户信息</h2>
          <p>姓名: {{ user.name }}</p>
          <p>年龄: {{ user.age }}</p>
          <p>成年: {{ isAdult ? '是' : '否' }}</p>
          <p>消息: {{ message }}</p>
          <button @click="updateUser">更新用户</button>
          <button @click="changeMessage">更改消息</button>
        </div>
      `,
      setup() {
        // 响应式对象
        const user = reactive({
          name: '张三',
          age: 20
        })
        
        // 响应式基本值
        const message = ref('欢迎使用Vue 3!')
        
        // 计算属性
        const isAdult = computed(() => user.age >= 18)
        
        // 方法
        const updateUser = () => {
          user.name = user.name === '张三' ? '李四' : '张三'
          user.age += 1
        }
        
        const changeMessage = () => {
          message.value = message.value === '欢迎使用Vue 3!' 
            ? '你已经掌握了组合式API!' 
            : '欢迎使用Vue 3!'
        }
        
        // 监听器
        watch(message, (newVal, oldVal) => {
          console.log(`消息从 "${oldVal}" 变为 "${newVal}"`)
        })
        
        // 生命周期钩子
        onMounted(() => {
          console.log('UserProfile组件已挂载')
        })
        
        // 返回模板中可用的内容
        return {
          user,
          message,
          isAdult,
          updateUser,
          changeMessage
        }
      }
    }
    
    const app = createApp({
      components: {
        UserProfile
      }
    })
    
    app.mount('#app')
  </script>
</body>
</html>
```

### 六、总结

组合式API的setup()函数是Vue 3的核心特性之一，它为我们提供了更灵活、更强大的代码组织方式：

1. **逻辑组织更灵活**：不再受限于选项式API的固定结构，可以按功能而非选项类型组织代码
2. **更好的复用性**：通过自定义组合函数，可以轻松实现逻辑复用
3. **更友好的TS支持**：类型推断更加自然和准确
4. **更清晰的代码结构**：相关逻辑可以集中在一起，提高代码可读性和可维护性

对于从Vue 2迁移过来的开发者，建议逐步尝试在项目中引入组合式API，特别是在处理复杂组件逻辑时，组合式API能带来显著的开发体验提升。

## 访问Props详解

### 一、setup()中访问Props的基本方式

在组合式API中，setup()函数接收props作为第一个参数，我们可以直接通过这个参数访问父组件传递的属性。

```html
<template>
  <div>
    <h3>用户信息</h3>
    <p>用户名: {{ userName }}</p>
    <p>年龄: {{ userAge }}</p>
  </div>
</template>

<script>
export default {
  props: {
    userName: {
      type: String,
      required: true
    },
    userAge: {
      type: Number,
      default: 18
    }
  },
  setup(props) {
    // 在setup中访问props
    console.log('用户名:', props.userName)
    console.log('年龄:', props.userAge)
    
    // 可以基于props创建计算属性或响应式数据
    const isAdult = computed(() => props.userAge >= 18)
    
    return {
      userName: props.userName,
      userAge: props.userAge,
      isAdult
    }
  }
}
</script>
```

### 二、Props的响应式特性

#### 1. Props的解构问题

直接解构props会失去响应性，需要使用`toRefs`或`toRef`保持响应性：

```html
<template>
  <div>
    <p>商品名称: {{ productName }}</p>
    <p>价格: {{ price }}</p>
  </div>
</template>

<script>
import { toRefs, computed } from 'vue'

export default {
  props: {
    productName: String,
    price: Number
  },
  setup(props) {
    // 错误方式 - 会失去响应性
    // const { productName, price } = props
    
    // 正确方式 - 使用toRefs保持响应性
    const { productName, price } = toRefs(props)
    
    const discountedPrice = computed(() => price.value * 0.9)
    
    return {
      productName,
      price,
      discountedPrice
    }
  }
}
</script>
```

#### 2. 单个Prop的响应式引用

如果只需要引用单个prop，可以使用`toRef`：

```html
<template>
  <div>
    <p>消息: {{ message }}</p>
    <p>大写消息: {{ upperCaseMessage }}</p>
  </div>
</template>

<script>
import { toRef, computed } from 'vue'

export default {
  props: {
    message: String
  },
  setup(props) {
    // 使用toRef创建单个prop的引用
    const message = toRef(props, 'message')
    
    const upperCaseMessage = computed(() => message.value.toUpperCase())
    
    return {
      message,
      upperCaseMessage
    }
  }
}
</script>
```

### 三、Props的类型验证与默认值

在组合式API中，props的类型验证和默认值设置仍然在props选项中定义：

```html
<template>
  <div>
    <p>任务: {{ task.name }}</p>
    <p>优先级: {{ task.priority }}</p>
    <p>已完成: {{ task.completed ? '是' : '否' }}</p>
  </div>
</template>

<script>
export default {
  props: {
    task: {
      type: Object,
      required: true,
      validator(value) {
        return 'name' in value && 'priority' in value
      }
    }
  },
  setup(props) {
    // 访问复杂props对象
    console.log('任务详情:', props.task)
    
    // 可以基于props.task创建计算属性
    const taskStatus = computed(() => 
      props.task.completed ? '已完成' : '未完成'
    )
    
    return {
      task: props.task,
      taskStatus
    }
  }
}
</script>
```

### 四、可运行的完整示例

下面是一个完整的可运行示例，展示如何在setup()中访问和使用props：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vue 3 Props in Setup Demo</title>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>
  <div id="app">
    <user-card 
      :name="userName" 
      :age="userAge" 
      :is-admin="isAdmin"
    ></user-card>
    <button @click="changeUser">更改用户</button>
  </div>

  <script>
    const { createApp, ref, toRefs, computed } = Vue
    
    const UserCard = {
      template: `
        <div style="border: 1px solid #ccc; padding: 20px; margin: 20px;">
          <h3>用户卡片</h3>
          <p>姓名: {{ name }}</p>
          <p>年龄: {{ age }} ({{ ageStatus }})</p>
          <p>权限: {{ adminStatus }}</p>
          <p>用户简介: {{ userDescription }}</p>
        </div>
      `,
      props: {
        name: {
          type: String,
          required: true
        },
        age: {
          type: Number,
          default: 18,
          validator(value) {
            return value >= 0
          }
        },
        isAdmin: {
          type: Boolean,
          default: false
        }
      },
      setup(props) {
        // 使用toRefs保持响应性
        const { name, age, isAdmin } = toRefs(props)
        
        // 基于props的计算属性
        const ageStatus = computed(() => {
          if (age.value < 18) return '未成年'
          if (age.value < 60) return '成年'
          return '老年'
        })
        
        const adminStatus = computed(() => 
          isAdmin.value ? '管理员' : '普通用户'
        )
        
        const userDescription = computed(() => {
          return `${name.value}是一位${ageStatus.value}${adminStatus.value}`
        })
        
        return {
          name,
          age,
          isAdmin,
          ageStatus,
          adminStatus,
          userDescription
        }
      }
    }
    
    const app = createApp({
      components: {
        UserCard
      },
      setup() {
        const userName = ref('张三')
        const userAge = ref(25)
        const isAdmin = ref(false)
        
        const changeUser = () => {
          userName.value = userName.value === '张三' ? '李四' : '张三'
          userAge.value += 5
          isAdmin.value = !isAdmin.value
        }
        
        return {
          userName,
          userAge,
          isAdmin,
          changeUser
        }
      }
    })
    
    app.mount('#app')
  </script>
</body>
</html>
```

### 五、总结

在Vue组合式API中访问和使用props需要注意以下几点：

1. **props参数**：setup()函数接收props作为第一个参数，可以直接访问父组件传递的属性
2. **响应性保持**：直接解构props会失去响应性，需要使用`toRefs`或`toRef`保持响应性
3. **类型验证**：props的类型验证和默认值仍然在props选项中定义
4. **计算属性**：可以基于props创建计算属性，实现派生状态
5. **最佳实践**：
   - 对于必填props，确保设置required: true
   - 对于复杂对象，使用validator进行验证
   - 在模板中使用时，保持命名一致性

组合式API提供了更灵活的方式来处理props，使得组件间的数据流动更加清晰可控，同时也保持了Vue一贯的响应式特性。

## 上下文详解

### 一、setup()上下文概述

setup()函数除了接收props作为第一个参数外，还可以接收第二个参数——上下文对象(context)。这个上下文对象暴露了组件的一些重要属性和方法，为我们提供了在组合式API中访问这些功能的途径。

### 二、上下文对象的主要属性

#### 1. attrs - 访问非props属性

```html
<template>
  <div>
    <h3>非props属性</h3>
    <p>自定义属性值: {{ customAttr }}</p>
  </div>
</template>

<script>
import { toRef } from 'vue'

export default {
  setup(props, context) {
    // 访问非props属性
    console.log('所有非props属性:', context.attrs)
    
    // 获取特定非props属性
    const customAttr = toRef(context.attrs, 'custom-data')
    
    return {
      customAttr
    }
  }
}
</script>
```

#### 2. slots - 访问插槽内容

```html
<template>
  <div>
    <h3>插槽内容</h3>
    <!-- 渲染默认插槽 -->
    <slot></slot>
    
    <!-- 渲染命名插槽 -->
    <slot name="footer"></slot>
  </div>
</template>

<script>
export default {
  setup(props, { slots }) {
    // 检查插槽是否存在
    const hasDefaultSlot = slots.default
    const hasFooterSlot = slots.footer
    
    console.log('默认插槽存在:', hasDefaultSlot)
    console.log('页脚插槽存在:', hasFooterSlot)
    
    return {
      hasDefaultSlot,
      hasFooterSlot
    }
  }
}
</script>
```

#### 3. emit - 触发自定义事件

```html
<template>
  <div>
    <button @click="notifyParent">通知父组件</button>
  </div>
</template>

<script>
export default {
  setup(props, { emit }) {
    const notifyParent = () => {
      // 触发自定义事件
      emit('custom-event', { message: '来自子组件的消息' })
    }
    
    return {
      notifyParent
    }
  }
}
</script>
```

#### 4. expose - 暴露组件公共属性

```html
<template>
  <div>
    <p>内部状态: {{ internalState }}</p>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup(props, { expose }) {
    const internalState = ref('私有数据')
    const publicMethod = () => {
      console.log('这是一个公共方法')
    }
    
    // 暴露公共API
    expose({
      publicMethod,
      getState: () => internalState.value
    })
    
    return {
      internalState
    }
  }
}
</script>
```

### 三、上下文对象的完整使用示例

下面是一个完整的可运行示例，展示setup()上下文对象的所有主要功能：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vue 3 Setup Context Demo</title>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <style>
    .card {
      border: 1px solid #ddd;
      padding: 20px;
      margin: 10px;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div id="app">
    <child-component 
      title="子组件标题"
      custom-data="自定义数据"
      @custom-event="handleEvent"
    >
      <template #default>
        <p>这是默认插槽内容</p>
      </template>
      <template #footer>
        <p style="color: blue;">这是页脚插槽内容</p>
      </template>
    </child-component>
    
    <button @click="callChildMethod">调用子组件方法</button>
    <p>来自子组件的消息: {{ childMessage }}</p>
  </div>

  <script>
    const { createApp, ref } = Vue
    
    const ChildComponent = {
      template: `
        <div class="card">
          <h3>{{ title }}</h3>
          
          <!-- 非props属性 -->
          <p>自定义属性: {{ customData }}</p>
          
          <!-- 默认插槽 -->
          <slot></slot>
          
          <!-- 命名插槽 -->
          <slot name="footer"></slot>
          
          <button @click="sendMessage">发送消息</button>
        </div>
      `,
      props: {
        title: String
      },
      setup(props, context) {
        console.log('组件props:', props)
        console.log('组件attrs:', context.attrs)
        console.log('组件slots:', context.slots)
        
        // 访问非props属性
        const customData = context.attrs['custom-data']
        
        // 访问插槽
        const hasDefaultSlot = !!context.slots.default
        const hasFooterSlot = !!context.slots.footer
        
        // 定义emit方法
        const sendMessage = () => {
          context.emit('custom-event', { 
            message: 'Hello from child component!' 
          })
        }
        
        // 暴露公共方法
        const childMethod = () => {
          console.log('子组件方法被调用')
          return '这是子组件返回的值'
        }
        
        context.expose({
          childMethod
        })
        
        return {
          customData,
          hasDefaultSlot,
          hasFooterSlot,
          sendMessage
        }
      }
    }
    
    const app = createApp({
      components: {
        ChildComponent
      },
      setup() {
        const childMessage = ref('')
        const childRef = ref(null)
        
        const handleEvent = (payload) => {
          childMessage.value = payload.message
        }
        
        const callChildMethod = async () => {
          if (childRef.value) {
            const result = await childRef.value.childMethod()
            console.log('调用子组件方法结果:', result)
            childMessage.value = `方法调用成功: ${result}`
          }
        }
        
        return {
          childMessage,
          childRef,
          handleEvent,
          callChildMethod
        }
      }
    })
    
    app.mount('#app')
  </script>
</body>
</html>
```

### 四、上下文对象使用总结

setup()函数的上下文对象提供了访问组件关键功能的能力：

1. **attrs**：访问所有非props属性，常用于传递原生HTML属性或自定义数据
2. **slots**：检查和处理插槽内容，实现更灵活的组件布局
3. **emit**：触发自定义事件，实现子到父的通信
4. **expose**：显式暴露组件公共API，控制组件对外暴露的内容

**最佳实践建议**：

- 使用`toRef`或`toRefs`处理attrs中的属性以保持响应性
- 在emit事件时，使用明确的事件名和数据结构
- 合理使用expose控制组件API，避免暴露过多内部实现
- 对于插槽内容，优先使用模板语法，上下文slots主要用于逻辑判断

上下文对象使组合式API更加完整，让我们能够在函数式编程风格下仍然可以访问Vue组件的核心功能，实现了选项式API和组合式API之间的平滑过渡。

## 与渲染函数结合使用

### 一、setup()与渲染函数基础

在Vue 3中，setup()函数不仅可以返回数据供模板使用，还可以直接返回一个渲染函数。这种方式特别适合需要完全编程式控制组件渲染的场景。

#### 基本使用示例

```html
<script>
import { h, ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    
    const increment = () => {
      count.value++
    }
    
    // 返回渲染函数
    return () => h('div', [
      h('h3', '计数器'),
      h('p', `当前计数: ${count.value}`),
      h('button', { onClick: increment }, '增加')
    ])
  }
}
</script>
```

### 二、渲染函数核心API

#### 1. h() 函数

`h()`函数是创建虚拟DOM节点的核心函数，它有多种重载形式：

```javascript
// 形式1: h(type, props, children)
h('div', { class: 'container' }, 'Hello World')

// 形式2: h(type, children)
h('div', ['Hello', h('span', 'World')])

// 形式3: h(组件定义)
h(MyComponent, { prop: 'value' })
```

#### 2. 结合响应式数据

```html
<script>
import { h, ref, computed } from 'vue'

export default {
  setup() {
    const firstName = ref('张')
    const lastName = ref('三')
    
    const fullName = computed(() => `${firstName.value}${lastName.value}`)
    
    return () => h('div', [
      h('input', {
        value: firstName.value,
        onInput: (e) => firstName.value = e.target.value
      }),
      h('input', {
        value: lastName.value,
        onInput: (e) => lastName.value = e.target.value
      }),
      h('p', `全名: ${fullName.value}`)
    ])
  }
}
</script>
```

### 三、渲染函数高级用法

#### 1. 条件渲染

```html
<script>
import { h, ref } from 'vue'

export default {
  setup() {
    const show = ref(true)
    
    const toggle = () => {
      show.value = !show.value
    }
    
    return () => h('div', [
      h('button', { onClick: toggle }, '切换显示'),
      show.value ? h('p', '这段文字可以显示/隐藏') : null
    ])
  }
}
</script>
```

#### 2. 列表渲染

```html
<script>
import { h, ref } from 'vue'

export default {
  setup() {
    const items = ref([
      { id: 1, name: '项目1' },
      { id: 2, name: '项目2' },
      { id: 3, name: '项目3' }
    ])
    
    return () => h('ul',
      items.value.map(item => 
        h('li', { key: item.id }, item.name)
      )
    )
  }
}
</script>
```

#### 3. 插槽处理

```html
<script>
import { h } from 'vue'

export default {
  setup(props, { slots }) {
    return () => h('div', [
      h('header', slots.header?.()),
      h('main', slots.default?.()),
      h('footer', slots.footer?.())
    ])
  }
}
</script>
```

### 四、可运行的完整示例

下面是一个完整的可运行示例，展示setup()与渲染函数的结合使用：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vue 3 Render Function Demo</title>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <style>
    .todo-item {
      display: flex;
      align-items: center;
      margin: 5px 0;
    }
    .completed {
      text-decoration: line-through;
      color: #888;
    }
  </style>
</head>
<body>
  <div id="app"></div>

  <script>
    const { createApp, h, ref, computed } = Vue
    
    const TodoApp = {
      setup() {
        const todos = ref([
          { id: 1, text: '学习Vue 3', completed: false },
          { id: 2, text: '掌握组合式API', completed: false },
          { id: 3, text: '实践渲染函数', completed: false }
        ])
        
        const newTodo = ref('')
        
        const addTodo = () => {
          if (newTodo.value.trim()) {
            todos.value.push({
              id: Date.now(),
              text: newTodo.value,
              completed: false
            })
            newTodo.value = ''
          }
        }
        
        const toggleTodo = (id) => {
          const todo = todos.value.find(t => t.id === id)
          if (todo) {
            todo.completed = !todo.completed
          }
        }
        
        const remaining = computed(() => 
          todos.value.filter(t => !t.completed).length
        )
        
        return () => h('div', { class: 'todo-container' }, [
          h('h1', '待办事项列表'),
          h('div', { class: 'todo-form' }, [
            h('input', {
              type: 'text',
              value: newTodo.value,
              onInput: e => newTodo.value = e.target.value,
              placeholder: '输入新待办事项'
            }),
            h('button', { onClick: addTodo }, '添加')
          ]),
          h('p', `剩余待办: ${remaining.value}`),
          h('ul', todos.value.map(todo => 
            h('li', { 
              class: { 'todo-item': true, 'completed': todo.completed },
              onClick: () => toggleTodo(todo.id)
            }, todo.text)
          ))
        ])
      }
    }
    
    const app = createApp(TodoApp)
    app.mount('#app')
  </script>
</body>
</html>
```

### 五、总结

setup()与渲染函数结合使用提供了完全编程式的组件开发方式：

1. **核心优势**：
   - 完全控制渲染逻辑
   - 更灵活的动态组件创建
   - 减少模板编译开销
   - 更适合复杂动态UI的场景

2. **关键API**：
   - `h()`: 创建虚拟DOM节点
   - 响应式数据: `ref`, `reactive`, `computed`等
   - 上下文: `slots`, `attrs`等

3. **适用场景**：
   - 高度动态的UI组件
   - 需要极致性能优化的场景
   - 跨平台渲染(如自定义渲染器)
   - 需要完全编程式控制渲染的情况

4. **注意事项**：
   - 相比模板语法，渲染函数代码更冗长
   - 需要手动处理更多细节
   - 对于简单组件，模板语法通常更直观

渲染函数与组合式API的结合为Vue开发者提供了更底层的控制能力，特别适合构建复杂、动态或需要高度定制的组件。
