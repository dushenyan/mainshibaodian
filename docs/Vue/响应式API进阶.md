---
tags: ['Vue2','实现原理','高级API','shallowRef','triggerRef','customRef','shallowReactive','shallowReadonly','effectScope','getCurrentScope','onScopeDispose']
---

# 响应式API进阶

## shallowRef()
`shallowRef` 是 Vue 3 中的一个响应式 API，用于创建一个浅层响应式引用。它的主要用途和特点如下：

1. 创建浅层响应式引用： `shallowRef` 只会使引用本身变成响应式，而不会递归地将其内容转换为响应式。
2. 性能优化： 当你有一个大型对象，但只需要跟踪其顶层属性的变化时，使用 `shallowRef` 可以提高性能。
3. 使用方法：

```javascript
import { shallowRef } from 'vue'

const state = shallowRef({ count: 0 })

// 要求：写入在方法里边触发验证
// 修改 .value 会触发更新
state.value = { count: 1 }

// 不会触发更新！
state.value.count = 2
```

1. 与 `ref` 的区别：
    - `ref` 会深度递归地将其内容转换为响应式。
    - `shallowRef` 只会使其顶层属性变为响应式。
2. 适用场景：
    - 处理大型数据结构时，只需要跟踪引用本身的变化。
    - 处理外部库或 API 返回的复杂对象时。
3. 注意事项：
    - 修改 `.value` 会触发更新，但直接修改其内部属性不会。
    - 如果需要手动触发更新，可以使用 `triggerRef` 函数。

使用 `shallowRef` 可以在特定场景下优化性能，但要注意其浅层响应式的特性，以确保在需要的时候正确触发更新。

创建一个简单的 Vue 组件来演示 `shallowRef` 的使用：

```vue
<script setup>
  import { shallowRef, watch } from 'vue'

  const state = shallowRef({ count: 0 })

  // 监听 state 变化 而不是 state.value 变化
  watch(state, (newValue, oldValue) => {
    console.log('state changed:', newValue, oldValue)
  }, { deep: true })

  function updateState() {
    state.value.count++
    console.log('Current count:', state.value.count)
  }

  function replaceState() {
    state.value = { count: 100 }
  }
</script>

<template>
  <div>
    <p>Count: {{ state.count }}</p>
    <button @click="updateState">Update State</button>
    <button @click="replaceState">Replace State</button>
  </div>
</template>
```

在这个例子中：

1. 我们使用 `shallowRef` 创建了一个浅层响应式引用 `state`。
2. 我们设置了一个 `watch` 来观察 `state` 的变化。注意我们使用了 `{ deep: true }` 选项，这样可以深度观察对象的变化。
3. `updateState` 函数直接修改 `state.value.count`。
4. `replaceState` 函数替换整个 `state.value` 对象。

实际运行这个组件，你会发现：

+ 点击 "Update State" 按钮时，`state.value.count` 的值确实会增加，视图并不会更新。
+ 然而，`watch` 回调不会因为 `updateState` 而触发，因为 `shallowRef` 不会使内部属性变为响应式。
+ 点击 "Replace State" 按钮时，整个 `state.value` 被替换，这会触发 `watch` 回调和视图更新。

如果你想要严格控制更新，可以考虑使用 `triggerRef` 函数：

```vue
<script setup>
  import { shallowRef, triggerRef } from 'vue'

  const state = shallowRef({ count: 0 })

  function updateState() {
    // 不会直接触发 更新！
    state.value.count++
    triggerRef(state) // 手动触发更新
  }
</script>
```

总结：

+ `shallowRef` 创建的对象，其内部属性的变化在某些情况下（如模板渲染）可能会触发更新。
+ 对于 `watch` 等响应式 API，`shallowRef` 的内部变化默认不会被检测到。
+ 如果需要精确控制更新，可以使用 `triggerRef`。

在实际使用中，需要根据具体情况来决定是否使用 `shallowRef` 或者是否需要手动触发更新。

## triggerRef()
+ **使用以及举例说明、**
+ **加此 API 只是为强制手动刷新浅层更新嘛？**

您提出了一个很好的问题。`triggerRef` 确实主要用于手动触发浅层响应式引用的更新。让我们深入了解一下 `triggerRef` 的使用及其目的。

`triggerRef` 的主要用途：

1. 强制触发浅层响应式引用的更新
2. 在某些特定场景下优化性能
3. 对复杂数据结构的精确控制

让我们通过一个例子来说明 `triggerRef` 的使用：

```vue
<script setup>
  import { shallowRef, triggerRef, watch } from 'vue'

  const state = shallowRef({ 
    user: { name: 'Alice', age: 30 },
    posts: [{ id: 1, title: 'Hello Vue' }]
  })

  watch(state, (newVal, oldVal) => {
    console.log('State changed:', newVal, oldVal)
  }, { deep: true })

  function updateUser() {
    state.value.user.age++
    console.log('User age updated:', state.value.user.age)
    // 不会触发 watch
  }

  function updateUserWithTrigger() {
    state.value.user.age++
    console.log('User age updated:', state.value.user.age)
    triggerRef(state) // 手动触发更新
    // 会触发 watch
  }

  function addPost() {
    state.value.posts.push({ id: state.value.posts.length + 1, title: 'New Post' })
    console.log('New post added:', state.value.posts)
    triggerRef(state) // 手动触发更新
    // 会触发 watch
  }
</script>

<template>
  <div>
    <p>User: {{ state.user.name }}, Age: {{ state.user.age }}</p>
    <p>Posts: {{ state.posts.length }}</p>
    <button @click="updateUser">Update User (No Trigger)</button>
    <button @click="updateUserWithTrigger">Update User (With Trigger)</button>
    <button @click="addPost">Add Post</button>
  </div>
</template>
```

在这个例子中：

1. 我们创建了一个包含用户信息和帖子列表的 `shallowRef`。
2. `updateUser` 函数修改用户年龄，但不使用 `triggerRef`。
3. `updateUserWithTrigger` 函数修改用户年龄，并使用 `triggerRef` 触发更新。
4. `addPost` 函数添加新帖子，并使用 `triggerRef` 触发更新。

运行这个组件，你会发现：

+ 点击 "Update User (No Trigger)" 按钮时，用户年龄会在控制台更新，但 `watch` 不会触发，视图也不会立即更新。
+ 点击 "Update User (With Trigger)" 或 "Add Post" 按钮时，相应的更改会反映在视图中，并且 `watch` 会被触发。

`triggerRef` 的作用和意义：

1. 性能优化：在处理大型或复杂的数据结构时，使用 `shallowRef` 和 `triggerRef` 可以避免不必要的深层响应式转换，从而提高性能。
2. 精确控制：允许开发者精确控制何时触发更新，特别是在进行多个更改后只想触发一次更新的情况下。
3. 处理非响应式数据：当使用外部库或处理原本非响应式的数据时，`triggerRef` 提供了一种手动触发更新的方法。
4. 避免过度响应：在某些情况下，你可能不希望每次小的数据变化都触发更新，而是在完成一系列操作后才更新。

总的来说，`triggerRef` 确实主要用于手动刷新浅层更新，但它的存在使得开发者能够在性能和精确控制之间取得平衡。在处理复杂数据结构或需要优化性能的场景中，`shallowRef` 配合 `triggerRef` 可以成为一个强大的工具。

## customRef()
`customRef` 是 Vue 3 提供的一个高级 API，用于创建自定义响应式引用。它允许你自定义 `get` 和 `set` 行为，从而实现一些特殊的响应式需求。下面介绍 `customRef` 最常见的使用场景及案例。

### 常见使用场景
+ **防抖处理**：在输入框输入时，避免频繁触发更新，可使用防抖技术减少不必要的计算或 API 请求。
+ **节流处理**：限制某个操作在一定时间内只能执行一次，常用于滚动事件或窗口大小调整事件。
+ **自定义缓存机制**：根据特定条件缓存响应式数据，减少不必要的计算或数据获取。

### 案例：防抖输入框
下面是一个使用 `customRef` 实现防抖输入框的示例，代码会创建一个 `debouncedRef` 函数，在用户输入停止一段时间后才更新响应式数据。

```vue
<script setup lang="ts">
  import { customRef } from 'vue'

  // 自定义防抖 ref
  function debouncedRef(value: any, delay = 300) {
    let timeout: number | undefined
    return customRef((track, trigger) => {
      return {
        get() {
          // 追踪依赖
          track()
          return value
        },
        set(newValue) {
          clearTimeout(timeout)
          timeout = setTimeout(() => {
            value = newValue
            // 触发更新
            trigger()
          }, delay)
        }
      }
    })
  }

  // 使用自定义防抖 ref
  const searchQuery = debouncedRef('')
</script>

<template>
  <div>
    <!-- 绑定防抖 ref 到输入框 -->
    <input v-model="searchQuery" placeholder="请输入搜索内容" />
    <p>当前搜索内容: {{ searchQuery }}</p>
  </div>
</template>
```

在 `customRef` 的 `CustomRefFactory` 里，`track` 和 `trigger` 参数并非仅用于简单标记触发，它们在 Vue 响应式系统里承担关键作用，下面为你详细解释。

tra**ck 函数**

`track` 函数的作用是追踪对当前响应式引用的访问。当某个依赖项（通常是一个 `ReactiveEffect`）访问这个响应式引用时，`track` 函数会把这个依赖项记录下来。这样，当响应式数据发生变化时，就知道哪些依赖项需要重新执行。

trig**ger 函数**

`trigger` 函数的作用是触发所有依赖于当前响应式引用的副作用（`ReactiveEffect`）重新执行。当响应式数据的值发生变化时，调用 `trigger` 函数，Vue 会通知所有依赖于这个数据的副作用重新运行，从而更新视图或执行其他操作。

### 代码解释
+ `track` **函数**：在 `get` 方法中调用 `track` 函数，记录当前访问这个响应式引用的依赖项。当其他副作用（如 `watchEffect` 或模板渲染）访问 `searchQuery.value` 时，就会被记录下来。
+ `trigger` **函数**：在 `set` 方法中，当防抖时间结束并更新了 `value` 的值后，调用 `trigger` 函数，通知所有依赖于 `searchQuery` 的副作用重新执行，从而更新视图。

综上所述，`track` 和 `trigger` 函数是 Vue 响应式系统的核心组成部分，它们确保了数据变化时，相关的副作用能及时更新。

在这个示例中，`debouncedRef` 函数接收一个初始值和一个防抖延迟时间，返回一个自定义的响应式引用。当用户在输入框中输入时，`set` 方法会清除之前的定时器，并设置一个新的定时器，在延迟时间后更新数据并触发更新。这样可以避免在用户快速输入时频繁更新数据。

### 案例：自定义缓存机制
`customRef` 实现自定义缓存机制，此机制能在数据满足特定条件时复用缓存，避免不必要的计算或数据获取。在这个示例中，我们会创建一个带缓存功能的响应式引用，当新设置的值和旧值一样时，就直接使用缓存，不触发更新。

```vue
<script setup lang="ts">
  import { customRef } from 'vue';

  // 自定义带缓存机制的 ref
  function cachedRef<T>(initialValue: T) {
    let cache: T = initialValue;
    return customRef((track, trigger) => {
      return {
        get() {
          // 追踪依赖
          track();
          return cache;
        },
        set(newValue: T) {
          // 检查新值是否和缓存值相同
          if (newValue !== cache) {
            cache = newValue;
            // 若值不同，更新缓存并触发更新
            trigger();
          }
        }
      };
    });
  }

  // 使用自定义带缓存机制的 ref
  const cachedData = cachedRef('初始值');

  // 模拟修改数据
  const updateData = (newValue: string) => {
    cachedData.value = newValue;
  };
</script>

<template>
  <div>
    <p>缓存数据: {{ cachedData }}</p>
    <input v-model="newValue" placeholder="输入新值" />
    <button @click="updateData(newValue)">更新数据</button>
  </div>
</template>
```

### 代码解释
1. `cachedRef` 函数：该函数接收一个初始值，返回一个自定义的响应式引用。内部使用 `cache` 变量存储缓存值。
2. `get` 方法：调用 `track` 函数追踪依赖，然后返回缓存值。
3. `set` 方法：检查新值和缓存值是否相同，若不同则更新缓存值，并调用 `trigger` 函数触发更新。
4. 模板部分：显示缓存数据，提供一个输入框和按钮，用户可以输入新值并点击按钮更新数据。

通过这种方式，当用户输入相同的值时，不会触发视图更新，从而提高性能。

### 案例: 接口请求数据自定义转换字典值Ref
```vue
<script setup lang="ts" name="DictMap">
import { customRef, onMounted, shallowRef, type ShallowRef } from 'vue';

interface TableDataVO {
  id: number
  name: string
  age: number
  toy: string
  [key: string]: any
}

// 定义映射后的数据类型，包含字典标签字段
interface MappedTableDataVO extends TableDataVO {
  toy_label?: string
  no_label?: string
}

const tableData = shallowRef<TableDataVO[]>([])

// 玩具字典数据 列举十条
const ToyDictMap: DictRefOptions[] = Array.from({ length: 10 }, (_, i) => ({
  label: `玩具${i + 1}`,
  value: `${i + 1}`,
}))

const NoDictMap: DictRefOptions[] = Array.from({ length: 10 }, (_, i) => ({
  label: `序号${i + 1}`,
  value: `${i + 1}`,
}))

interface DictRefOptions {
  label: string
  value: string
}

// 实现 dictRef 函数
function dictRef<T extends Record<string, any>>(
  sourceRef: ShallowRef<T[]>,
  options: Array<{
    dictList: DictRefOptions[]
    labelKey: string
    valueKey: string
  }>
) {
  return customRef<T[]>(() => {
    let target: T[] = []
    
    return {
      get() {
        // 映射数据，添加字典标签
        target = sourceRef.value.map(row => {
          let result = { ...row }
          
          options.forEach(option => {
            const { dictList, labelKey, valueKey } = option
            const dict = dictList.find(d => d.value === row[valueKey])
            // 插入类型labelKey对应的值作为key
            result = { ...result, [labelKey]: dict?.label || row[valueKey] }
          })
          
          return result as T
        })
        
        return target
      },
      set(val: T[]) {
        sourceRef.value = val
      },
    }
  })
}

onMounted(() => {
  // 模拟数据请求 
  setTimeout(() => {
    tableData.value = [{
      id: 11221,
      name: '张三',
      age: 18,
      toy: '1',
    }, {
      id: 1,
      name: '李四',
      age: 19,
      toy: '3',
    }, {
      id: 3,
      name: '王五',
      age: 20,
      toy: '3',
    }]
  }, 2000)
})

// 用自定义 ref 包装 tableData，实现字典映射
const mappedData = dictRef<MappedTableDataVO>(tableData, [{
  dictList: ToyDictMap,
  labelKey: 'toy_label',
  valueKey: 'toy'
}, {
  dictList: NoDictMap,
  labelKey: 'no_label',
  valueKey: 'id'
}])
</script>

<template>
  <div>
    <table>
      <tr>
        <th>姓名</th>
        <th>年龄</th>
        <th>玩具值</th>
        <th>玩具</th>
        <th>序号</th>
      </tr>
      <tr v-for="item in mappedData" :key="item.id">
        <td>{{ item.name }}</td>
        <td>{{ item.age }}</td>
        <td>{{ item.toy }}</td>
        <td>{{ item.toy_label }}</td>
        <td>{{ item.no_label }}</td>
      </tr>
    </table>
  </div>
</template>
```

## shallowReactive()
`shallowReactive()` 是 Vue 3 响应式系统中的一个函数，用于创建一个浅响应式对象。与 `reactive()` 创建的深响应式对象不同，`shallowReactive()` 仅对对象的顶层属性进行响应式处理，对象的嵌套属性不会被转换为响应式。

下面是 `shallowReactive()` 的基本使用示例：

```vue
<script setup lang="ts">
  import { shallowReactive, watch } from 'vue';

  // 创建一个浅响应式对象
  const state = shallowReactive({
    topLevelProp: '初始值',
    nested: {
      nestedProp: '嵌套初始值'
    }
  });

  // 监听顶层属性变化
  watch(() => state.topLevelProp, (newValue, oldValue) => {
    console.log(`顶层属性变化: 旧值 ${oldValue}, 新值 ${newValue}`);
  });

  // 监听嵌套属性变化
  watch(() => state.nested.nestedProp, (newValue, oldValue) => {
    console.log(`嵌套属性变化: 旧值 ${oldValue}, 新值 ${newValue}`);
  });

  // 修改顶层属性
  state.topLevelProp = '新的顶层值';
  // 修改嵌套属性
  state.nested.nestedProp = '新的嵌套值';
</script>
```

在上述代码中，当修改 `topLevelProp` 时，对应的 `watch` 回调会被触发；而修改 `nested` 对象里的 `nestedProp` 时，对应的 `watch` 回调不会被触发，因为 `shallowReactive()` 仅对顶层属性做响应式处理。

### 常见使用场景
1. 性能优化：当对象嵌套层级很深，且只有顶层属性会发生变化时，使用 `shallowReactive()` 可以避免 Vue 对所有嵌套属性进行递归转换，从而减少性能开销。
2. 与第三方库集成：有些第三方库返回的对象可能已经有自己的内部状态管理，此时使用 `shallowReactive()` 可以避免 Vue 对这些对象的嵌套属性进行不必要的转换，防止与第三方库的状态管理冲突。
3. 临时状态管理：在某些场景下，你可能只需要对对象的顶层属性进行响应式处理，而不需要关心嵌套属性的变化，使用 `shallowReactive()` 可以满足这种需求。

### 性能优化
在处理包含大量嵌套数据的对象时，若使用 `reactive()` 会递归地将所有嵌套属性转换为响应式，消耗大量性能。使用 `shallowReactive()` 只对顶层属性进行响应式处理，可显著提升性能。

```vue
<script setup lang="ts">
  import { shallowReactive, ref } from 'vue';

  // 模拟一个包含大量嵌套数据的对象
  const largeData = {
    visible: ref(false),
    nested: {
      // 这里可以有大量嵌套数据
      data: new Array(1000).fill(0).map((_, index) => ({ id: index }))
    }
  };

  // 使用 shallowReactive 创建浅响应式对象
  const state = shallowReactive(largeData);

  const toggleVisible = () => {
    state.visible.value = !state.visible.value;
  };
</script>

<template>
  <div>
    <button @click="toggleVisible">切换可见状态</button>
    <p v-if="state.visible.value">数据可见</p>
  </div>
</template>
```

在这个例子中，由于我们只需要对 `visible` 这个顶层属性进行响应式处理，使用 `shallowReactive()` 能避免对 `nested` 里大量数据进行递归转换，提高性能。

### 与第三方库集成
当和第三方库集成时，这些库返回的对象可能已有自己的状态管理机制，使用 `shallowReactive()` 可避免 Vue 对嵌套属性进行不必要的转换，防止与第三方库的状态管理冲突。

```vue
<script setup lang="ts">
  import { shallowReactive } from 'vue';
  // 模拟一个第三方库
  class ThirdPartyLibrary {
    constructor() {
      this.data = { value: '第三方数据' };
    }
    updateData(newValue: string) {
      this.data.value = newValue;
    }
  }

  const libraryInstance = new ThirdPartyLibrary();
  // 使用 shallowReactive 包装第三方库实例
  const state = shallowReactive({
    library: libraryInstance
  });

  const updateThirdPartyData = () => {
    state.library.updateData('更新后的第三方数据');
  };
</script>

<template>
  <div>
    <p>第三方数据: {{ state.library.data.value }}</p>
    <button @click="updateThirdPartyData">更新第三方数据</button>
  </div>
</template>
```

在这个例子中，`ThirdPartyLibrary` 有自己的状态管理，使用 `shallowReactive()` 包装实例，能避免 Vue 对 `library` 对象的嵌套属性进行响应式转换，防止与第三方库的状态管理冲突。

### 临时状态管理
在某些场景下，我们只需要对对象的顶层属性进行响应式处理，无需关心嵌套属性的变化，此时可以使用 `shallowReactive()`。

```vue
<script setup lang="ts">
  import { shallowReactive } from 'vue';

  // 创建一个浅响应式对象用于临时状态管理
  const tempState = shallowReactive({
    showDialog: false,
    dialogConfig: {
      title: '对话框标题',
      content: '对话框内容'
    }
  });

  const toggleDialog = () => {
    tempState.showDialog = !tempState.showDialog;
  };
</script>

<template>
  <div>
    <button @click="toggleDialog">切换对话框显示状态</button>
    <div v-if="tempState.showDialog">
      <h2>{{ tempState.dialogConfig.title }}</h2>
      <p>{{ tempState.dialogConfig.content }}</p>
    </div>
  </div>
</template>
```

在这个例子中，我们只需要对 `showDialog` 这个顶层属性进行响应式处理，控制对话框的显示和隐藏，而 `dialogConfig` 的嵌套属性不需要响应式处理，使用 `shallowReactive()` 能满足需求。

## shallowReadonly()
`shallowReadonly` 是 Vue 3 提供的一个响应式 API，用于创建一个浅只读的响应式对象。与 `readonly` 不同，`shallowReadonly` 仅将对象的顶层属性设置为只读，嵌套对象仍然保持可变。下面是基本使用示例：

```vue
<script setup lang="ts">
import { shallowReadonly } from 'vue';

// 定义一个普通对象
const originalObj = {
  topLevelProp: '顶层属性',
  nested: {
    nestedProp: '嵌套属性'
  }
};

// 使用 shallowReadonly 创建浅只读对象
const readonlyObj = shallowReadonly(originalObj);

// 尝试修改顶层属性（会失败，控制台会警告）
// readonlyObj.topLevelProp = '修改顶层属性'; 

// 尝试修改嵌套属性（会成功）
readonlyObj.nested.nestedProp = '修改嵌套属性';

console.log(readonlyObj.topLevelProp); 
console.log(readonlyObj.nested.nestedProp); 
</script>
```

在上述代码中，对顶层属性 `topLevelProp` 的修改会失败，Vue 会在控制台发出警告；而对嵌套属性 `nestedProp` 的修改则可以正常进行。

### 常见使用场景及举例
#### 1. 防止顶层属性被意外修改
在某些场景下，你希望组件接收到的对象的顶层属性不被意外修改，但允许嵌套属性可变。例如，一个组件接收一个配置对象，只希望顶层配置不被修改，而嵌套的配置可能需要动态调整。

```vue
<script setup lang="ts">
import { shallowReadonly, ref } from 'vue';

// 父组件传入的配置对象
const props = defineProps<{
  config: {
    title: string;
    settings: {
      theme: string;
    };
  };
}>();

// 使用 shallowReadonly 包装配置对象
const readonlyConfig = shallowReadonly(props.config);

// 尝试修改顶层属性（会失败）
// readonlyConfig.title = '新标题'; 

// 尝试修改嵌套属性（会成功）
readonlyConfig.settings.theme = 'dark';
</script>

<template>
  <div>
    <h1>{{ readonlyConfig.title }}</h1>
    <p>当前主题: {{ readonlyConfig.settings.theme }}</p>
  </div>
</template>
```

#### 2. 性能优化
当对象嵌套层级很深，且只需要保护顶层属性不被修改时，使用 `shallowReadonly` 可以避免对所有嵌套属性进行递归处理，减少性能开销。

```vue
<script setup lang="ts">
  import { shallowReadonly } from 'vue';

  // 模拟一个包含大量嵌套数据的对象
  const largeData = {
    topLevel: '顶层数据',
    nested: {
      // 这里可以有大量嵌套数据
      data: new Array(1000).fill(0).map((_, index) => ({ id: index }))
    }
  };

  // 使用 shallowReadonly 创建浅只读对象
  const readonlyLargeData = shallowReadonly(largeData);

  // 尝试修改顶层属性（会失败）
  // readonlyLargeData.topLevel = '新顶层数据'; 

  // 尝试修改嵌套属性（会成功）
  readonlyLargeData.nested.data[0].id = 999;
</script>
```

#### 3. 数据传递与安全
在数据传递过程中，为了确保顶层数据的安全性，防止在传递过程中被意外修改，同时允许嵌套数据根据业务需求进行调整，可以使用 `shallowReadonly`。

```vue
<script setup lang="ts">
import { shallowReadonly, ref } from 'vue';
import ConfigComponent from './components/ConfigComponent.vue';

const appConfig = {
  appName: '我的应用',
  userSettings: {
    language: 'zh-CN'
  }
};

const readonlyAppConfig = shallowReadonly(appConfig);
</script>

<template>
  <ConfigComponent :config="readonlyAppConfig" />
</template>
```

在这个例子中，`appName` 作为顶层属性不会被 `ConfigComponent` 意外修改，而 `userSettings` 中的 `language` 可以根据需要在组件内进行调整。

## effectScope()
`effectScope` 是 Vue 3 中用于管理副作用（如 `watch`、`watchEffect` 等）的 API，它允许将一组副作用收集到一个作用域中，方便统一控制这些副作用的激活、停止。以下是基本使用示例：

```vue
<script setup lang="ts">
import { effectScope, watchEffect, ref } from 'vue';

// 创建一个 effect 作用域
const scope = effectScope();

// 在作用域内运行副作用
scope.run(() => {
  const count = ref(0);
  watchEffect(() => {
    console.log(`当前 count 的值是: ${count.value}`);
  });

  // 修改响应式数据触发副作用
  count.value++;
});

// 停止作用域内的所有副作用
scope.stop();
</script>
```

上述代码中，先使用 `effectScope` 创建了一个作用域，然后在 `scope.run` 方法中定义了副作用函数。当 `count` 的值改变时，`watchEffect` 中的回调会执行。最后调用 `scope.stop()` 停止作用域内所有副作用，之后再修改 `count` 的值，`watchEffect` 不会再触发。

### 常见使用场景及举例
#### 1. 组件封装与复用
在封装可复用组件时，使用 `effectScope` 可以方便地管理组件内的副作用，当组件销毁时，能统一停止这些副作用，避免内存泄漏。

```vue
<script setup lang="ts">
  import { effectScope, watchEffect, ref, onUnmounted } from 'vue';

  // // 创建一个 effect 作用域
  const scope = effectScope();
  const data = ref(0);

  scope.run(() => {
    watchEffect(() => {
      console.log(`组件内数据变化: ${data.value}`);
    });

    // 模拟数据更新
    setInterval(() => {
      data.value++;
    }, 1000);
  });

  // 组件卸载时停止作用域内的所有副作用
  onUnmounted(() => {
    scope.stop();
  });
</script>

<template>
  <div>可复用组件: {{ data }}</div>
</template>
```

在这个例子中，组件内部的 `watchEffect` 和 `setInterval` 都在 `effectScope` 管理的作用域内。当组件卸载时，调用 `scope.stop()` 停止所有副作用，防止定时器继续运行造成内存泄漏。

#### 2. 插件开发
在开发 Vue 插件时，`effectScope` 能帮助管理插件产生的副作用，保证插件在被卸载时，其副作用也能被正确清理。

```js
import { App, effectScope, watchEffect, ref } from 'vue';

  export const myPlugin = {
    install(app: App) {
      const pluginScope = effectScope();

      pluginScope.run(() => {
        const pluginData = ref(0);
        watchEffect(() => {
          console.log(`插件数据变化: ${pluginData.value}`);
        });

        // 模拟插件数据更新
        setInterval(() => {
          pluginData.value++;
        }, 2000);
      });

      // 提供卸载插件的方法
      app.config.globalProperties.$uninstallMyPlugin = () => {
        pluginScope.stop();
      };
    },
  };
```

在插件中创建了一个 `effectScope`，并在其作用域内定义了副作用。同时为应用的全局属性添加了 `$uninstallMyPlugin` 方法，调用该方法就能停止插件作用域内的所有副作用。

#### 3. 动态加载模块
当动态加载模块时，使用 `effectScope` 可以管理模块内的副作用，在模块卸载时统一清理这些副作用。

```vue
<script setup lang="ts">
  import { effectScope, ref } from 'vue';

  const loadModule = async () => {
    const scope = effectScope();
    const { default: module } = await import('./modules/dynamicModule.vue');

    scope.run(() => {
      const moduleData = ref(0);
      // 假设模块内有副作用
      // 这里简单模拟一个 watchEffect
      const unwatch = module.watchEffect(() => {
        console.log(`动态模块数据变化: ${moduleData.value}`);
      });

      // 模拟数据更新
      setInterval(() => {
        moduleData.value++;
      }, 1500);

      // 提供卸载模块的方法
      return () => {
        scope.stop();
        unwatch();
      };
    });
  };

  // 调用加载模块函数
  const unloadModule = await loadModule();

  // 当需要卸载模块时
  // unloadModule();
</script>
```

此示例中，动态加载模块并在 `effectScope` 内运行模块的副作用。同时返回一个卸载函数，调用该函数就能停止作用域内的所有副作用。

## getCurrentScope()
`getCurrentScope` 是 Vue 3 中的一个 API，用于获取当前活跃的 `effectScope` 实例。如果当前没有活跃的 `effectScope`，则返回 `null`。该 API 通常与 `effectScope` 配合使用，借助获取当前作用域，对副作用进行统一管理。

下面是一个简单的使用示例：

```vue
<script setup lang="ts">
  import { effectScope, getCurrentScope, watchEffect, ref } from 'vue';

  // 创建一个 effect 作用域
  const scope = effectScope();

  scope.run(() => {
    // 在作用域内获取当前作用域实例
    const currentScope = getCurrentScope();
    console.log('当前作用域:', currentScope);

    const count = ref(0);
    watchEffect(() => {
      console.log(`当前 count 的值是: ${count.value}`);
    });

    // 修改响应式数据触发副作用
    count.value++;
  });

  // 在作用域外部获取当前作用域实例
  const outerScope = getCurrentScope();
  console.log('作用域外部的当前作用域:', outerScope);
</script>
```

在上述代码中，在 `scope.run` 内部调用 `getCurrentScope` 能获取到当前的 `effectScope` 实例；在作用域外部调用时，由于没有活跃的作用域，会返回 `null`。

### 常见使用场景及举例
#### 1. 动态注册副作用到当前作用域
在开发可复用的函数或组件时，可能需要将副作用动态注册到当前活跃的作用域中，以方便统一管理。

```vue
<script setup lang="ts">
  import { effectScope, getCurrentScope, watchEffect, ref, onUnmounted } from 'vue';

  // 可复用的副作用函数
  function useCustomEffect() {
    const data = ref(0);
    const currentScope = getCurrentScope();

    if (currentScope) {
      currentScope.run(() => {
        watchEffect(() => {
          console.log(`数据变化: ${data.value}`);
        });

        // 模拟数据更新
        setInterval(() => {
          data.value++;
        }, 1000);
      });
    }

    return data;
  }

  const scope = effectScope();
  scope.run(() => {
    const reactiveData = useCustomEffect();
  });

  // 组件卸载时停止作用域内的所有副作用
  onUnmounted(() => {
    scope.stop();
  });
</script>

<template>
  <div>可复用组件</div>
</template>
```

在这个例子中，`useCustomEffect` 函数会尝试获取当前活跃的作用域，若存在则将副作用注册到该作用域中。这样，在组件卸载时，通过停止作用域就能统一清理所有副作用。

#### 2. 插件开发中的副作用管理
在开发 Vue 插件时，可使用 `getCurrentScope` 确保插件产生的副作用被正确添加到当前作用域中，便于在插件卸载时清理这些副作用。

```ts
import { App, effectScope, getCurrentScope, watchEffect, ref } from 'vue';

  export const myPlugin = {
    install(app: App) {
      const pluginScope = effectScope();
      pluginScope.run(() => {
        const pluginData = ref(0);
        const currentScope = getCurrentScope();

        if (currentScope) {
          currentScope.run(() => {
            watchEffect(() => {
              console.log(`插件数据变化: ${pluginData.value}`);
            });

            // 模拟插件数据更新
            setInterval(() => {
              pluginData.value++;
            }, 2000);
          });
        }
      });

      // 提供卸载插件的方法
      app.config.globalProperties.$uninstallMyPlugin = () => {
        pluginScope.stop();
      };
    },
  };
```

在插件中，先创建一个 `effectScope`，在其作用域内获取当前作用域，并将插件的副作用注册到该作用域中。通过全局方法 `$uninstallMyPlugin` 就能停止作用域内的所有副作用。

#### 3. 嵌套作用域管理
在存在嵌套作用域的场景下，`getCurrentScope` 可以帮助我们明确当前正在使用的是哪个作用域，从而进行更细致的副作用管理。

```vue
<script setup lang="ts">
  import { effectScope, getCurrentScope, watchEffect, ref } from 'vue';

  const outerScope = effectScope();
  outerScope.run(() => {
    console.log('外层作用域:', getCurrentScope());

    const innerScope = effectScope();
    innerScope.run(() => {
      console.log('内层作用域:', getCurrentScope());

      const data = ref(0);
      watchEffect(() => {
        console.log(`内层作用域数据变化: ${data.value}`);
      });

      data.value++;
    });
  });
</script>
```

此示例中，通过 `getCurrentScope` 可以清晰地区分外层作用域和内层作用域，方便对不同层级的副作用进行管理。

## onScopeDispose()
`onScopeDispose` 是 Vue 3 中的一个 API，用于在当前的 `effectScope` 被停止（调用 `scope.stop()`）时执行清理逻辑。它的工作方式类似于 `onUnmounted` ，不过 `onUnmounted` 是在组件卸载时触发，而 `onScopeDispose` 是在作用域被停止时触发。

下面是一个简单的使用示例：

```vue
<script setup lang="ts">
  import { effectScope, onScopeDispose, ref } from 'vue';

  // 创建一个 effect 作用域
  const scope = effectScope();

  scope.run(() => {
    const count = ref(0);
    const intervalId = setInterval(() => {
      count.value++;
      console.log(`当前 count 的值是: ${count.value}`);
    }, 1000);

    // 注册作用域销毁时的清理函数
    onScopeDispose(() => {
      clearInterval(intervalId);
      console.log('作用域已停止，定时器已清除');
    });
  });

  // 模拟在某个时刻停止作用域
  setTimeout(() => {
    scope.stop();
  }, 5000);
</script>
```

在上述代码中，我们创建了一个 `effectScope`，在作用域内使用 `setInterval` 定时更新 `count` 的值。同时，使用 `onScopeDispose` 注册了一个清理函数，当调用 `scope.stop()` 停止作用域时，清理函数会被执行，清除定时器，避免内存泄漏。

### 常见使用场景及举例
#### 1. 组件内副作用清理
在组件中使用 `effectScope` 管理副作用时，可使用 `onScopeDispose` 在作用域停止时清理这些副作用，确保组件在销毁或不再需要这些副作用时，能正确释放资源。

```vue
<script setup lang="ts">
  import { effectScope, onScopeDispose, onUnmounted, ref } from 'vue';

  const scope = effectScope();

  scope.run(() => {
    const data = ref(0);
    const timer = setInterval(() => {
      data.value++;
      console.log(`组件数据更新: ${data.value}`);
    }, 1000);

    // 注册作用域销毁时的清理函数
    onScopeDispose(() => {
      clearInterval(timer);
      console.log('组件作用域停止，定时器已清除');
    });
  });

  // 组件卸载时停止作用域
  onUnmounted(() => {
    scope.stop();
  });
</script>

<template>
  <div>清理副作用组件</div>
</template>
```

在这个组件中，`onScopeDispose` 确保了在组件卸载（调用 `scope.stop()`）时，定时器能被正确清除，避免了因定时器持续运行而导致的内存泄漏。

#### 2. 插件开发中的资源释放
在开发 Vue 插件时，插件可能会创建一些需要在插件被卸载时清理的资源，如定时器、事件监听器等。使用 `onScopeDispose` 可以方便地在插件作用域停止时执行清理操作。

```ts
import { App, effectScope, onScopeDispose, ref } from 'vue';

  export const cleanupPlugin = {
    install(app: App) {
      const pluginScope = effectScope();

      pluginScope.run(() => {
        const pluginData = ref(0);
        const intervalId = setInterval(() => {
          pluginData.value++;
          console.log(`插件数据更新: ${pluginData.value}`);
        }, 2000);

        // 注册作用域销毁时的清理函数
        onScopeDispose(() => {
          clearInterval(intervalId);
          console.log('插件作用域停止，定时器已清除');
        });
      });

      // 提供卸载插件的方法
      app.config.globalProperties.$uninstallCleanupPlugin = () => {
        pluginScope.stop();
      };
    },
  };
```

在这个插件中，通过 `onScopeDispose` 注册了清理函数，当调用 `$uninstallCleanupPlugin` 方法停止插件作用域时，定时器会被清除，释放相关资源。

#### 3. 动态模块加载时的资源管理
在动态加载模块时，模块可能会创建一些副作用，使用 `onScopeDispose` 可以在模块对应的作用域停止时清理这些副作用，确保资源被正确释放。

```vue
<script setup lang="ts">
  import { effectScope, onScopeDispose, ref } from 'vue';

  const loadModule = async () => {
    const scope = effectScope();
    const { default: module } = await import('./modules/DynamicModule.vue');

    scope.run(() => {
      const moduleData = ref(0);
      const timer = setInterval(() => {
        moduleData.value++;
        console.log(`动态模块数据更新: ${moduleData.value}`);
      }, 1500);

      // 注册作用域销毁时的清理函数
      onScopeDispose(() => {
        clearInterval(timer);
        console.log('动态模块作用域停止，定时器已清除');
      });

      // 提供卸载模块的方法
      return () => {
        scope.stop();
      };
    });
  };

  // 调用加载模块函数
  const unloadModule = await loadModule();

  // 当需要卸载模块时
  // unloadModule();
</script>
```

在这个示例中，动态加载模块并在 `effectScope` 内运行模块的副作用。使用 `onScopeDispose` 注册清理函数，当调用 `unloadModule` 停止作用域时，定时器会被清除，完成资源的清理工作。

## 相关链接
[响应式 API：进阶](https://cn.vuejs.org/api/reactivity-advanced.html)

