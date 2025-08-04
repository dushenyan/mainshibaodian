# JavaScript 中 `undefined` 和 `ReferenceError: xxx is not defined` 的区别

## 核心区别

|  | `undefined` | `ReferenceError: xxx is not defined` |
|---------|------------|------------------------------------|
| **本质** | 值/原始类型 | 错误类型 |
| **出现场景** | 变量已声明但未赋值 | 尝试访问未声明的标识符 |
| **检测方式** | `typeof x === 'undefined'` | 直接访问会抛出错误 |
| **修复方法** | 给变量赋值 | 声明变量或检查拼写错误 |

## 详细解释

### 1. `undefined`

`undefined` 是 JavaScript 中的一个**原始值**，表示"未定义"的状态。它出现在以下情况：

```javascript
// 情况1：声明但未赋值的变量
let x;
console.log(x); // undefined

// 情况2：访问对象不存在的属性
const obj = {};
console.log(obj.nonExistProp); // undefined

// 情况3：函数没有返回值
function foo() {}
console.log(foo()); // undefined

// 情况4：函数参数未传递
function bar(param) {
  console.log(param);
}
bar(); // undefined
```

**特点**：
- 是一个有效的 JavaScript 值
- `typeof undefined` 返回 `"undefined"`
- 可以安全地进行检测和比较

### 2. `ReferenceError: xxx is not defined`

这是一个**运行时错误**，表示尝试访问一个未声明的标识符：

```javascript
// 尝试访问未声明的变量
console.log(nonExistVar); // ReferenceError: nonExistVar is not defined

// 尝试调用未声明的函数
nonExistFunc(); // ReferenceError: nonExistFunc is not defined
```

**特点**：
- 是一个错误，不是值
- 会中断代码执行
- 表示根本不存在这个标识符
- 通常由拼写错误或未正确导入模块引起

## 检测方法对比

### 检测 `undefined`

```javascript
// 安全检测方式
if (typeof x === 'undefined') {
  console.log('x是undefined');
}

// 不安全方式（如果x未声明会报错）
if (x === undefined) {
  // ...
}
```

### 检测变量是否存在

```javascript
// 检测变量是否声明
try {
  nonExistVar;
  console.log('变量已声明');
} catch (e) {
  if (e instanceof ReferenceError) {
    console.log('变量未声明');
  }
}
```

## 常见混淆场景

### 1. 全局变量 vs 未声明变量

```javascript
// 浏览器环境中
console.log(window.nonExistProp); // undefined (属性访问)
console.log(nonExistVar); // ReferenceError (变量访问)
```

### 2. 函数参数默认值

```javascript
function foo(param) {
  console.log(param); // undefined (当不传参时)
}

function bar(param = 'default') {
  console.log(param); // 'default' (当不传参时)
}
```

### 3. 解构赋值

```javascript
const { nonExistProp } = {};
console.log(nonExistProp); // undefined

const [nonExistItem] = [];
console.log(nonExistItem); // undefined
```

## 实际应用示例

### 1. 安全访问嵌套属性

```javascript
// 不安全的访问方式
// user.address.street 如果address是undefined会报错

// 安全的方式
const street = user && user.address && user.address.street;

// 或使用可选链 (ES2020)
const street = user?.address?.street;
```

### 2. 默认值设置

```javascript
// 函数参数默认值
function greet(name = 'Guest') {
  console.log(`Hello, ${name}!`);
}

// 变量默认值
const config = userConfig || {};
```

### 3. 模块导入检查

```javascript
// 检查模块是否导入
try {
  require('some-module');
} catch (e) {
  if (e.code === 'MODULE_NOT_FOUND') {
    console.log('模块未安装');
  }
}
```

## 通俗易懂的总结

可以把这两种情况比作**找人**的场景：

1. **`undefined`**：
   - 就像你知道某人的存在（声明了变量）
   - 但不知道他具体在哪/是谁（没有赋值）
   - 问："这人是谁？" → "不知道(undefined)"

2. **`ReferenceError`**：
   - 就像你问一个根本不存在的人
   - 系统直接告诉你："没这人！(not defined)"
   - 连"不知道"都谈不上，因为根本不存在这个记录

**实际开发建议**：
- 使用 `typeof` 安全地检查 `undefined`
- 声明变量后再使用
- 使用 lint 工具避免拼写错误
- 可选链操作符 `?.` 可以简化深层属性访问
- 函数参数设置默认值避免 `undefined` 问题
