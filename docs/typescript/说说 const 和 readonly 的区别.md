# TypeScript 中 `const` 与 `readonly` 的区别

## 核心区别概述

| 特性 | `const` | `readonly` |
|------|--------|-----------|
| **作用对象** | 变量 | 属性/索引签名 |
| **作用阶段** | 运行时 | 编译时 |
| **可重新赋值** | ❌ | ❌ (但对象属性可修改) |
| **对象可变性** | 对象属性可修改 | 对象属性不可修改 |
| **数组可变性** | 数组元素可修改 | 数组元素不可修改 |
| **使用场景** | 基本类型/引用 | 类/接口/类型属性 |

## 详细解释

### 1. `const` - 变量声明

`const` 是 JavaScript 和 TypeScript 共有的关键字，用于声明**不可重新赋值**的变量：

```typescript
const PI = 3.14159;
PI = 3; // Error: Cannot assign to 'PI' because it is a constant

const arr = [1, 2, 3];
arr.push(4); // ✅ 允许 - 修改数组内容
arr = [5, 6]; // ❌ 错误 - 不能重新赋值
```

**关键点**：
- 阻止变量重新赋值
- 不阻止修改对象/数组的内部内容
- 是运行时约束

### 2. `readonly` - 类型修饰符

`readonly` 是 TypeScript 的类型修饰符，用于标记属性为**只读**：

```typescript
interface Point {
  readonly x: number;
  readonly y: number;
}

const p: Point = { x: 10, y: 20 };
p.x = 30; // Error: Cannot assign to 'x' because it is a read-only property

// 数组的 readonly 修饰
const nums: readonly number[] = [1, 2, 3];
nums.push(4); // Error: Property 'push' does not exist on type 'readonly number[]'
nums[0] = 5; // Error: Index signature in type 'readonly number[]' only permits reading
```

**关键点**：
- 编译时类型检查
- 阻止属性修改
- 适用于接口、类、类型别名
- 对数组/对象深层属性有效

## 对比示例

### 1. 对象属性

```typescript
// const 示例
const obj = { prop: 'value' };
obj.prop = 'new value'; // ✅ 允许
obj = {}; // ❌ 错误

// readonly 示例
interface ReadonlyObj {
  readonly prop: string;
}
const robj: ReadonlyObj = { prop: 'value' };
robj.prop = 'new value'; // ❌ 错误
```

### 2. 数组处理

```typescript
// const 数组
const arr = [1, 2, 3];
arr[0] = 4; // ✅ 允许
arr = [5, 6]; // ❌ 错误

// readonly 数组
const roArr: readonly number[] = [1, 2, 3];
roArr[0] = 4; // ❌ 错误
```

### 3. 类属性

```typescript
class Person {
  readonly name: string;
  age: number;
  
  constructor(name: string, age: number) {
    this.name = name; // 构造函数中可以赋值
    this.age = age;
  }
}

const john = new Person('John', 30);
john.name = 'Mike'; // ❌ 错误
john.age = 31; // ✅ 允许
```

## 组合使用场景

### 1. `const` + `readonly` 双重保护

```typescript
const config: readonly {
  readonly apiUrl: string;
  readonly timeout: number;
} = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};

// 以下操作都会报错
config.apiUrl = '...';
config.timeout = 3000;
config = {} as any;
```

### 2. 只读泛型

```typescript
function freeze<T>(obj: T): Readonly<T> {
  return Object.freeze(obj);
}

const frozen = freeze({ x: 10, y: 20 });
frozen.x = 30; // Error
```

## 类型系统中的 `Readonly` 工具类型

TypeScript 提供了 `Readonly` 工具类型：

```typescript
type User = {
  id: number;
  name: string;
};

const user: Readonly<User> = {
  id: 1,
  name: 'Alice'
};

user.name = 'Bob'; // Error
```

## 通俗易懂的总结

可以把 `const` 和 `readonly` 想象成**不同级别的锁**：

1. **`const` 是固定容器的大锁**：
   - 锁住了变量名和容器的绑定关系
   - 但容器里的东西（对象属性/数组元素）还能动

2. **`readonly` 是容器内容的密码锁**：
   - 锁住了容器内部的内容
   - 但容器本身可以被重新赋值（除非同时用 `const`）

**实际应用建议**：
- 基本类型：用 `const` 就够了
- 对象/数组：`const` + `readonly` 双重保护
- 类属性：用 `readonly` 标记不可变属性
- API 响应：用 `Readonly<T>` 确保数据不被意外修改

## 完整可运行示例

```typescript
// 示例1: const 基本用法
const APP_NAME = 'MyApp';
// APP_NAME = 'NewApp'; // 报错

// 示例2: const 对象
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};
config.timeout = 3000; // ✅ 允许
// config = {}; // 报错

// 示例3: readonly 接口
interface AppConfig {
  readonly apiUrl: string;
  readonly timeout: number;
}
const appConfig: AppConfig = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};
// appConfig.apiUrl = '...'; // 报错

// 示例4: readonly 数组
const features: readonly string[] = ['auth', 'payment'];
// features.push('analytics'); // 报错
// features[0] = 'auth2'; // 报错

// 示例5: 类中的 readonly
class Settings {
  readonly defaultLanguage = 'en';
  theme = 'light';
  
  changeTheme(newTheme: string) {
    this.theme = newTheme;
    // this.defaultLanguage = 'zh'; // 报错
  }
}

// 示例6: 组合使用
const env: Readonly<{
  readonly API_KEY: string;
  DEBUG: boolean;
}> = {
  API_KEY: '12345',
  DEBUG: true
};
// env.API_KEY = '...'; // 报错
env.DEBUG = false; // ✅ 允许
// env = {} as any; // 报错
```
