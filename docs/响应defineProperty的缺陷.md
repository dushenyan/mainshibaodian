**面试官**：能详细说说 Vue 2 的 `Object.defineProperty` 在响应式实现中有哪些缺陷吗？

**我**（5年经验开发者）：好的，这个问题可以从实际开发中的三个典型场景展开，我用代码示例说明：

---

### **1. 数组变异问题**
```javascript
// 示例：直接通过索引修改数组
const vm = new Vue({
  data: {
    list: ['A', 'B']
  }
})

vm.list[1] = 'X' // 不会触发视图更新！
vm.list.length = 1 // 同样无效
```
**缺陷本质**：  
- `Object.defineProperty` 无法检测数组索引赋值  
- 也无法拦截 `length` 变化  
- Vue 2 的解决方案是重写数组方法：
```javascript
// Vue内部实现的数组劫持
const originalMethods = ['push', 'pop', 'shift']
const arrayMethods = Object.create(Array.prototype)

originalMethods.forEach(method => {
  arrayMethods[method] = function() {
    const result = Array.prototype[method].apply(this, arguments)
    dep.notify() // 手动触发更新
    return result
  }
})
```

---

### **2. 对象属性增删**
```javascript
// 示例：动态添加新属性
const vm = new Vue({
  data: { obj: { a: 1 } }
})

vm.obj.b = 2 // 非响应式！
delete vm.obj.a // 不会触发更新！
```
**解决方案**：  
必须使用 `Vue.set`/`this.$set`：
```javascript
Vue.set(vm.obj, 'b', 2) // 正确写法
```
**底层限制**：  
- `Object.defineProperty` 需要预先定义属性  
- 无法拦截未声明的属性操作  

---

### **3. 性能瓶颈**
```javascript
// 深度监听带来的性能问题
data: {
  deepObj: {
    a: { b: { c: 1 } } // 每层都要递归劫持
  }
}
```
**性能缺陷**：  
1. 初始化时需要深度遍历整个对象  
2. 嵌套层级过深时递归开销大  
3. 不支持惰性监听（用到了才监听）  

**对比 Vue3 的 Proxy**：  
```javascript
// Proxy 可以拦截整个对象
const proxy = new Proxy(data, {
  get(target, key) { /*...*/ },
  set(target, key, val) { /*...*/ },
  deleteProperty(target, key) { /*...*/ }
})
```

---

### **通俗总结（递进式表达）**
1. **"近视眼"问题**：只能看到已经存在的属性（无法检测新增/删除）  
2. **"耳背"问题**：听不到数组的索引变化（必须通过特殊方法沟通）  
3. **"体力差"问题**：深度监听就像扛着所有行李爬山（性能消耗大）  

**生活比喻**：  
- Vue 2 的响应式像老式门卫，必须提前登记才能监视（defineProperty）  
- Vue 3 的 Proxy 像智能摄像头，任何人进出都能自动识别  

（停顿）需要我进一步对比 Proxy 的实现优势吗？
