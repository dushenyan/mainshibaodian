---
tags: ['JavaScript', '模块化', '方案', '演进', '历程', 'CommonJS', 'AMD', 'CMD']
---

# JavaScript 模块化方案详解

## 开场白

"关于 JavaScript 模块化方案，这是现代前端工程化的重要基础。让我结合五年开发经验，从演进历程到实际应用为您系统讲解。"

## 一、模块化演进历程

### 1. 无模块化时代（全局污染）

```javascript
// @环境: 早期浏览器
// a.js
var name = 'moduleA';
function sayHello() {
    console.log('Hello from A');
}

// b.js
var name = 'moduleB'; // 命名冲突！
function sayHello() {  // 函数覆盖！
    console.log('Hello from B');
}

// index.html
<script src="a.js"></script>
<script src="b.js"></script>
<script>
    sayHello(); // 输出取决于加载顺序
</script>
```

**问题**：
- 全局命名空间污染
- 依赖关系不明确
- 加载顺序敏感

## 二、主流模块化方案

### 2. CommonJS (Node.js 标准)

```javascript
// @环境: Node.js
// math.js
const add = (a, b) => a + b;
module.exports = { add };

// app.js
const { add } = require('./math');
console.log(add(2, 3)); // 5
```

**特点**：
- 同步加载（适合服务端）
- `module.exports` 导出
- `require` 导入
- 每个文件是一个模块

### 3. AMD (异步模块定义)

```javascript
// @环境: RequireJS
// 配置
require.config({
    paths: {
        'jquery': 'lib/jquery'
    }
});

// 定义模块
define('moduleA', ['jquery'], function($) {
    const name = 'A';
    return { name };
});

// 使用模块
require(['moduleA'], function(moduleA) {
    console.log(moduleA.name);
});
```

**特点**：
- 异步加载（适合浏览器）
- 前置声明依赖
- 推崇依赖提前执行

### 4. CMD (通用模块定义)

```javascript
// @环境: Sea.js
// 定义模块
define(function(require, exports, module) {
    const $ = require('jquery'); // 就近依赖
    const name = 'C';
    exports.show = () => console.log(name);
});

// 使用模块
seajs.use(['moduleC'], function(moduleC) {
    moduleC.show();
});
```

**特点**：
- 异步加载
- 就近依赖（运行时加载）
- 推崇依赖延迟执行

### 5. ES Module (ECMAScript 标准)

```javascript
// @环境: 现代浏览器/Node.js (v12+)
// math.mjs
export const add = (a, b) => a + b;
export default function multiply(a, b) {
    return a * b;
}

// app.mjs
import { add } from './math.mjs';
import multiply from './math.mjs';

console.log(add(2, 3));      // 5
console.log(multiply(2, 3));  // 6
```

**特点**：
- 静态导入/导出（编译时解析）
- 浏览器原生支持
- 支持动态导入 `import()`
- 严格模式默认启用

## 三、方案对比分析

| 特性          | CommonJS       | AMD            | CMD            | ES Module      |
|---------------|---------------|----------------|----------------|----------------|
| **加载方式**   | 同步           | 异步            | 异步            | 静态/动态       |
| **适用环境**   | Node.js        | 浏览器          | 浏览器          | 通用            |
| **依赖时机**   | 运行时加载      | 前置声明        | 就近依赖        | 编译时解析      |
| **输出方式**   | `module.exports` | return        | exports        | export         |
| **输入方式**   | require        | define/require | define/require | import         |
| **静态分析**   | 不支持          | 不支持          | 不支持          | 支持            |
| **循环依赖**   | 支持            | 支持            | 支持            | 支持            |

## 四、现代工程实践

### 1. 浏览器环境

```html
<!-- type="module" 启用ESM -->
<script type="module">
    import { render } from './app.js';
    render();
</script>

<!-- 兼容旧浏览器 -->
<script nomodule src="legacy-bundle.js"></script>
```

### 2. Node.js 双模式支持

```javascript
// package.json
{
    "type": "module", // 默认ESM
    "exports": {
        "import": "./esm/index.js",
        "require": "./cjs/index.cjs"
    }
}
```

### 3. 动态导入

```javascript
// 按需加载
button.addEventListener('click', async () => {
    const { showDialog } = await import('./dialog.js');
    showDialog();
});
```

## 五、完整示例演示

### CommonJS (Node.js)

```javascript
// logger.js
const logLevels = ['error', 'warn', 'info'];

module.exports = {
    log: (level, message) => {
        if (logLevels.includes(level)) {
            consolemessage;
        }
    },
    DEFAULT_LEVEL: 'info'
};

// app.js
const { log, DEFAULT_LEVEL } = require('./logger');
log(DEFAULT_LEVEL, 'App started');
```

### AMD (RequireJS)

```javascript
// main.js
require.config({
    paths: {
        'jquery': 'https://code.jquery.com/jquery-3.6.0.min'
    }
});

require(['jquery'], function($) {
    $('#app').html('<h1>AMD Module Loaded</h1>');
});
```

### ES Module (浏览器)

```html
<!-- index.html -->
<script type="module">
    import { createApp } from './app.js';
    createApp(document.getElementById('app'));
</script>

<!-- app.js -->
export function createApp(container) {
    container.innerHTML = '<h1>ES Module Works!</h1>';
}
```

## 六、通俗易懂的总结

"理解模块化就像城市规划：

1. **无模块化**：杂乱的棚户区
   - 各种设施（代码）随意堆放
   - 道路（依赖）纠缠不清

2. **CommonJS**：Node.js的市政系统
   - 同步建设（适合服务器）
   - 每个街区（文件）自成体系

3. **AMD**：紧急建设的开发区
   - 先规划再建设（前置依赖）
   - 适合急需解决的浏览器加载问题

4. **CMD**：灵活的新城区
   - 随用随建（就近依赖）
   - 更自然的开发体验

5. **ES Module**：现代智慧城市
   - 统一规划标准（ECMA标准）
   - 立体交通（静态分析+动态导入）
   - 未来发展方向

**开发口诀**：
'浏览器用ESM，Node看版本；
旧项目兼容AMD，新项目统一标准；
静态分析优性能，动态导入按需行。'

在现代项目中：
- 新项目首选 ES Module
- 库开发应提供多格式输出
- 动态导入优化首屏性能
- 类型系统与模块系统结合（TypeScript）"
