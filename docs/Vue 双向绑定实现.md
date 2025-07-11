# Vue双向绑定实现

::: sandbox {template=static}
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
:::
