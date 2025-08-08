
# 改变 this 指向的方法详解

## 可用环境代码

```html
<!DOCTYPE html>
<html>
<head>
  <title>this指向演示</title>
</head>
<body>
  <button id="btn">点击测试</button>
  <script>
    // 这里将放置我们的示例代码
  </script>
</body>
</html>
```

## 回答

面试官您好，我来详细介绍一下 JavaScript 中改变 this 指向的几种核心方法，结合我五年 Vue 开发经验，我会从基础到高级逐步说明。

### 1. call 方法 - 立即调用并改变 this

```javascript
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}

const person = { name: 'Alice' };

// 使用 call 立即调用并改变 this
greet.call(person, 'Hello', '!'); // "Hello, Alice!"
```

**特点**：
- 第一个参数指定 this 值
- 后续参数逐个传递
- 函数会立即执行

### 2. apply 方法 - 数组参数版 call

```javascript
const numbers = [5, 6, 2, 3, 7];

// apply 接收数组作为参数
const max = Math.max.apply(null, numbers);
console.log(max); // 7

// Vue 中常用于合并配置
const baseConfig = { timeout: 1000 };
const userConfig = { retry: 3 };
const merged = Object.assign.apply(null, [{}, baseConfig, userConfig]);
```

**与 call 的区别**：
- 参数以数组形式传递
- 更适合参数数量不确定的场景

### 3. bind 方法 - 永久绑定 this

```javascript
const module = {
  x: 42,
  getX: function() {
    return this.x;
  }
};

const unboundGetX = module.getX;
console.log(unboundGetX()); // undefined (this 指向全局)

const boundGetX = unboundGetX.bind(module);
console.log(boundGetX()); // 42

// Vue 中事件处理器的典型用法
document.getElementById('btn').addEventListener(
  'click', 
  module.getX.bind(module)
);
```

**特点**：
- 返回新函数，原函数不变
- 永久绑定 this 值
- 支持参数预设（柯里化）

### 4. 箭头函数 - 词法作用域绑定

```javascript
const obj = {
  name: 'Vue',
  regular: function() {
    setTimeout(function() {
      console.log(this.name); // undefined (this 丢失)
    }, 100);
  },
  arrow: function() {
    setTimeout(() => {
      console.log(this.name); // "Vue" (继承外层 this)
    }, 100);
  }
};

obj.regular();
obj.arrow();
```

**Vue 中的注意事项**：
- 不要在 methods 中使用箭头函数
- 适合在回调函数中保持 this

### 5. Vue 特殊场景处理

#### 5.1 事件修饰符

```javascript
// @vuesfc
export default {
  methods: {
    handleClick() {
      // 模板中自动绑定 this
      console.log(this); // 组件实例
    }
  }
}
```

```html
<template>
  <button @click="handleClick">Click</button>
</template>
```

#### 5.2 高阶函数

```javascript
// 使用闭包保持 this
function createCallback(vm) {
  return function() {
    console.log(vm === this); // true
  };
}

// Vue 组件中
this.callback = createCallback(this);
```

### 6. 高级应用 - 自动绑定

```javascript
// 装饰器方案
function autobind(target, name, descriptor) {
  const originalMethod = descriptor.value;
  return {
    configurable: true,
    get() {
      return originalMethod.bind(this);
    }
  };
}

class Store {
  @autobind
  getState() {
    return this.state;
  }
}
```

## 通俗易懂的总结

可以把 this 比作"会说话的魔法棒"：

1. **call/apply** 像临时附魔 - 用一次变一次
   - `call`：一个个传参数
   - `apply`：打包成数组传

2. **bind** 像永久附魔 - 变身后一直有效
   - 适合需要长期保持身份的场合

3. **箭头函数** 像遗传魔法 - 天生继承父级能力
   - 但不能随意改变（无法 rebind）

4. **Vue 场景** 有特殊规则：
   - 模板自动帮你绑好魔法
   - 但传出去的方法可能失效

**最佳实践口诀**：
"call/apply 临时用，bind 绑定最牢靠；
箭头函数慎选择，Vue 模板自动保。"

## 完整可运行示例

```html
<!DOCTYPE html>
<html>
<head>
  <title>this指向演示</title>
</head>
<body>
  <button id="btn">点击测试</button>
  <script>
    // 1. call/apply 演示
    function showInfo(role, project) {
      console.log(`${this.name} 是 ${role}, 负责 ${project}`);
    }
    
    const dev = { name: 'Alice' };
    showInfo.call(dev, '前端开发', 'Vue项目');
    showInfo.apply(dev, ['技术主管', 'React迁移']);
    
    // 2. bind 演示
    const boundShow = showInfo.bind(dev);
    document.getElementById('btn').addEventListener('click', function() {
      boundShow('UI设计师', '样式重构');
    });
    
    // 3. 箭头函数对比
    const obj = {
      name: 'Bob',
      regularFunc: function() {
        setTimeout(function() {
          console.log('普通函数:', this.name); // undefined
        }, 500);
      },
      arrowFunc: function() {
        setTimeout(() => {
          console.log('箭头函数:', this.name); // "Bob"
        }, 500);
      }
    };
    
    obj.regularFunc();
    obj.arrowFunc();
  </script>
</body>
</html>
```

这个示例涵盖了主要的 this 控制方法，您可以直接运行查看控制台输出。在实际 Vue 开发中，最常用的是 bind 和箭头函数，但需要特别注意它们的适用场景。
