---
bracketEscaping: true
tags: ['PropType<T>','MaybeRef<T>','MaybeRefOrGetter<T>','ExtractPropTypes<T>','ExtractPublicPropTypes<T>','ComponentCustomProperties','ComponentCustomProps','CSSProperties']
---

# TypeScript 工具类型

## Vue中的类型工具PropType<T>详解

### 什么是PropType<T>

`PropType<T>`是Vue中用于增强props类型检查的工具类型，特别是在使用TypeScript开发Vue应用时非常有用。它允许我们为props定义更精确的类型，而不仅仅是JavaScript的基本类型检查。

### 为什么需要PropType<T>

在Vue中，我们通常这样定义props的类型：

```javascript
props: {
  age: Number,
  name: String,
  isActive: Boolean
}
```

但在TypeScript中，我们希望能够：
1. 定义更复杂的类型
2. 获得更好的类型推断
3. 在开发时就能捕获类型错误

这就是`PropType<T>`的用武之地。

### 基本用法

首先看一个简单示例：

```typescript
import { PropType } from 'vue'

interface User {
  name: string
  age: number
  email?: string
}

export default {
  props: {
    // 基本类型
    title: String,
    
    // 使用PropType定义复杂类型
    user: {
      type: Object as PropType<User>,
      required: true
    },
    
    // 数组类型
    hobbies: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    
    // 联合类型
    status: {
      type: String as PropType<'active' | 'inactive' | 'pending'>,
      default: 'pending'
    }
  }
}
```

### 高级用法

#### 1. 函数类型

```typescript
props: {
  onClick: {
    type: Function as PropType<(payload: MouseEvent) => void>,
    required: true
  }
}
```

#### 2. 复杂对象类型

```typescript
interface Product {
  id: number
  name: string
  price: number
  variants?: {
    color: string
    size: string
  }[]
}

props: {
  product: {
    type: Object as PropType<Product>,
    required: true
  }
}
```

#### 3. 自定义类实例

```typescript
class CustomClass {
  constructor(public value: string) {}
}

props: {
  customInstance: {
    type: Object as PropType<CustomClass>,
    required: true
  }
}
```

### 完整可运行示例

下面是一个完整的Vue单文件组件示例：

```vue
<template>
  <div class="user-card">
    <h2>{{ user.name }}</h2>
    <p>Age: {{ user.age }}</p>
    <p v-if="user.email">Email: {{ user.email }}</p>
    
    <h3>Hobbies</h3>
    <ul>
      <li v-for="hobby in hobbies" :key="hobby">
        {{ hobby }}
      </li>
    </ul>
    
    <p>Status: {{ status }}</p>
    
    <button @click="handleClick">Click me</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

interface User {
  name: string
  age: number
  email?: string
}

export default defineComponent({
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
      validator: (value: User) => {
        return value.name !== '' && value.age > 0
      }
    },
    hobbies: {
      type: Array as PropType<string[]>,
      default: () => ['reading', 'coding']
    },
    status: {
      type: String as PropType<'active' | 'inactive' | 'pending'>,
      default: 'pending'
    },
    onAction: {
      type: Function as PropType<(actionType: string) => void>,
      required: false
    }
  },
  methods: {
    handleClick() {
      if (this.onAction) {
        this.onAction('button-clicked')
      }
    }
  }
})
</script>
```

### 使用注意事项

1. **类型断言是必须的**：`as PropType<T>`是必须的，因为Vue的props系统最初是为JavaScript设计的
2. **运行时验证**：PropType只提供类型检查，运行时验证仍需通过`validator`
3. **默认值**：确保默认值与类型匹配
4. **复杂类型性能**：过于复杂的类型可能会影响编译性能

### 常见问题解答

**Q: PropType和直接使用TypeScript类型有什么区别？**

A: PropType是专门为Vue的props系统设计的，它能够与Vue的运行时类型检查系统协同工作，而普通的TypeScript类型只在编译时起作用。

**Q: 为什么需要类型断言(as PropType)？**

A: 因为Vue的props类型系统最初是为JavaScript设计的，需要通过类型断言告诉TypeScript我们想要更精确的类型检查。

### 通俗易懂的总结

可以把`PropType<T>`想象成一个"翻译官"，它帮助Vue理解TypeScript的类型定义。没有它，Vue只能理解基本的类型（String、Number等），有了它，Vue就能理解我们自定义的复杂类型（如接口、联合类型等）。

就像你去国外旅游，会说英语可能够用（基本类型），但如果你想深入交流（复杂类型），就需要一个翻译（PropType）来准确传达你的意思。

### 最佳实践建议

1. 对复杂数据结构使用PropType
2. 为可选props提供合理的默认值
3. 结合validator进行运行时验证
4. 优先使用接口(interface)而不是类型别名(type)定义props类型
5. 对于大型项目，考虑将props类型定义单独放在类型声明文件中


## Vue中的类型工具 MaybeRef<T> 详解

### 什么是 MaybeRef<T>

`MaybeRef<T>` 是 Vue 3 组合式 API 中一个非常实用的工具类型，它表示一个值可以是普通类型 T 或者是一个 Ref<T>。这个类型工具在处理可能被 ref 包装的值时特别有用，让我们可以编写更灵活的函数和组件。

### 为什么需要 MaybeRef<T>

在组合式 API 开发中，我们经常会遇到这样的情况：
1. 一个函数可能需要接受普通值或 ref 值作为参数
2. 一个 prop 可能接受普通值或 ref 值
3. 需要统一处理响应式和非响应式数据

这时候 `MaybeRef<T>` 就能帮我们优雅地处理这些情况。

### 基本用法

```typescript
import { MaybeRef } from 'vue'

// 定义一个接受 MaybeRef 参数的函数
function double(value: MaybeRef<number>) {
  return isRef(value) ? value.value * 2 : value * 2
}
```

### 在组件中的使用

#### 1. 组件 props 中使用 MaybeRef

```typescript
import { defineComponent, MaybeRef } from 'vue'

export default defineComponent({
  props: {
    count: {
      type: [Number, Object] as MaybeRef<number>,
      required: true
    }
  },
  setup(props) {
    // props.count 可能是 number 或 Ref<number>
  }
})
```

#### 2. 组合式函数中使用 MaybeRef

```typescript
import { ref, MaybeRef, unref } from 'vue'

function useCounter(initialValue: MaybeRef<number>) {
  const count = ref(unref(initialValue))
  
  const increment = () => {
    count.value++
  }
  
  return {
    count,
    increment
  }
}
```

### 完整可运行示例

下面是一个完整的 Vue 单文件组件示例：

```vue
<template>
  <div>
    <h2>Counter: {{ count }}</h2>
    <button @click="increment">Increment</button>
    
    <h3>Double value: {{ doubleValue }}</h3>
    
    <div class="controls">
      <label>
        <input type="radio" v-model="useRef" :value="true"> Use Ref
      </label>
      <label>
        <input type="radio" v-model="useRef" :value="false"> Use Plain Value
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, MaybeRef, unref } from 'vue'

// 一个接受 MaybeRef 参数的实用函数
function double(value: MaybeRef<number>) {
  return unref(value) * 2
}

export default defineComponent({
  setup() {
    const useRef = ref(true)
    const initialValue = 10
    
    // 根据选择决定使用 ref 还是普通值
    const counterInput = computed(() => 
      useRef.value ? ref(initialValue) : initialValue
    )
    
    // 使用我们的 useCounter 函数
    const { count, increment } = useCounter(counterInput.value)
    
    // 使用 double 函数
    const doubleValue = computed(() => double(count))
    
    return {
      count,
      increment,
      doubleValue,
      useRef
    }
  }
})

// 组合式函数定义
function useCounter(initialValue: MaybeRef<number>) {
  const count = ref(unref(initialValue))
  
  const increment = () => {
    count.value++
  }
  
  return {
    count,
    increment
  }
}
</script>

<style scoped>
.controls {
  margin-top: 20px;
}
label {
  margin-right: 10px;
}
</style>
```

### 相关工具函数

Vue 提供了一些与 MaybeRef 相关的实用函数：

1. **unref()** - 获取 MaybeRef 的值
   ```typescript
   const a = ref(1)
   const b = 2
   
   unref(a) // 1
   unref(b) // 2
   ```

2. **isRef()** - 检查是否是 ref
   ```typescript
   isRef(a) // true
   isRef(b) // false
   ```

### 使用场景

1. **编写通用工具函数**：函数可以同时接受普通值和 ref 值
2. **组件 props 设计**：组件可以更灵活地接受响应式或非响应式数据
3. **组合式函数**：使组合式函数更加灵活

### 注意事项

1. **类型安全**：虽然 MaybeRef 提供了灵活性，但仍需确保类型安全
2. **性能考虑**：频繁使用 unref 可能会有轻微性能开销
3. **明确意图**：在 API 设计中明确文档说明是否接受 MaybeRef

### 通俗易懂的总结

可以把 `MaybeRef<T>` 想象成一个"智能盒子"，它能同时装下两种东西：
- 直接的值（比如数字 42）
- 装着值的盒子（Ref，比如 ref(42)）

当我们从"智能盒子"里取东西时，它会自动判断：
- 如果给的是盒子，就打开盒子拿里面的值
- 如果给的就是值，直接使用

这样我们就不用每次都手动检查"这是盒子还是直接的值"，让代码更简洁高效。

### 最佳实践建议

1. 在编写通用工具函数时优先考虑使用 MaybeRef
2. 对于组件 props，如果确实需要灵活性再使用 MaybeRef
3. 组合式函数中合理使用 unref 来统一处理值
4. 避免过度使用，只在确实需要灵活性的场景使用
5. 在类型定义中明确文档说明参数是否接受 MaybeRef

## Vue中的类型工具 MaybeRefOrGetter<T> 详解

### 什么是 MaybeRefOrGetter<T>

`MaybeRefOrGetter<T>` 是 Vue 3 组合式 API 中一个高级工具类型，它扩展了 `MaybeRef<T>` 的概念，表示一个值可以是：
1. 普通类型 T
2. Ref<T>
3. Getter<T>（即返回 T 的函数）

这个类型工具在处理可能被 ref 包装或需要计算的值时特别有用，为我们的代码提供了更大的灵活性。

### 为什么需要 MaybeRefOrGetter<T>

在实际开发中，我们经常遇到这些场景：
1. 需要接受静态值、响应式值或计算值作为参数
2. 组件 prop 需要支持多种形式的值传递
3. 工具函数需要处理各种形式的值输入
4. 组合式函数需要更灵活的输入类型

`MaybeRefOrGetter<T>` 完美解决了这些问题。

### 基本用法

```typescript
import { MaybeRefOrGetter } from 'vue'

// 定义一个接受 MaybeRefOrGetter 参数的函数
function triple(value: MaybeRefOrGetter<number>) {
  const resolvedValue = typeof value === 'function' 
    ? value() 
    : unref(value)
  return resolvedValue * 3
}
```

### 在组件中的使用

#### 1. 组件 props 中使用 MaybeRefOrGetter

```typescript
import { defineComponent, MaybeRefOrGetter } from 'vue'

export default defineComponent({
  props: {
    price: {
      type: [Number, Object, Function] as MaybeRefOrGetter<number>,
      required: true
    }
  },
  setup(props) {
    // props.price 可能是 number | Ref<number> | () => number
  }
})
```

#### 2. 组合式函数中使用 MaybeRefOrGetter

```typescript
import { ref, MaybeRefOrGetter, unref, computed } from 'vue'

function usePriceFormatter(price: MaybeRefOrGetter<number>) {
  const formattedPrice = computed(() => {
    const value = typeof price === 'function' ? price() : unref(price)
    return `$${value.toFixed(2)}`
  })
  
  return {
    formattedPrice
  }
}
```

### 完整可运行示例

下面是一个完整的 Vue 单文件组件示例，展示了 MaybeRefOrGetter 的实际应用：

```vue
<template>
  <div class="price-display">
    <h2>Price Formatter Demo</h2>
    
    <div class="price-container">
      <p>Original Price: {{ displayPrice }}</p>
      <p>Formatted Price: {{ formattedPrice }}</p>
      <p>Tripled Price: {{ tripledPrice }}</p>
    </div>
    
    <div class="controls">
      <label>
        <input type="radio" v-model="priceType" value="plain"> Plain Number
      </label>
      <label>
        <input type="radio" v-model="priceType" value="ref"> Ref
      </label>
      <label>
        <input type="radio" v-model="priceType" value="getter"> Getter Function
      </label>
    </div>
    
    <div class="input-group">
      <label>Set Price:</label>
      <input type="number" v-model="priceValue" step="0.01">
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, MaybeRefOrGetter, unref } from 'vue'

export default defineComponent({
  setup() {
    const priceType = ref<'plain' | 'ref' | 'getter'>('plain')
    const priceValue = ref(19.99)
    
    // 根据选择创建不同类型的 price
    const price = computed<MaybeRefOrGetter<number>>(() => {
      switch (priceType.value) {
        case 'plain':
          return priceValue.value
        case 'ref':
          return ref(priceValue.value)
        case 'getter':
          return () => priceValue.value * 0.9 // 模拟折扣
      }
    })
    
    // 使用我们的 priceFormatter
    const { formattedPrice } = usePriceFormatter(price.value)
    
    // 使用 triple 函数
    const tripledPrice = computed(() => triple(price.value))
    
    // 显示原始价格（处理各种类型）
    const displayPrice = computed(() => {
      if (typeof price.value === 'function') {
        return price.value()
      }
      return unref(price.value)
    })
    
    return {
      priceType,
      priceValue,
      formattedPrice,
      tripledPrice,
      displayPrice
    }
  }
})

// 接受 MaybeRefOrGetter 的工具函数
function triple(value: MaybeRefOrGetter<number>): number {
  const resolvedValue = typeof value === 'function' 
    ? value() 
    : unref(value)
  return resolvedValue * 3
}

// 组合式函数定义
function usePriceFormatter(price: MaybeRefOrGetter<number>) {
  const formattedPrice = computed(() => {
    const value = typeof price === 'function' ? price() : unref(price)
    return `$${value.toFixed(2)}`
  })
  
  return {
    formattedPrice
  }
}
</script>

<style scoped>
.price-display {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.price-container {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
}

.controls {
  margin: 15px 0;
  display: flex;
  gap: 15px;
}

.input-group {
  margin-top: 15px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.input-group input[type="number"] {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
}
</style>
```

### 相关工具函数

使用 `MaybeRefOrGetter<T>` 时，这些工具函数很有帮助：

1. **unref()** - 解包 MaybeRef
   ```typescript
   const a = ref(1)
   unref(a) // 1
   ```

2. **resolveUnref()** - VueUse 中的工具函数，处理 MaybeRefOrGetter
   ```typescript
   import { resolveUnref } from '@vueuse/core'
   
   const value = resolveUnref(maybeRefOrGetter) // 总是返回解包后的值
   ```

### 使用场景

1. **通用工具函数**：创建可接受多种输入形式的工具函数
2. **组件设计**：设计更灵活的组件 API
3. **状态管理**：处理可能以多种形式存在的状态
4. **计算属性**：创建基于多种输入来源的计算逻辑

### 注意事项

1. **类型安全**：确保正确处理所有可能的类型
2. **性能优化**：避免在频繁调用的函数中不必要的解包
3. **可读性**：适当添加注释说明参数类型
4. **文档**：在公共 API 中明确文档说明参数类型

### 通俗易懂的总结

想象 `MaybeRefOrGetter<T>` 就像一个"万能接收器"，它可以接受：
- 直接的值（比如数字 100）
- 装着值的盒子（Ref，比如 ref(100)）
- 一个能告诉你值的机器（Getter 函数，比如 () => 100）

当我们向这个"万能接收器"要值时，它会自动判断：
1. 如果是机器（Getter），就运行它拿到值
2. 如果是盒子（Ref），就打开盒子拿值
3. 如果直接就是值，就直接使用

这样我们就能写出更灵活、适应性更强的代码，就像有一个智能助手帮我们处理各种不同形式的输入。

### 最佳实践建议

1. 在编写高度可复用的工具函数时优先考虑使用 MaybeRefOrGetter
2. 对于组件 props，仅在确实需要极大灵活性时使用
3. 组合式函数中合理使用 resolveUnref 来统一处理值
4. 注意区分何时使用 MaybeRef 和 MaybeRefOrGetter
5. 在类型定义和文档中明确说明参数接受哪些形式的值

## Vue中的类型工具 ExtractPropTypes<T> 详解

### 什么是 ExtractPropTypes<T>

`ExtractPropTypes<T>` 是 Vue 3 中用于从组件 props 定义中提取类型信息的工具类型。它能够将我们定义的 props 选项对象转换为一个类型，这个类型描述了组件 props 的实际类型结构。

### 为什么需要 ExtractPropTypes<T>

在 Vue 开发中，我们经常遇到以下需求：
1. 需要在组件外部使用组件 props 的类型
2. 希望在父组件中获得子组件 props 的完整类型提示
3. 需要基于 props 类型创建其他派生类型
4. 确保 props 的运行时类型与 TypeScript 类型一致

`ExtractPropTypes<T>` 完美解决了这些问题。

### 基本用法

```typescript
import { ExtractPropTypes } from 'vue'

const propsDefinition = {
  title: String,
  count: {
    type: Number,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
}

type Props = ExtractPropTypes<typeof propsDefinition>
// 结果类型：
// {
//   title?: string
//   count: number
//   disabled?: boolean
// }
```

### 在组件中的使用

#### 1. 定义组件 props 并提取类型

```typescript
import { defineComponent, ExtractPropTypes } from 'vue'

const buttonProps = {
  size: {
    type: String as PropType<'small' | 'medium' | 'large'>,
    default: 'medium'
  },
  disabled: Boolean
}

type ButtonProps = ExtractPropTypes<typeof buttonProps>

export default defineComponent({
  props: buttonProps,
  setup(props: ButtonProps) {
    // props 现在有完整的类型提示
  }
})
```

#### 2. 在父组件中使用子组件 props 类型

```typescript
import { ExtractPropTypes } from 'vue'
import ChildComponent from './ChildComponent.vue'

type ChildProps = ExtractPropTypes<typeof ChildComponent.props>

function useChildProps(): ChildProps {
  return {
    // 这里会有完整的类型提示
  }
}
```

### 完整可运行示例

下面是一个完整的 Vue 单文件组件示例：

```vue
<template>
  <div class="user-profile">
    <h2>{{ title }}</h2>
    
    <div class="user-info">
      <p>Name: {{ user.name }}</p>
      <p>Age: {{ user.age }}</p>
      <p v-if="user.email">Email: {{ user.email }}</p>
    </div>
    
    <button 
      :disabled="disabled"
      @click="handleClick"
    >
      {{ buttonText }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ExtractPropTypes, PropType } from 'vue'

// 定义 User 类型
interface User {
  name: string
  age: number
  email?: string
}

// 定义 props 结构
const userProfileProps = {
  title: {
    type: String,
    required: true
  },
  user: {
    type: Object as PropType<User>,
    required: true,
    validator: (user: User) => {
      return user.name.trim().length > 0 && user.age > 0
    }
  },
  disabled: {
    type: Boolean,
    default: false
  },
  buttonText: {
    type: String,
    default: 'Click me'
  },
  onAction: {
    type: Function as PropType<(action: string) => void>,
    required: false
  }
} as const // 注意这里的 as const 很重要

// 提取 props 类型
type UserProfileProps = ExtractPropTypes<typeof userProfileProps>

export default defineComponent({
  name: 'UserProfile',
  
  // 使用我们定义的 props
  props: userProfileProps,
  
  setup(props: UserProfileProps) {
    const handleClick = () => {
      if (!props.disabled && props.onAction) {
        props.onAction('button-clicked')
      }
    }
    
    return {
      handleClick
    }
  }
})
</script>

<style scoped>
.user-profile {
  border: 1px solid #eee;
  padding: 20px;
  border-radius: 8px;
  max-width: 300px;
}

.user-info {
  margin: 15px 0;
}

button {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
```

### 关键点解析

1. **`as const` 的重要性**：
   ```typescript
   const props = { ... } as const
   ```
   这确保了 TypeScript 将对象字面量视为不可变的，保留所有类型信息。

2. **与 PropType 的关系**：
   `ExtractPropTypes` 会正确处理使用 `PropType<T>` 定义的类型。

3. **required 和 default 的影响**：
   - required: true 会生成非可选属性
   - default 值会使属性变为可选

### 高级用法

#### 1. 创建基于 props 的派生类型

```typescript
type ReadonlyProps = Readonly<ExtractPropTypes<typeof propsDefinition>>
```

#### 2. 提取部分 props 类型

```typescript
type OptionalProps = Pick<ExtractPropTypes<typeof propsDefinition>, 'title' | 'disabled'>
```

#### 3. 在组合式函数中使用

```typescript
function useProfileLogic(props: ExtractPropTypes<typeof userProfileProps>) {
  // 可以安全地使用 props
}
```

### 注意事项

1. **props 定义必须使用 `as const`**：否则会丢失部分类型信息
2. **运行时验证仍然必要**：TypeScript 类型只在编译时起作用
3. **复杂类型可能需要显式标注**：特别是联合类型和函数类型
4. **Vue 版本兼容性**：确保使用 Vue 3.2+

### 通俗易懂的总结

可以把 `ExtractPropTypes<T>` 想象成一个"类型提取器"，它能够：
1. 从你定义的 props 配置中"提取"出类型信息
2. 自动处理 required、default 等选项对类型的影响
3. 保持与运行时 props 验证的一致性

就像从食谱中提取出食材清单一样，`ExtractPropTypes` 从 props 配置中提取出类型清单，让我们可以在其他地方安全地使用这些类型信息。

### 最佳实践建议

1. 总是使用 `as const` 修饰 props 定义对象
2. 为复杂 props 使用 PropType 确保类型准确
3. 提取的类型可以用于组件 setup 函数参数类型
4. 共享组件时，导出 props 定义和提取的类型
5. 结合 validator 确保运行时类型安全

### 常见问题解答

**Q: 为什么我的 ExtractPropTypes 结果不准确？**
A: 很可能是因为忘记在 props 定义后加 `as const`，这会导致 TypeScript 无法保留字面量类型信息。

**Q: ExtractPropTypes 和 InstanceType 有什么区别？**
A: `ExtractPropTypes` 提取的是 props 的类型，而 `InstanceType<typeof Component>` 获取的是组件实例的类型（包括 props、methods 等）。


## Vue中的类型工具 ExtractPublicPropTypes<T> 详解

### 什么是 ExtractPublicPropTypes<T>

`ExtractPublicPropTypes<T>` 是 Vue 3.3+ 新增的一个高级类型工具，用于从组件 props 定义中提取"公共 props"的类型信息。它与 `ExtractPropTypes<T>` 类似，但专门用于处理需要暴露给外部使用的 props 类型。

### 与 ExtractPropTypes 的关键区别

1. **处理内部 props**：自动过滤掉以内部约定（如 `_` 开头）的 props
2. **更适合组件库**：为组件提供更干净的公共 API 类型
3. **类型导出友好**：生成的类型更适合作为公共 API 的一部分导出

### 为什么需要 ExtractPublicPropTypes<T>

在组件库开发中，我们经常遇到：
1. 需要区分内部 props 和公共 props
2. 不希望将内部使用的 props 暴露给组件使用者
3. 需要为组件使用者提供更清晰的类型提示
4. 避免意外暴露内部实现细节

### 基本用法

```typescript
import { ExtractPublicPropTypes } from 'vue'

const propsDefinition = {
  // 公共 props
  size: String,
  disabled: Boolean,
  
  // 内部 props (通常以下划线开头)
  _internalState: {
    type: String,
    default: ''
  }
}

type PublicProps = ExtractPublicPropTypes<typeof propsDefinition>
// 结果类型：
// {
//   size?: string
//   disabled?: boolean
// }
// 注意 _internalState 被过滤掉了
```

### 在组件中的使用

#### 1. 定义组件并提取公共 props 类型

```typescript
import { defineComponent, ExtractPublicPropTypes } from 'vue'

const modalProps = {
  // 公共 API
  visible: Boolean,
  title: String,
  
  // 内部使用
  _transitionState: String
} as const

type ModalProps = ExtractPublicPropTypes<typeof modalProps>

export default defineComponent({
  props: modalProps,
  setup(props) {
    // props 包含所有定义的 props
  }
})

// 导出给外部使用的类型
export type { ModalProps }
```

#### 2. 父组件中使用子组件的公共 props 类型

```typescript
import { ExtractPublicPropTypes } from 'vue'
import MyModal from './MyModal.vue'

type ModalProps = ExtractPublicPropTypes<typeof MyModal.props>

const modalProps: ModalProps = {
  visible: true,
  title: 'Confirm'
  // 不能访问 _transitionState
}
```

### 完整可运行示例

下面是一个完整的 Vue 单文件组件示例：

```vue
<template>
  <div class="smart-input" :class="{ disabled: disabled }">
    <label v-if="label">{{ label }}</label>
    <input
      :type="type"
      :value="modelValue"
      @input="handleInput"
      :disabled="disabled"
      :placeholder="placeholder"
    />
    
    <div class="internal-state" v-if="_debug">
      Internal: {{ _debugInfo }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ExtractPublicPropTypes, PropType } from 'vue'

// 定义 props 结构
const smartInputProps = {
  // 公共 API
  modelValue: {
    type: [String, Number] as PropType<string | number>,
    required: true
  },
  label: String,
  type: {
    type: String as PropType<'text' | 'password' | 'email'>,
    default: 'text'
  },
  disabled: Boolean,
  placeholder: String,
  
  // 内部调试用 props
  _debug: Boolean,
  _debugInfo: {
    type: String,
    default: 'debug info'
  }
} as const

// 提取公共 props 类型
type SmartInputProps = ExtractPublicPropTypes<typeof smartInputProps>

export default defineComponent({
  name: 'SmartInput',
  
  props: smartInputProps,
  
  emits: ['update:modelValue'],
  
  setup(props, { emit }) {
    const handleInput = (e: Event) => {
      if (props.disabled) return
      const value = (e.target as HTMLInputElement).value
      emit('update:modelValue', props.type === 'number' ? Number(value) : value)
      
      // 内部调试逻辑
      if (props._debug) {
        console.log('Input value changed:', value)
      }
    }
    
    return {
      handleInput
    }
  }
})

// 导出公共 props 类型
export type { SmartInputProps }
</script>

<style scoped>
.smart-input {
  margin: 10px 0;
  font-family: Arial, sans-serif;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
}

.disabled input {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.internal-state {
  margin-top: 5px;
  font-size: 0.8em;
  color: #666;
}
</style>
```

### 使用场景示例

#### 在父组件中使用

```vue
<template>
  <div>
    <SmartInput
      v-model="username"
      label="Username"
      type="text"
      :disabled="isLoading"
      placeholder="Enter your username"
    />
    
    <!-- 以下代码会报类型错误 -->
    <!-- <SmartInput _debug :_debug-info="debugData" /> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import SmartInput, { SmartInputProps } from './SmartInput.vue'

export default defineComponent({
  components: { SmartInput },
  
  setup() {
    const username = ref('')
    const isLoading = ref(false)
    
    // 使用公共 props 类型
    const inputProps: Partial<SmartInputProps> = {
      label: 'Username',
      type: 'text'
    }
    
    return {
      username,
      isLoading,
      inputProps
    }
  }
})
</script>
```

### 关键注意事项

1. **命名约定**：内部 props 通常使用 `_` 前缀作为命名约定
2. **类型安全**：即使技术上可以传递内部 props，类型系统会阻止
3. **版本要求**：需要 Vue 3.3 或更高版本
4. **与 defineProps 配合**：在 `<script setup>` 中也可以使用

### 通俗易懂的总结

`ExtractPublicPropTypes<T>` 就像是一个"组件 API 过滤器"，它能够：

1. 从组件所有 props 中筛选出应该公开的部分
2. 自动隐藏内部使用的 props（通常以 `_` 开头）
3. 为组件使用者提供更干净、更安全的类型提示

就像一家餐厅的菜单（公共 API）不会列出厨房内部使用的食材（内部 props）一样，`ExtractPublicPropTypes` 帮助我们在类型层面维护这种区分。

### 最佳实践建议

1. **明确区分公共/内部 props**：使用命名约定（如 `_` 前缀）
2. **导出公共 props 类型**：方便组件使用者获取类型提示
3. **文档说明**：明确记录哪些 props 是公共 API 的一部分
4. **结合 as const**：确保 props 定义的类型信息完整保留
5. **组件库开发必用**：特别适合需要维护公共 API 的组件库

## Vue中的类型工具 ComponentCustomProperties 详解

### 什么是 ComponentCustomProperties

`ComponentCustomProperties` 是 Vue 3 中用于扩展组件实例类型声明的重要工具。它允许我们为组件实例添加自定义属性和方法，同时保持 TypeScript 的类型安全。

### 为什么需要 ComponentCustomProperties

在 Vue 开发中，我们经常需要：
1. 在组件实例上添加全局可用的自定义属性（如 $api、$auth）
2. 为插件添加的类型支持
3. 扩展内置的组件实例类型
4. 保持自定义属性的类型安全

### 基本类型扩展方式

```typescript
import { ComponentCustomProperties } from 'vue'

declare module 'vue' {
  interface ComponentCustomProperties {
    $myGlobal: string
    $formatDate: (date: Date) => string
  }
}
```

### 完整可运行示例

#### 1. 首先定义类型扩展

```typescript
// types/vue.d.ts
import { ComponentCustomProperties } from 'vue'

declare module 'vue' {
  interface ComponentCustomProperties {
    // 添加全局工具函数
    $formatCurrency: (value: number) => string
    
    // 添加全局服务
    $api: {
      getUsers: () => Promise<User[]>
      postData: (data: any) => Promise<void>
    }
    
    // 添加全局配置
    $appConfig: {
      env: 'development' | 'production'
      version: string
    }
  }
}

interface User {
  id: number
  name: string
}
```

#### 2. 实现插件并安装

```typescript
// plugins/globalProperties.ts
import { Plugin } from 'vue'

const GlobalPropertiesPlugin: Plugin = {
  install(app) {
    // 添加格式化货币方法
    app.config.globalProperties.$formatCurrency = (value: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value)
    }
    
    // 添加模拟 API
    app.config.globalProperties.$api = {
      async getUsers() {
        return [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' }
        ]
      },
      async postData(data: any) {
        console.log('Posting data:', data)
      }
    }
    
    // 添加应用配置
    app.config.globalProperties.$appConfig = {
      env: import.meta.env.MODE as 'development' | 'production',
      version: '1.0.0'
    }
  }
}

export default GlobalPropertiesPlugin
```

#### 3. 在组件中使用

```vue
<template>
  <div class="user-dashboard">
    <h2>User Dashboard ({{ $appConfig.env }} v{{ $appConfig.version }})</h2>
    
    <div class="balance">
      <h3>Account Balance</h3>
      <p>{{ $formatCurrency(balance) }}</p>
    </div>
    
    <div class="user-list">
      <h3>Users</h3>
      <ul>
        <li v-for="user in users" :key="user.id">
          {{ user.name }}
        </li>
      </ul>
    </div>
    
    <button @click="sendData">Send Data</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'UserDashboard',
  
  data() {
    return {
      balance: 1234.56,
      users: [] as { id: number; name: string }[]
    }
  },
  
  async created() {
    // 使用 $api 获取用户数据
    this.users = await this.$api.getUsers()
  },
  
  methods: {
    sendData() {
      // 使用 $api 发送数据
      this.$api.postData({
        timestamp: new Date(),
        value: this.balance
      })
    }
  }
})
</script>

<style scoped>
.user-dashboard {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.balance {
  margin: 20px 0;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.balance p {
  font-size: 24px;
  font-weight: bold;
  color: #42b983;
}

.user-list {
  margin: 20px 0;
}

.user-list ul {
  list-style: none;
  padding: 0;
}

.user-list li {
  padding: 8px;
  border-bottom: 1px solid #eee;
}

button {
  margin-top: 15px;
  padding: 10px 15px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #3aa876;
}
</style>
```

#### 4. 主应用文件

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import GlobalPropertiesPlugin from './plugins/globalProperties'

const app = createApp(App)

// 安装全局属性插件
app.use(GlobalPropertiesPlugin)

app.mount('#app')
```

### 高级用法

#### 1. 结合环境变量

```typescript
declare module 'vue' {
  interface ComponentCustomProperties {
    $env: {
      API_BASE: string
      DEBUG: boolean
    }
  }
}
```

#### 2. 添加全局工具类

```typescript
declare module 'vue' {
  interface ComponentCustomProperties {
    $validator: {
      isEmail: (value: string) => boolean
      isPhone: (value: string) => boolean
    }
  }
}
```

#### 3. 与组合式API结合

```typescript
import { getCurrentInstance } from 'vue'

export function useApi() {
  const instance = getCurrentInstance()
  if (!instance) {
    throw new Error('useApi must be called within a setup function')
  }
  return instance.appContext.config.globalProperties.$api
}
```

### 注意事项

1. **类型定义位置**：必须在 `.d.ts` 文件中声明
2. **命名冲突**：避免与现有属性名冲突
3. **插件安装顺序**：确保在创建应用后安装插件
4. **null检查**：使用 getCurrentInstance() 时注意可能为 null
5. **测试环境**：在测试中可能需要模拟全局属性

### 通俗易懂的总结

`ComponentCustomProperties` 就像是给 Vue 组件实例添加一个"扩展工具箱"：

1. **工具箱的声明**：我们首先声明工具箱里有什么工具（类型定义）
2. **放入实际工具**：通过插件将实际功能添加到所有组件
3. **随处使用**：在任何组件中都可以使用这些工具，并有类型提示

就像给每个工人（组件）都配发了一套标准工具（全局属性），而且每个工具都有说明书（类型定义），工人可以安全高效地使用这些工具。

### 最佳实践建议

1. **集中管理类型扩展**：在专门的 `.d.ts` 文件中定义
2. **命名前缀**：自定义属性使用 `$` 前缀避免冲突
3. **适度使用**：只添加真正全局需要的属性和方法
4. **文档说明**：为自定义属性提供使用文档
5. **测试覆盖**：确保自定义属性在各种场景下工作正常
   
## Vue中的类型工具 ComponentCustomProps 详解

### 什么是 ComponentCustomProps

`ComponentCustomProps` 是 Vue 3 中用于扩展组件 props 类型声明的工具类型。它允许我们为组件声明全局可用的自定义 props 类型，特别适合在大型项目中定义跨组件共享的 props 类型。

### 为什么需要 ComponentCustomProps

在复杂项目中，我们经常遇到：
1. 多个组件需要共享相同的 props 类型
2. 需要为内置组件扩展额外的 props
3. 希望保持跨组件 props 类型的一致性
4. 需要为第三方组件添加类型支持

### 基本类型扩展方式

```typescript
import { ComponentCustomProps } from 'vue'

declare module 'vue' {
  interface ComponentCustomProps {
    // 扩展自定义 props
    'custom-data'?: unknown
    'disable-animation'?: boolean
  }
}
```

### 完整可运行示例

#### 1. 首先定义全局 props 类型扩展

```typescript
// types/vue.d.ts
import { ComponentCustomProps } from 'vue'

declare module 'vue' {
  interface ComponentCustomProps {
    // 通用加载状态
    'loading'?: boolean
    
    // 通用过渡效果
    'transition-duration'?: number
    
    // 数据追踪属性
    'track-id'?: string | number
    
    // 主题相关
    'theme'?: 'light' | 'dark' | 'system'
  }
}
```

#### 2. 创建使用这些自定义 props 的组件

```vue
<template>
  <div 
    class="smart-button"
    :class="[
      `theme-${theme}`,
      { 'is-loading': loading }
    ]"
    :data-track-id="trackId"
    @click="handleClick"
  >
    <span class="content">
      <slot />
    </span>
    
    <div v-if="loading" class="loader" />
    
    <transition name="fade">
      <div 
        v-if="activeRipple" 
        class="ripple" 
        :style="rippleStyle"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  name: 'SmartButton',
  
  props: {
    // 使用全局自定义 props
    loading: Boolean,
    theme: {
      type: String as () => 'light' | 'dark' | 'system',
      default: 'light'
    },
    trackId: [String, Number],
    transitionDuration: Number,
    
    // 组件自有 props
    ripple: {
      type: Boolean,
      default: true
    }
  },
  
  setup(props) {
    const activeRipple = ref(false)
    const ripplePosition = ref({ x: 0, y: 0 })
    
    const rippleStyle = computed(() => ({
      '--x': `${ripplePosition.value.x}px`,
      '--y': `${ripplePosition.value.y}px`,
      '--duration': props.transitionDuration 
        ? `${props.transitionDuration}ms` 
        : '600ms'
    }))
    
    const handleClick = (e: MouseEvent) => {
      if (props.ripple) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
        ripplePosition.value = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        }
        activeRipple.value = true
        setTimeout(() => {
          activeRipple.value = false
        }, props.transitionDuration || 600)
      }
    }
    
    return {
      activeRipple,
      rippleStyle,
      handleClick
    }
  }
})
</script>

<style scoped>
.smart-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;
  transition: background-color 0.3s;
}

.smart-button.theme-light {
  background-color: #f0f0f0;
  color: #333;
}

.smart-button.theme-dark {
  background-color: #333;
  color: #fff;
}

.smart-button.theme-system {
  background-color: var(--system-bg);
  color: var(--system-text);
}

.smart-button.is-loading {
  cursor: progress;
}

.content {
  position: relative;
  z-index: 1;
}

.loader {
  margin-left: 8px;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(0,0,0,0.2);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.ripple {
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: rgba(255,255,255,0.5);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  opacity: 1;
  left: var(--x);
  top: var(--y);
  animation: ripple var(--duration) ease-out;
}

@keyframes ripple {
  to {
    transform: translate(-50%, -50%) scale(10);
    opacity: 0;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--duration);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

#### 3. 在父组件中使用

```vue
<template>
  <div class="app">
    <h1>Global Props Demo</h1>
    
    <div class="controls">
      <label>
        <input type="checkbox" v-model="isLoading"> Loading
      </label>
      
      <select v-model="selectedTheme">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </div>
    
    <SmartButton
      :loading="isLoading"
      :theme="selectedTheme"
      :track-id="buttonTrackId"
      :transition-duration="500"
      @click="handleButtonClick"
    >
      Click Me
    </SmartButton>
    
    <p>Last event: {{ lastEvent }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import SmartButton from './components/SmartButton.vue'

export default defineComponent({
  name: 'App',
  
  components: {
    SmartButton
  },
  
  setup() {
    const isLoading = ref(false)
    const selectedTheme = ref<'light' | 'dark' | 'system'>('light')
    const buttonTrackId = ref('btn_primary')
    const lastEvent = ref('')
    
    const handleButtonClick = () => {
      lastEvent.value = `Button clicked at ${new Date().toLocaleTimeString()}`
      console.log('Track ID:', buttonTrackId.value)
    }
    
    return {
      isLoading,
      selectedTheme,
      buttonTrackId,
      lastEvent,
      handleButtonClick
    }
  }
})
</script>

<style>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.controls {
  margin: 20px 0;
  display: flex;
  gap: 15px;
  align-items: center;
}

select {
  padding: 5px;
}
</style>
```

### 高级用法

#### 1. 为内置组件扩展 props

```typescript
declare module 'vue' {
  interface ComponentCustomProps {
    // 为所有组件添加 tooltip 属性
    'tooltip'?: string
    'tooltip-position'?: 'top' | 'right' | 'bottom' | 'left'
  }
}
```

#### 2. 结合第三方组件类型

```typescript
import { ButtonProps } from 'some-ui-library'

declare module 'vue' {
  interface ComponentCustomProps {
    // 扩展第三方组件 props
    'custom-button-props'?: Partial<ButtonProps>
  }
}
```

#### 3. 创建全局验证规则

```typescript
declare module 'vue' {
  interface ComponentCustomProps {
    'validation-rules'?: {
      required?: boolean
      minLength?: number
      maxLength?: number
      pattern?: RegExp
    }
  }
}
```

### 注意事项

1. **类型定义位置**：必须在 `.d.ts` 文件中声明
2. **命名冲突**：避免与现有 props 名称冲突
3. **适度使用**：只添加真正全局需要的 props
4. **文档说明**：为自定义全局 props 提供文档
5. **版本兼容**：需要 Vue 3.2+

### 通俗易懂的总结

`ComponentCustomProps` 就像是 Vue 应用的"全局属性规则书"：

1. **定义规则**：在规则书中声明哪些属性可以被所有组件使用
2. **随处可用**：任何组件都可以使用这些预定义的属性
3. **类型安全**：使用这些属性时会有完整的类型提示

就像公司制定了一套所有部门都必须遵守的标准规范（全局 props），各个团队（组件）可以直接使用这些标准而无需重复定义。

### 最佳实践建议

1. **集中管理**：在专门的类型声明文件中定义
2. **命名清晰**：使用语义化明确的 prop 名称
3. **文档完善**：为每个全局 prop 添加文档注释
4. **类型精确**：尽量使用精确类型而非 any 或 unknown
5. **渐进采用**：从少量关键 props 开始，逐步扩展

## Vue中的类型工具 CSSProperties 详解

### 什么是 CSSProperties

`CSSProperties` 是 Vue 3 中用于定义内联样式对象类型的工具类型。它实际上是基于 TypeScript 的 `React.CSSProperties` 类型，提供了完整的 CSS 属性类型定义，用于在 Vue 组件中类型安全地使用样式对象。

### 为什么需要 CSSProperties

在 Vue 开发中使用内联样式时，我们经常遇到：
1. 需要确保 CSS 属性名拼写正确
2. 需要验证 CSS 属性值的类型
3. 需要自动补全 CSS 属性
4. 需要避免使用无效的 CSS 属性组合

### 基本用法

```typescript
import { CSSProperties } from 'vue'

const style: CSSProperties = {
  color: 'red',
  fontSize: '16px',
  // 错误示例: 会提示类型错误
  // fontsize: '16px' // 正确应为 fontSize
}
```

### 完整可运行示例

#### 1. 基础样式对象使用

```vue
<template>
  <div :style="baseStyles">基础样式示例</div>
</template>

<script lang="ts">
import { defineComponent, CSSProperties } from 'vue'

export default defineComponent({
  setup() {
    const baseStyles: CSSProperties = {
      padding: '20px',
      backgroundColor: '#f0f0f0',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '18px',
      transition: 'all 0.3s ease'
    }

    return {
      baseStyles
    }
  }
})
</script>
```

#### 2. 动态响应式样式

```vue
<template>
  <div 
    class="interactive-box"
    :style="boxStyles"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    交互式盒子 ({{ isHovered ? '悬停中' : '正常' }})
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, CSSProperties } from 'vue'

export default defineComponent({
  setup() {
    const isHovered = ref(false)
    
    const boxStyles = computed<CSSProperties>(() => ({
      width: '200px',
      height: '200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isHovered.value ? '#42b983' : '#35495e',
      color: 'white',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      transform: isHovered.value ? 'scale(1.05)' : 'scale(1)',
      boxShadow: isHovered.value 
        ? '0 4px 20px rgba(66, 185, 131, 0.3)' 
        : '0 2px 10px rgba(0, 0, 0, 0.1)'
    }))
    
    const handleMouseEnter = () => {
      isHovered.value = true
    }
    
    const handleMouseLeave = () => {
      isHovered.value = false
    }
    
    return {
      isHovered,
      boxStyles,
      handleMouseEnter,
      handleMouseLeave
    }
  }
})
</script>
```

#### 3. 样式组合与继承

```vue
<template>
  <div>
    <h3 :style="titleStyles">样式组合示例</h3>
    
    <div 
      v-for="(item, index) in items" 
      :key="index"
      :style="[baseItemStyles, getItemStyle(index)]"
    >
      项目 {{ index + 1 }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, CSSProperties } from 'vue'

export default defineComponent({
  setup() {
    const titleStyles: CSSProperties = {
      color: '#42b983',
      marginBottom: '20px',
      textDecoration: 'underline'
    }
    
    const baseItemStyles: CSSProperties = {
      padding: '10px 15px',
      marginBottom: '10px',
      borderRadius: '4px',
      transition: 'all 0.2s'
    }
    
    const items = Array(5).fill(null)
    
    const getItemStyle = (index: number): CSSProperties => {
      const colors = ['#f0f0f0', '#e1e1e1', '#d2d2d2', '#c3c3c3', '#b4b4b4']
      return {
        backgroundColor: colors[index % colors.length],
        ':hover': {
          backgroundColor: '#42b983',
          color: 'white',
          transform: 'translateX(5px)'
        }
      }
    }
    
    return {
      titleStyles,
      baseItemStyles,
      items,
      getItemStyle
    }
  }
})
</script>
```

### 高级用法

#### 1. 响应式样式与计算属性

```typescript
const progress = ref(0)
const progressStyle = computed<CSSProperties>(() => ({
  width: `${progress.value}%`,
  backgroundColor: progress.value < 30 
    ? '#ff4d4f' 
    : progress.value < 70 
      ? '#faad14' 
      : '#52c41a'
}))
```

#### 2. 样式工厂函数

```typescript
function createButtonStyle(variant: 'primary' | 'danger' | 'default'): CSSProperties {
  const base: CSSProperties = {
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer'
  }
  
  switch (variant) {
    case 'primary':
      return {
        ...base,
        backgroundColor: '#1890ff',
        color: 'white'
      }
    case 'danger':
      return {
        ...base,
        backgroundColor: '#ff4d4f',
        color: 'white'
      }
    default:
      return {
        ...base,
        backgroundColor: '#f0f0f0',
        color: '#333'
      }
  }
}
```

#### 3. 样式类型扩展

```typescript
declare module 'vue' {
  interface CSSProperties {
    // 添加 CSS 变量支持
    '--custom-color'?: string
    '--custom-size'?: string
  }
}
```

### 注意事项

1. **自动前缀**：Vue 会自动为需要浏览器前缀的属性添加前缀
2. **性能考虑**：复杂样式对象应考虑使用 CSS 类替代
3. **优先级**：内联样式优先级高于 CSS 类
4. **响应式更新**：样式对象是响应式的，但应避免频繁更新
5. **CSS 变量**：可以通过 CSSProperties 使用 CSS 变量

### 通俗易懂的总结

`CSSProperties` 就像是 Vue 组件样式的"类型安全防护罩"：

1. **智能提示**：输入样式属性时自动补全
2. **错误预防**：阻止你使用无效的 CSS 属性或值
3. **结构清晰**：保持样式对象的结构化组织
4. **动态能力**：完美支持响应式样式变化

就像有一个 CSS 专家在旁边指导你写样式，确保你不会犯低级错误，同时让你的样式代码更加专业可靠。

### 最佳实践建议

1. **简单样式**：简单静态样式使用内联样式对象
2. **复杂样式**：复杂样式使用 CSS 类
3. **动态样式**：动态变化样式使用计算属性
4. **重用样式**：提取通用样式为工厂函数
5. **类型扩展**：必要时扩展 CSSProperties 类型
