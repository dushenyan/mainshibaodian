---
titleTemplate: TS
bracketEscaping: true
---

# TypeScript 中的 `extends` 条件类型详解

## 1. 基本语法

条件类型使用 `extends` 关键字定义，语法为：

```typescript
T extends U ? X : Y
```

这个表达式表示：
- 如果类型 `T` 可以赋值给类型 `U`（即 `T` 是 `U` 的子类型）
- 则返回类型 `X`
- 否则返回类型 `Y`

## 2. 基本示例

### 2.1 简单条件判断

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<'hello'>; // true
type B = IsString<123>;     // false
```

### 2.2 类型提取

```typescript
type ExtractString<T> = T extends string ? T : never;

type C = ExtractString<'abc' | 123 | boolean>; // "abc"
```

## 3. 高级用法

### 3.1 分布式条件类型（Distributive Conditional Types）

当条件类型作用于联合类型时，会进行**分布式计算**：

```typescript
type ToArray<T> = T extends any ? T[] : never;

type D = ToArray<string | number>; // string[] | number[]
```

### 3.2 阻止分布式计算

使用方括号包裹 `extends` 两侧的类型可以阻止分布式行为：

```typescript
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;

type E = ToArrayNonDist<string | number>; // (string | number)[]
```

### 3.3 类型推断（infer）

结合 `infer` 关键字可以从类型中提取部分信息：

```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type F = ReturnType<() => string>; // string
type G = ReturnType<boolean>;      // never
```

## 4. 实用工具类型实现

### 4.1 `Exclude<T, U>`

从 `T` 中排除可以赋值给 `U` 的类型：

```typescript
type MyExclude<T, U> = T extends U ? never : T;

type H = MyExclude<'a' | 'b' | 'c', 'a'>; // "b" | "c"
```

### 4.2 `Extract<T, U>`

从 `T` 中提取可以赋值给 `U` 的类型：

```typescript
type MyExtract<T, U> = T extends U ? T : never;

type I = MyExtract<'a' | 'b' | 1 | 2, string>; // "a" | "b"
```

### 4.3 `NonNullable<T>`

从 `T` 中排除 `null` 和 `undefined`：

```typescript
type MyNonNullable<T> = T extends null | undefined ? never : T;

type J = MyNonNullable<string | null | undefined>; // string
```

## 5. 递归条件类型

条件类型可以递归调用自身：

```typescript
type DeepReadonly<T> = T extends object ? {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
} : T;

type K = DeepReadonly<{
  a: number;
  b: {
    c: string;
    d: boolean;
  }
}>;
/*
{
  readonly a: number;
  readonly b: {
    readonly c: string;
    readonly d: boolean;
  };
}
*/
```

## 6. 类型约束与条件类型

`extends` 也可以用于泛型约束：

```typescript
type KeyOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never
}[keyof T];

interface Person {
  name: string;
  age: number;
  email: string | null;
}

type L = KeyOfType<Person, string>; // "name"
type M = KeyOfType<Person, string | null>; // "name" | "email"
```

## 7. 条件类型与映射类型结合

```typescript
type ConditionalMap<T> = {
  [K in keyof T]: T[K] extends string ? K : never
};

type N = ConditionalMap<{
  id: string;
  count: number;
  active: boolean;
}>;
/*
{
  id: "id";
  count: never;
  active: never;
}
*/
```

## 8. 实际应用示例

### 8.1 API 响应处理

```typescript
type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
};

type ExtractData<T> = T extends { success: true; data: infer D } ? D : never;

function handleResponse<T>(response: ApiResponse<T>) {
  if (response.success) {
    const data: ExtractData<typeof response> = response.data;
    // 处理 data
  } else {
    console.error(response.error);
  }
}
```

### 8.2 表单验证

```typescript
type ValidationResult<T> = {
  [K in keyof T]: T[K] extends string ? boolean : never
};

function validate<User>(user: User): ValidationResult<User> {
  // 实现验证逻辑
}
```

## 9. 注意事项

1. **性能考虑**：复杂的条件类型可能增加编译时间
2. **递归深度**：TypeScript 对递归深度有限制（默认约50层）
3. **可读性**：过度使用条件类型会降低代码可读性
4. **浏览器兼容性**：某些高级用法需要较新版本的 TypeScript

## 10. 完整示例

```typescript
// 1. 基本条件类型
type IsNumber<T> = T extends number ? true : false;

// 2. 提取函数参数类型
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

// 3. 递归展开Promise
type UnwrapPromise<T> = T extends Promise<infer U> ? UnwrapPromise<U> : T;

// 4. 条件映射
type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never
}[keyof T];

// 5. 类型守卫
type NonFunctionKeys<T> = {
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T];

// 使用示例
interface Example {
  id: string;
  count: number;
  update(): void;
}

type O = StringKeys<Example>; // "id"
type P = NonFunctionKeys<Example>; // "id" | "count"
```

## 总结

`extends` 条件类型是 TypeScript 类型系统中强大的工具，允许我们：

1. **基于类型关系进行分支判断**：实现类型层面的条件逻辑
2. **类型提取和转换**：从复杂类型中提取所需部分
3. **创建高级工具类型**：构建灵活的类型工具
4. **类型安全的重构**：使类型随输入变化而自动调整

**关键记忆点**：
- `T extends U ? X : Y` 是基本语法
- 联合类型会触发分布式计算
- `infer` 关键字用于类型提取
- 可以递归定义复杂条件类型
- 与映射类型结合能实现强大功能

掌握条件类型可以显著提升 TypeScript 类型系统的表达能力，是进阶 TypeScript 开发的必备技能。
