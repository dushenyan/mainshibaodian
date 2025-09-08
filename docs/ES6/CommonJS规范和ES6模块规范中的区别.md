---
tags: ['CommonJS', 'ES6', '模块规范', '区别']

---

## CommonJS 规范和 ES6 模块规范的区别

CommonJS 规范和 ES6 模块（ESM）规范是 JavaScript 中两种主要的模块系统，它们在设计目标、语法、加载机制等方面有显著区别，主要差异如下：

### 1. **语法不同**
- **CommonJS**：  
  使用 `require()` 导入模块，`module.exports` 或 `exports` 导出模块。  
  ```javascript
  // 导出
  module.exports = { foo: 'bar' };
  // 或
  exports.foo = 'bar';

  // 导入
  const module = require('./module.js');
  ```

- **ES6 模块**：  
  使用 `import` 导入模块，`export` 或 `export default` 导出模块。  
  ```javascript
  // 导出
  export const foo = 'bar';
  // 或默认导出
  export default { foo: 'bar' };

  // 导入
  import { foo } from './module.js';
  // 或导入默认值
  import module from './module.js';
  ```


### 2. **加载机制不同**
- **CommonJS**：  
  - **运行时加载**：模块加载发生在代码执行阶段，`require()` 是一个函数，可在条件语句（如 `if`）中动态调用。  
  - **值拷贝**：导入的是模块导出值的**拷贝**，若原模块后续修改了导出值，导入方不会同步更新（对象类型除外，因拷贝的是引用）。  
  ```javascript
  // module.js
  let count = 1;
  module.exports = { count, add: () => count++ };

  // main.js
  const m = require('./module.js');
  m.add(); 
  console.log(m.count); // 输出 1（拷贝的原始值未更新）
  ```

- **ES6 模块**：  
  - **编译时加载**：模块加载在代码解析阶段（编译时）完成，`import` 语句必须放在模块顶层，不能在条件语句中使用。  
  - **动态绑定**：导入的是模块导出值的**引用**，原模块更新导出值后，导入方可同步获取最新值。  
  ```javascript
  // module.js
  export let count = 1;
  export const add = () => count++;

  // main.js
  import { count, add } from './module.js';
  add();
  console.log(count); // 输出 2（引用同步更新）
  ```


### 3. **适用环境不同**
- **CommonJS**：  
  主要为 **Node.js 服务端**设计，适配文件系统和同步加载场景，模块路径解析基于本地文件系统。

- **ES6 模块**：  
  是 **浏览器和 Node.js 通用**的官方标准，浏览器中通过 `<script type="module">` 启用，Node.js 中需使用 `.mjs` 扩展名或在 `package.json` 中声明 `"type": "module"`。


### 4. **默认导出行为不同**
- **CommonJS**：  
  模块默认导出一个对象（`module.exports`），`exports` 是其引用，不能直接赋值给 `exports`（会断开引用）。  

- **ES6 模块**：  
  支持**命名导出**（多个）和**默认导出**（一个），默认导出可以是任意类型（对象、函数、基本类型等），导入时需对应语法。


### 5. **循环依赖处理不同**
- **CommonJS**：  
  遇到循环依赖时，会返回**已执行部分的导出值**（可能不完整），后续代码执行时再补充完整。

- **ES6 模块**：  
  循环依赖时，通过**动态绑定**保持模块间的引用关系，即使依赖未完全加载，也能访问到已声明的变量（未赋值时为 `undefined`）。


### 总结
| 特性               | CommonJS               | ES6 模块（ESM）          |
|--------------------|------------------------|--------------------------|
| 语法               | `require()`/`exports`  | `import`/`export`        |
| 加载时机           | 运行时                 | 编译时                   |
| 值传递方式         | 拷贝（对象为引用）     | 动态绑定（引用）         |
| 适用环境           | 主要用于 Node.js       | 浏览器和 Node.js 通用    |
| 动态加载           | 支持（`require()` 可动态调用） | 不支持（`import` 需在顶层） |

选择哪种规范取决于运行环境：Node.js 中可兼容两种（默认 CommonJS），浏览器中优先使用 ESM。


## 链接 

[Node.js 如何处理 ES6 模块](https://www.ruanyifeng.com/blog/2020/08/how-nodejs-use-es6-module.html)
