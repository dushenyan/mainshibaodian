## 面试官: 能详细讲讲 Proxy 和 Object.defineProperty 的区别吗?

作为有5年前端经验的开发者，我在Vue 2和Vue 3的响应式原理实现中都深入使用过这两种技术。我来详细分析它们的区别：

### 1. 基本概念对比

**Object.defineProperty** 是ES5的API，用于直接在一个对象上定义或修改属性：

::: sandbox {template=vanilla showConsole autorun=false}
```js index.js [active]
const obj = {}
let value = 'initial'

Object.defineProperty(obj, 'property', {
  get() {
    console.log('获取值')
    return value
  },
  set(newValue) {
    console.log('设置值:', newValue)
    value = newValue
  }
})

obj.property = 'new value' // 控制台输出: 设置值: new value
console.log(obj.property) // 控制台输出: 获取值 \n new value
```
:::

**Proxy** 是ES6引入的全新特性，可以为对象创建代理：

::: sandbox {template=vanilla autorun=false}
```js index.js [active]
const target = {}
const handler = {
  get(target, prop) {
    console.log(`获取属性 ${prop}`)
    return target[prop]
  },
  set(target, prop, value) {
    console.log(`设置属性 ${prop}: ${value}`)
    target[prop] = value
    return true
  }
}

const proxy = new Proxy(target, handler)
proxy.name = 'John' // 控制台输出: 设置属性 name: John
console.log(proxy.name) // 控制台输出: 获取属性 name \n John
```
:::

### 2. 关键区别分析

#### (1) 拦截能力

**Object.defineProperty**:
- 只能拦截单个属性的读写操作
- 需要预先知道要拦截的属性名
- 无法拦截新增属性（Vue 2需要$set）

::: sandbox {template=vanilla autorun=false}
```js index.js [active]
const obj = {}
Object.defineProperty(obj, 'a', {
  get() { console.log('获取a') },
  set() { console.log('设置a') }
})

obj.a = 1 // 会被拦截
obj.b = 2 // 不会被拦截
```
:::

**Proxy**:
- 可以拦截整个对象的所有操作
- 包括属性读取、设置、删除、in操作符等
- 自动支持新增属性

::: sandbox {template=vanilla autorun=false}
```js index.js [active]
const target = {}
const handler = {
  get(target, prop) {
    console.log(`获取 ${prop}`)
    return target[prop]
  },
  set(target, prop, value) {
    console.log(`设置 ${prop} = ${value}`)
    target[prop] = value
    return true
  },
  deleteProperty(target, prop) {
    console.log(`删除 ${prop}`)
    delete target[prop]
    return true
  }
}

const proxy = new Proxy(target, handler)
proxy.a = 1 // 设置 a = 1
proxy.b = 2 // 设置 b = 2
delete proxy.a // 删除 a
console.log('b' in proxy) // 检查属性存在
```
:::

#### (2) 数组处理

**Object.defineProperty** 对数组的支持有限：

::: sandbox {template=vanilla autorun=false}
```js index.js [active]
const arr = []
Object.defineProperty(arr, '0', {
  get() { console.log('获取0') },
  set() { console.log('设置0') }
})

arr[0] = 1 // 会被拦截
arr.push(2) // push操作不会被拦截
```
:::

**Proxy** 可以完美拦截数组操作：

::: sandbox {template=vanilla autorun=false}
```js index.js [active]
const arr = []
const handler = {
  get(target, prop) {
    console.log(`获取 ${prop}`)
    return Reflect.get(target, prop)
  },
  set(target, prop, value) {
    console.log(`设置 ${prop} = ${value}`)
    return Reflect.set(target, prop, value)
  }
}

const proxy = new Proxy(arr, handler)
proxy.push(1) // 会触发多次get/set
proxy[0] = 2 // 设置 0 = 2
proxy.length = 0 // 设置 length = 0
```
:::

#### (3) 性能对比

Proxy的性能通常更好，特别是在处理大型对象或频繁操作时，因为：
- Proxy不需要递归遍历对象所有属性
- Proxy的拦截是动态的，不需要初始化时定义所有拦截

### 3. 实际应用场景

**Vue 2** 使用 Object.defineProperty 实现响应式：

::: sandbox {template=vanilla}
```js index.js [active]
function reactive(obj) {
  Object.keys(obj).forEach((key) => {
    let value = obj[key]
    Object.defineProperty(obj, key, {
      get() {
        console.log(`获取 ${key}`)
        return value
      },
      set(newValue) {
        console.log(`设置 ${key} = ${newValue}`)
        value = newValue
      }
    })
  })
  return obj
}

const data = reactive({ count: 0 })
data.count++ // 获取 count \n 设置 count = 1
```
:::

**Vue 3** 改用 Proxy 实现响应式：

::: sandbox {template=vanilla}
```js index.js [active]
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      console.log(`获取 ${key}`)
      return Reflect.get(target, key)
    },
    set(target, key, value) {
      console.log(`设置 ${key} = ${value}`)
      return Reflect.set(target, key, value)
    }
  })
}

const data = reactive({ count: 0 })
data.count++ // 获取 count \n 设置 count = 1
data.newProp = 'test' // 设置 newProp = test
```
:::

## 总结

Proxy 和 Object.defineProperty 的主要区别可以归纳为：

1. **拦截范围**：
   - defineProperty 只能拦截已知属性的读写
   - Proxy 可以拦截对象的所有操作（包括新增属性、删除属性等）

2. **数组处理**：
   - defineProperty 对数组方法支持有限
   - Proxy 可以完美拦截数组所有操作

3. **性能表现**：
   - Proxy 通常性能更好，特别是在处理大型对象时
   - defineProperty 需要初始化时遍历对象所有属性

4. **兼容性**：
   - defineProperty 兼容性更好（支持到IE9）
   - Proxy 是ES6特性（不支持IE）

在实际项目中，Vue 3选择Proxy作为响应式基础是因为它提供了更全面的拦截能力，能更好地处理动态新增属性、数组变化等场景，这也是现代前端框架的发展趋势。
