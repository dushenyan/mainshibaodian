# 在 `<script>` 标签中直接使用 `export` 报错的原因

## 问题现象

当你在 HTML 文件中这样写时：

```html
<script>
  export const foo = 'bar';  // 报错：Uncaught SyntaxError: Unexpected token 'export'
</script>
```

浏览器会抛出语法错误，因为这种写法不符合 JavaScript 模块的规范。

## 根本原因

### 1. 模块系统差异

浏览器中的 `<script>` 标签默认运行在**传统脚本模式**下，而不是**模块模式**。在传统脚本模式下：

- 不支持 `export` 和 `import` 语法
- 所有变量默认是全局的
- 没有模块作用域的概念

### 2. 模块标识缺失

即使你使用了 `export`，浏览器也不知道这个脚本应该被当作模块处理，缺少模块系统的关键标识。

## 正确使用方法

### 方法一：添加 `type="module"` 属性

```html
<script type="module">
  // 现在可以正常使用 export
  export const foo = 'bar';
  
  // 也可以使用 import
  import { something } from './some-module.js';
</script>
```

**关键点**：
- `type="module"` 告诉浏览器这是一个 ES 模块
- 模块会自动启用严格模式
- 变量不会污染全局作用域
- 支持顶级 `await`

### 方法二：使用外部模块文件

```html
<script type="module" src="my-module.js"></script>
```

在 `my-module.js` 中：

```javascript
// 可以正常使用 export
export const foo = 'bar';
```

## 常见问题解答

### 1. 为什么浏览器不默认支持模块？

- 历史兼容性考虑：大量旧代码依赖传统脚本行为
- 渐进增强：模块是后来加入的 ECMAScript 标准

### 2. 模块脚本与传统脚本的区别

| 特性 | 传统脚本 | 模块脚本 |
|------|---------|---------|
| `export/import` | ❌ 不支持 | ✅ 支持 |
| 严格模式 | 默认关闭 | 默认启用 |
| 作用域 | 全局 | 模块作用域 |
| 加载方式 | 同步 | 异步 |
| 跨域限制 | 宽松 | 需要 CORS |

### 3. 如何判断当前脚本是否是模块

```javascript
// 在脚本中检测
const isModule = typeof importScripts !== 'undefined' || 
                (document.currentScript && document.currentScript.type === 'module');
```

## 实际应用示例

### 1. 基本模块导出

```html
<script type="module">
  // 导出变量
  export const API_URL = 'https://api.example.com';
  
  // 导出函数
  export function fetchData() {
    return fetch(API_URL);
  }
  
  // 默认导出
  export default {
    version: '1.0'
  };
</script>
```

### 2. 模块导入使用

```html
<script type="module">
  import { fetchData } from './data-module.js';
  
  fetchData().then(data => {
    console.log(data);
  });
</script>
```

### 3. 动态导入

```html
<script type="module">
  // 按需加载模块
  if (someCondition) {
    import('./analytics.js')
      .then(module => {
        module.trackPageView();
      });
  }
</script>
```

## 兼容性处理

### 1. 传统浏览器回退方案

```html
<script type="module" src="module.js"></script>
<script nomodule src="fallback.js"></script>
```

- 支持模块的浏览器会加载 `module.js`
- 不支持模块的浏览器会加载 `fallback.js`

### 2. 构建工具处理

使用 Webpack/Rollup 等工具将模块编译为兼容代码：

```javascript
// 源文件 (ES Modules)
export const foo = 'bar';

// 编译后 (传统脚本)
(window.myModule = window.myModule || {}).foo = 'bar';
```

## 最佳实践建议

1. **明确模块类型**：始终为模块脚本添加 `type="module"`
2. **避免混合模式**：不要在同一个文件中混用模块和非模块代码
3. **注意加载顺序**：模块脚本默认是 defer 的，会按顺序执行
4. **使用构建工具**：复杂项目建议使用打包工具处理模块
5. **考虑兼容性**：为旧浏览器提供 nomodule 回退方案

## 总结

在 `<script>` 标签中直接使用 `export` 报错是因为：

1. **缺少模块声明**：没有 `type="module"` 标识
2. **作用域不匹配**：传统脚本没有模块导出机制
3. **语法环境不同**：模块脚本默认启用严格模式

**正确做法**是：
- 添加 `type="module"` 属性
- 使用外部模块文件
- 通过构建工具转换模块语法

理解这一点对于现代前端开发至关重要，因为模块是代码组织和复用的基础。
