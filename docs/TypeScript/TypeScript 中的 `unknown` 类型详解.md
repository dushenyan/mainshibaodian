# TypeScript 中的 `unknown` 类型详解

## 1. `unknown` 类型的基本概念

`unknown` 是 TypeScript 3.0 引入的**顶级类型**（Top Type），表示**类型安全**的 `any`。它表示任何值，但在使用前必须进行类型检查或类型断言。

```typescript
let notSure: unknown;

notSure = 123; // ✅
notSure = 'hello'; // ✅
notSure = true; // ✅
notSure = null; // ✅
notSure = undefined; // ✅
notSure = {}; // ✅
```

## 2. `unknown` 的核心特性

### 2.1 类型安全性

与 `any` 不同，`unknown` 类型是类型安全的：

```typescript
let anyValue: any;
let unknownValue: unknown;

anyValue.foo(); // ✅ 不报错（运行时可能出错）
unknownValue.foo(); // ❌ 报错：Object is of type 'unknown'
```

### 2.2 赋值限制

`unknown` 只能赋值给 `any` 和 `unknown` 本身：

```typescript
let a: unknown;
let b: any = a; // ✅
let c: unknown = a; // ✅
let d: string = a; // ❌ Type 'unknown' is not assignable to type 'string'
```

### 2.3 操作限制

对 `unknown` 类型值的操作受到严格限制：

```typescript
let value: unknown;

value + 1; // ❌ 报错
value.trim(); // ❌ 报错
value(); // ❌ 报错
new value(); // ❌ 报错
```

## 3. `unknown` 的使用场景

### 3.1 替代 `any` 实现类型安全

```typescript
// 不安全的方式
function unsafeParse(json: string): any {
  return JSON.parse(json);
}
const obj = unsafeParse('{"name":"Alice"}');
console.log(obj.name); // 运行时才知道是否有name属性

// 安全的方式
function safeParse(json: string): unknown {
  return JSON.parse(json);
}
const obj = safeParse('{"name":"Alice"}');
// console.log(obj.name); // 报错：必须先进行类型检查
```

### 3.2 动态内容处理

处理来自外部源（API、用户输入等）的数据：

```typescript
async function fetchData(url: string): Promise<unknown> {
  const response = await fetch(url);
  return response.json();
}

const data = await fetchData('/api/user');
if (isUser(data)) { // 类型守卫
  console.log(data.name); // 安全访问
}
```

### 3.3 类型安全的泛型替代

当不确定具体类型时：

```typescript
function safeStringify(value: unknown): string {
  return JSON.stringify(value);
}
```

## 4. 使用 `unknown` 的正确方式

### 4.1 类型收窄（Type Narrowing）

```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

const maybeString: unknown = 'hello';

if (isString(maybeString)) {
  console.log(maybeString.toUpperCase()); // ✅ 安全
}
```

### 4.2 类型断言

```typescript
const value: unknown = 'hello world';

// 方式1: as语法
const length1 = (value as string).length;

// 方式2: <>语法
const length2 = (<string>value).length;
```

### 4.3 联合类型处理

```typescript
type Result = string | number | unknown[];

function processResult(result: Result) {
  if (typeof result === 'string') {
    // 处理字符串
  } else if (typeof result === 'number') {
    // 处理数字
  } else {
    // 处理数组
    console.log(result.length);
  }
}
```

## 5. `unknown` 与相关类型的比较

### 5.1 `unknown` vs `any`

| 特性 | `unknown` | `any` |
|------|----------|-------|
| **类型安全** | ✅ | ❌ |
| **可赋值给任意类型** | ❌ | ✅ |
| **允许任意操作** | ❌ | ✅ |
| **需要类型检查** | ✅ | ❌ |

### 5.2 `unknown` vs `object`

```typescript
declare function takesObject(obj: object): void;
declare function takesUnknown(unk: unknown): void;

takesObject(123); // ❌ 报错
takesUnknown(123); // ✅

takesObject(null); // ❌ 报错
takesUnknown(null); // ✅
```

## 6. 高级用法

### 6.1 条件类型中的 `unknown`

```typescript
type IsUnknown<T> = unknown extends T ? true : false;

type A = IsUnknown<unknown>; // true
type B = IsUnknown<string>; // false
```

### 6.2 映射类型保护

```typescript
type RemoveUnknown<T> = T extends unknown ? never : T;

type Cleaned = RemoveUnknown<string | number | unknown>; // string | number
```

### 6.3 递归处理未知结构

```typescript
type DeepPartialUnknown<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartialUnknown<T[P]> : unknown;
};

interface User {
  name: string;
  address: {
    street: string;
    city: string;
  };
}

type PartialUser = DeepPartialUnknown<User>;
/*
{
  name?: unknown;
  address?: {
    street?: unknown;
    city?: unknown;
  };
}
*/
```

## 7. 实际开发中的最佳实践

1. **优先使用 `unknown` 替代 `any`**：当不确定类型时
2. **尽早类型收窄**：尽快将 `unknown` 转为具体类型
3. **配合类型守卫**：使用类型谓词函数进行安全转换
4. **API 边界使用**：特别适合处理外部输入数据
5. **避免过度断言**：尽量减少使用类型断言

## 8. 完整示例

```typescript
// API 响应处理
interface ApiResponse<T> {
  data: T;
  error: string | null;
}

async function fetchApi<T>(url: string): Promise<ApiResponse<T>> {
  const response: unknown = await fetch(url).then(res => res.json());
  
  // 类型守卫验证响应结构
  if (isApiResponse<T>(response)) {
    return response;
  }
  throw new Error('Invalid API response');
}

function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'data' in value &&
    'error' in value &&
    (value.error === null || typeof value.error === 'string')
  );
}

// 使用示例
interface User {
  id: number;
  name: string;
}

const result = await fetchApi<User>('/api/user');
if (result.error) {
  console.error(result.error);
} else {
  console.log(result.data.name); // 安全访问
}
```

## 9. 总结

`unknown` 类型是 TypeScript 类型系统中表示**未知但类型安全**的值，主要特点包括：

1. **类型安全版的 `any`**：允许任何值，但使用时必须进行类型检查
2. **严格的操作限制**：不能直接操作 `unknown` 类型的值
3. **必须显式转换**：需要通过类型守卫或断言转为具体类型
4. **API 边界理想选择**：特别适合处理动态内容或外部数据

**关键记忆点**：
- 比 `any` 更安全
- 比 `object` 更灵活
- 需要配合类型守卫使用
- 是处理不确定类型的最佳选择

通过合理使用 `unknown` 类型，可以在保持 TypeScript 类型安全的同时，灵活处理动态内容。
