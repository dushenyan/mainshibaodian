# 判断 JavaScript 运行环境（浏览器 vs Node.js）

## 常用检测方法

### 1. 检测全局对象

```javascript
// 检测是否在浏览器环境中
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

// 检测是否在Node.js环境中
const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
```

### 2. 检测特有API

```javascript
// 浏览器特有API检测
const isBrowser = typeof window === 'object' && 
                 typeof document === 'object' && 
                 typeof navigator === 'object';

// Node.js特有API检测
const isNode = typeof process === 'object' && 
              typeof require === 'function' && 
              typeof module === 'object' && 
              typeof exports === 'object';
```

### 3. 检测模块系统

```javascript
// 检测CommonJS模块系统(Node.js)
const isNode = typeof module !== 'undefined' && module.exports;

// 检测ES模块(浏览器或Node.js)
const isESModule = typeof import !== 'undefined';
```

## 完整检测函数

```javascript
function getRuntimeEnvironment() {
  // 检测浏览器环境
  if (typeof window !== 'undefined' && 
      typeof document !== 'undefined' && 
      typeof navigator !== 'undefined') {
    return 'browser';
  }
  
  // 检测Node.js环境
  if (typeof process !== 'undefined' && 
      process.versions && 
      process.versions.node) {
    return 'node';
  }
  
  // 检测Web Worker环境
  if (typeof importScripts === 'function') {
    return 'webworker';
  }
  
  // 其他环境
  return 'unknown';
}
```

## 使用示例

```javascript
const env = getRuntimeEnvironment();

if (env === 'browser') {
  console.log('运行在浏览器环境中');
  // 浏览器特定代码
} else if (env === 'node') {
  console.log('运行在Node.js环境中');
  // Node.js特定代码
} else {
  console.log('运行在未知环境中');
}
```

## 特殊环境检测

### 1. 检测Electron环境

```javascript
const isElectron = typeof process !== 'undefined' && 
                  process.versions && 
                  process.versions.electron;
```

### 2. 检测React Native环境

```javascript
const isReactNative = typeof navigator !== 'undefined' && 
                     navigator.product === 'ReactNative';
```

### 3. 检测Deno环境

```javascript
const isDeno = typeof Deno !== 'undefined' && 
              typeof Deno.version !== 'undefined' && 
              typeof Deno.version.deno !== 'undefined';
```

## 检测原理说明

1. **浏览器环境特征**：
   - 存在 `window`、`document`、`navigator` 等全局对象
   - 支持DOM API

2. **Node.js环境特征**：
   - 存在 `process` 全局对象
   - `process.versions` 包含Node版本信息
   - 支持CommonJS模块系统

3. **Web Worker环境特征**：
   - 存在 `importScripts` 函数
   - 没有DOM API

## 注意事项

1. **代码优化**：
   - 检测代码应该尽可能简单高效
   - 避免在性能敏感区域频繁检测

2. **兼容性考虑**：
   - 某些环境可能模拟其他环境的特征
   - 特殊运行时(如Deno)可能同时具有Node和浏览器特征

3. **安全考虑**：
   - 不要依赖可被篡改的环境变量
   - 重要环境检测应该使用多个特征交叉验证

## 最佳实践建议

1. **尽早检测环境**：
   - 在代码初始化阶段检测环境
   - 将结果缓存起来避免重复检测

2. **模块化设计**：
   - 根据环境动态加载不同的实现
   - 使用环境抽象层隔离环境相关代码

3. **优雅降级**：
   - 为不支持的环境提供备用方案
   - 明确提示环境不支持的原因

```javascript
// 示例：环境适配器模式
const environment = getRuntimeEnvironment();

const browserAdapter = {
  fetch: window.fetch,
  storage: localStorage
};

const nodeAdapter = {
  fetch: require('node-fetch'),
  storage: {
    getItem: (key) => { /* Node.js实现 */ },
    setItem: (key, value) => { /* Node.js实现 */ }
  }
};

const adapter = environment === 'browser' ? browserAdapter : nodeAdapter;

// 使用适配器
adapter.fetch('https://api.example.com')
  .then(response => response.json())
  .then(data => {
    adapter.storage.setItem('cache', JSON.stringify(data));
  });
```
