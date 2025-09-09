--- 
tags: ['Vue2','Vue3区别','双向绑定','实现原理','手写实现']
title: 'Vue 双向绑定实现'
date: '2023-08-10'
---

# Vue双向绑定实现

以下是手写 Vue 双向绑定的精简实现，包含关键代码和详细注释，帮助您理解其核心原理：

```html index.html
<!DOCTYPE html>
<html>

<head>
  <title>Vue 双向绑定实现</title>
</head>

<body>
  <div id="app">
    <input type="text" v-model="message">
    <p>您输入的内容是：<span id="display">{{ message }}</span></p>
  </div>

  <script>
    // 简易版 Vue 实现
    class MiniVue {
      constructor(options) {
        this.$options = options;
        this.$data = options.data();

        // 1. 数据劫持（响应式处理）
        this.observe(this.$data);

        // 2. 编译模板
        this.compile(document.querySelector(options.el));
      }

      // 数据劫持方法
      observe(data) {
        if (!data || typeof data !== 'object') return;

        Object.keys(data).forEach(key => {
          let value = data[key];
          const dep = new Dep(); // 每个属性一个依赖收集器

          Object.defineProperty(data, key, {
            get() {
              Dep.target && dep.addSub(Dep.target); // 收集依赖
              console.log(`Get 属性 ${key} 的值，当前值为: ${value}`);
              return value;
            },
            set(newVal) {
              if (newVal === value) return;
              console.log(`Set 属性 ${key} 的值，旧值: ${value}，新值: ${newVal}`);
              value = newVal;
              dep.notify(); // 通知更新
              console.log(`属性 ${key} 的值已更新，通知订阅者`);
            }
          });

          // 递归处理嵌套对象
          this.observe(value);
        });
      }

      // 模板编译方法
      compile(node) {
        // 递归遍历 DOM 节点
        [].slice.call(node.childNodes).forEach(child => {
          if (child.nodeType === 3) { // 文本节点
            this.compileText(child);
          } else if (child.nodeType === 1) { // 元素节点
            this.compileElement(child);
            if (child.childNodes.length) {
              this.compile(child); // 递归编译子节点
            }
          }
        });
      }

      // 编译文本节点（处理插值表达式）
      compileText(node) {
        // 处理 {{ }} 插值表达式
        const reg = /\{\{(.*?)\}\}/g;
        const text = node.textContent;
        if (reg.test(text)) {
          const key = RegExp.$1.trim();
          node.textContent = this.$data[key];

          // 创建订阅者
          new Watcher(this.$data, key, (newVal) => {
            node.textContent = newVal;
          });
        }
      }

      // 编译元素节点（处理指令）
      compileElement(node) {
        // 遍历节点 属性
        [].slice.call(node.attributes).forEach(attr => {
          // 处理 v-model 指令
          if (attr.name === 'v-model') {
            const key = attr.value;
            node.value = this.$data[key];

            // 添加事件监听
            node.addEventListener('input', (e) => {
              console.log('e', e.target.value)
              this.$data[key] = e.target.value;
            });

            // 创建订阅者
            new Watcher(this.$data, key, (newVal) => {
              node.value = newVal;
            });
          }
        });
      }
    }

    // 依赖收集器
    class Dep {
      constructor() {
        this.subs = [];
      }

      // 添加订阅者
      addSub(sub) {
        this.subs.push(sub);
      }

      // 通知更新
      notify() {
        this.subs.forEach(sub => sub.update());
      }
    }

    // 订阅者
    class Watcher {
      constructor(data, key, cb) {
        // 收集依赖 方便update时获取新值
        Dep.target = this;
        this.cb = cb;
        this.data = data;
        this.key = key;
        this.value = data[key]; // 触发getter收集依赖
        Dep.target = null;
      }

      update() {
        const newVal = this.data[this.key]
        if (newVal !== this.value) {
          this.value = newVal;
          this.cb(this.value);
        }
      }
    }

    // 使用示例
    new MiniVue({
      el: '#app',
      data() {
        return {
          message: 'Hello Vue!'
        };
      }
    });
  </script>
</body>

</html>
```

### 核心实现解析：

1. **数据劫持 (Observer)**
   - 使用 `Object.defineProperty` 对数据对象进行递归劫持
   - 每个属性都有独立的 `Dep` 依赖收集器
   - 在 getter 中收集依赖，setter 中通知更新

2. **依赖收集 (Dep)**
   ```javascript
   class Dep {
     constructor() { this.subs = [] }
     addSub(sub) { this.subs.push(sub) }
     notify() { this.subs.forEach(sub => sub.update()) }
   }
   ```

3. **订阅者 (Watcher)**
   ```javascript
   class Watcher {
     constructor(data, key, cb) {
       Dep.target = this
       this.value = data[key] // 触发getter
       Dep.target = null
       this.cb = cb
     }

     update() { this.cb(this.value) }
   }
   ```

4. **模板编译**
   - 递归遍历 DOM 节点
   - 处理 `{{ }}` 插值表达式
   - 处理 `v-model` 指令

5. **双向绑定实现**
   ```javascript
   // 数据 -> 视图
   // eslint-disable-next-line no-new
   new Watcher(data, key, (newVal) => {
     node.textContent = newVal // 更新文本
     node.value = newVal // 更新输入框
   })

   // 视图 -> 数据
   node.addEventListener('input', (e) => {
     this.$data[key] = e.target.value
   })
   ```

### 与 Vue3 的区别：
1. Vue3 使用 Proxy 替代 Object.defineProperty
2. Vue3 的响应式系统与渲染器解耦
3. Vue3 采用编译时优化（如静态提升）

这个实现包含了 Vue 双向绑定的核心思想，实际 Vue 源码还包含虚拟 DOM、组件系统等更多复杂功能。
