# JavaScript 中多次调用 bind() 的 this 绑定行为

## 可用环境代码

```javascript
const obj1 = { name: 'Object 1' };
const obj2 = { name: 'Object 2' };
const obj3 = { name: 'Object 3' };

function showName() {
  console.log(this.name);
}
```

## 回答

面试官您好，我来详细解释一下多次调用 `bind()` 方法时 `this` 的绑定行为。

### 1. `bind()` 方法的基本特性

`bind()` 方法创建一个新函数，当调用时，其 `this` 值会被绑定到指定的对象：

```javascript
const boundFunc = showName.bind(obj1);
boundFunc(); // 输出: "Object 1"
```

### 2. 多次调用 `bind()` 的情况

当对同一个函数连续多次调用 `bind()` 时，**只有第一次绑定的 `this` 值会生效**：

```javascript
const boundOnce = showName.bind(obj1);
const boundTwice = boundOnce.bind(obj2);
boundTwice(); // 输出: "Object 1" (不是 Object 2)
```

### 3. 深入理解绑定行为

这种行为的原因是 `bind()` 创建的绑定函数内部维护了 `[[BoundThis]]` 内部属性，这个属性在第一次绑定时就被确定，后续的 `bind()` 调用不会改变它。

```javascript
const originalFunc = function() { console.log(this.name); };

// 第一次绑定
const firstBind = originalFunc.bind(obj1);
// firstBind.[[BoundThis]] = obj1

// 第二次绑定
const secondBind = firstBind.bind(obj2);
// secondBind.[[BoundThis]] 仍然是 obj1
```

### 4. 代码验证

让我们用代码验证这一行为：

```javascript
function getThis() {
  return this;
}

const bound1 = getThis.bind(obj1);
console.log(bound1() === obj1); // true

const bound2 = bound1.bind(obj2);
console.log(bound2() === obj1); // true (仍然是 obj1)

const bound3 = bound2.bind(obj3);
console.log(bound3() === obj1); // true (仍然是 obj1)
```

### 5. 完整可运行示例

```html
<!DOCTYPE html>
<html>
<head>
  <title>多次bind()测试</title>
</head>
<body>
  <script>
    const obj1 = { name: 'Object 1' };
    const obj2 = { name: 'Object 2' };
    const obj3 = { name: 'Object 3' };

    function showContext() {
      console.log('当前this:', this);
      console.log('当前this.name:', this.name);
    }

    console.log('=== 原始函数 ===');
    showContext(); // 非严格模式: Window, 严格模式: undefined

    console.log('\n=== 第一次绑定 ===');
    const firstBind = showContext.bind(obj1);
    firstBind(); // Object 1

    console.log('\n=== 第二次绑定 ===');
    const secondBind = firstBind.bind(obj2);
    secondBind(); // 仍然是 Object 1

    console.log('\n=== 第三次绑定 ===');
    const thirdBind = secondBind.bind(obj3);
    thirdBind(); // 仍然是 Object 1

    console.log('\n=== 直接多次绑定 ===');
    const multiBind = showContext.bind(obj1).bind(obj2).bind(obj3);
    multiBind(); // 仍然是 Object 1

    console.log('\n=== 新函数多次绑定 ===');
    function newFunc() {
      console.log('新函数this:', this);
    }
    newFunc.bind(obj1).bind(obj2).bind(obj3)(); // 仍然是 Object 1
  </script>
</body>
</html>
```

## 通俗易懂的总结

可以把 `bind()` 的绑定行为想象成**给信封贴邮票**：

1. **第一次 `bind()`**：就像在信封上贴上写有地址的邮票（确定收件人）
   - 这个地址（`this` 值）已经被固定

2. **后续 `bind()`**：试图再贴新的地址标签
   - 但邮局（JavaScript引擎）只会看最初的那张邮票
   - 后面的标签不会改变邮件的投递目标

**关键点记忆**：
- `bind()` 只有第一次绑定有效
- 后续的 `bind()` 调用不会覆盖之前的 `this` 绑定
- 这种行为是 JavaScript 的固有特性
- 如果需要改变 `this`，应该对原始函数重新绑定，而不是对绑定后的函数再绑定

**实际应用建议**：
- 避免对绑定函数再次绑定
- 如果需要不同的 `this`，从原始函数重新开始绑定
- 理解这种行为有助于避免难以调试的 `this` 相关问题
