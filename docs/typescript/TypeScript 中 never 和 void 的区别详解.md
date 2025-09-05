# TypeScript 中 never 和 void 的区别详解

## 开场白

"关于 TypeScript 中 `never` 和 `void` 的区别，这是类型系统中两个容易混淆但非常重要的概念。让我结合五年 TypeScript 开发经验，从实际应用角度为您详细解析。"

## 核心回答

### 1. void 类型 - 表示"没有返回值"

"`void` 用于表示函数没有返回值或返回值为 undefined："

```typescript
// @环境: TypeScript 4.0+
// 显式声明void返回类型
function greet(name: string): void {
  console.log(`Hello, ${name}`);
  // 没有return语句
}

// 等价于返回undefined
function logError(message: string): void {
  console.error(message);
  return undefined; // 允许但不推荐
}

// 变量声明
let unusable: void = undefined;
// unusable = null; // 严格模式下会报错
```

"关键点：
- 函数默认返回类型
- 可以显式返回 `undefined`
- 变量只能赋值为 `undefined`（严格模式下）"

### 2. never 类型 - 表示"永远不会到达"

"`never` 表示永远不会发生的值或函数永远不会完成执行："

```typescript
// 抛出错误的函数
function throwError(message: string): never {
  throw new Error(message);
  // 后续代码永远不会执行
}

// 无限循环
function infiniteLoop(): never {
  while (true) {
    // 永不结束
  }
}

// 类型收窄后的不可能分支
type Shape = { kind: "circle"; radius: number } | { kind: "square"; size: number };

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.size ** 2;
    default:
      // 这里shape被收窄为never
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```

"关键点：
- 表示不可达的代码路径
- 用于彻底的类型检查
- 变量不能赋任何值（除了never本身）"

### 3. 两者对比

```typescript
// 返回值对比
function testVoid(): void {
  // 可以没有return
}
const v: void = testVoid(); // 允许

function testNever(): never {
  throw new Error();
}
const n: never = testNever(); // 理论上可行，但实际上无法赋值

// 类型系统行为
declare const someValue: void;
// someValue = 123; // 错误

declare const impossible: never;
// impossible = 123; // 错误（任何赋值都会报错）
```

## 可运行完整示例

```typescript
// @环境: TypeScript 4.0+
// 完整示例可直接在TypeScript Playground运行

// 实际应用场景演示
class ApiClient {
  // void示例 - 日志记录
  logRequest(url: string): void {
    console.log(`请求: ${url}`);
    // 无返回值
  }

  // never示例 - 错误处理
  handleFatalError(error: Error): never {
    console.error('致命错误:', error);
    process.exit(1);
    // 函数不会正常返回
  }

  // 类型保护中的never
  processResponse(response: string | number) {
    if (typeof response === 'string') {
      return response.toUpperCase();
    } else if (typeof response === 'number') {
      return response.toFixed(2);
    } else {
      // 类型收窄到never
      const check: never = response;
      throw new Error(`未知响应类型: ${check}`);
    }
  }
}

// 使用示例
const client = new ApiClient();
client.logRequest('/api/users'); // void函数调用

try {
  // client.handleFatalError(new Error('系统崩溃')); // 实际会终止进程
} catch (e) {
  console.log('捕获到never函数抛出的错误');
}

// 联合类型测试
console.log(client.processResponse("hello")); // "HELLO"
console.log(client.processResponse(3.14159)); // "3.14"
// console.log(client.processResponse(true)); // 类型错误
```

## 通俗易懂的总结

"理解 `void` 和 `never` 的区别，可以类比生活中的场景：

1. **void 就像普通发言**：
   - 说完话就结束（不返回有意义的值）
   - 相当于"我说完了"（undefined）
   - 常见于日志记录、通知类函数

2. **never 就像极端情况**：
   - 要么是崩溃报警（抛出错误）
   - 要么是永不停止的机器（无限循环）
   - 或者是理论上不可能到达的地方（类型收窄）

**开发中的黄金法则**：
- 当函数可能正常结束时 → 用 `void`
- 当函数绝对不会正常返回时 → 用 `never`
- 类型收窄时用 `never` 确保全覆盖检查

在我的项目中，`never` 类型特别有用：
1. 在 Redux reducer 中确保处理所有 action 类型
2. 在错误处理中标记不可恢复的错误
3. 在类型系统中实现穷尽检查（exhaustive check）"

"掌握这两者的区别，可以帮助我们写出更类型安全的代码，特别是在复杂类型系统和错误处理场景中。这也是 TypeScript 类型系统比 JavaScript 更强大的体现之一。"
