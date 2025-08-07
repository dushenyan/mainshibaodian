# TypeScript 中的 `never` 类型详解

## 1. `never` 类型的基本概念

`never` 是 TypeScript 中的**底部类型**（Bottom Type），表示永远不会发生的值的类型。它是类型系统中最小的类型，不包含任何可能的值。

## 2. `never` 类型的特性

### 2.1 基本特性

- **不可达性**：不能给 `never` 类型赋值任何值（包括 `null` 和 `undefined`）
- **子类型性**：`never` 是所有类型的子类型
- **无实例**：没有运行时值对应 `never` 类型

```typescript
let impossible: never;
impossible = 123; // Error: Type 'number' is not assignable to type 'never'
impossible = 'hello'; // Error
impossible = null; // Error
impossible = undefined; // Error
```

### 2.2 类型运算中的表现

```typescript
type T1 = never & string; // never
type T2 = never | string; // string
type T3 = keyof never; // never
```

## 3. `never` 类型的产生场景

### 3.1 函数永远不会正常返回

```typescript
// 抛出异常的函数
function error(message: string): never {
  throw new Error(message);
}

// 无限循环的函数
function infiniteLoop(): never {
  while (true) {}
}
```

### 3.2 类型收窄到不可能的情况

```typescript
function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}

function handleShape(shape: Circle | Square) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      return assertNever(shape); // 确保所有情况都被处理
  }
}
```

### 3.3 空数组的类型推断

```typescript
const emptyArray: [] = [];
type EmptyArrayType = typeof emptyArray[number]; // never
```

## 4. `never` 类型的实际应用

### 4.1 确保全面性检查

```typescript
type Shape = Circle | Square;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```

### 4.2 过滤联合类型

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type T1 = NonNullable<string | number | null | undefined>; // string | number
```

### 4.3 构建高级类型工具

```typescript
// 从映射类型中移除某些属性
type FilterProperties<T, U> = {
  [K in keyof T]: T[K] extends U ? never : K
}[keyof T];

type Person = {
  name: string;
  age: number;
  address: string | null;
};

type NonNullableProps = FilterProperties<Person, null | undefined>; // "name" | "age"
```

## 5. `never` 与 `void` 的区别

| 特性 | `never` | `void` |
|------|---------|--------|
| **含义** | 永远不会有返回值 | 有返回值但为空 |
| **可赋值性** | 不能赋任何值 | 可赋 `undefined`/`null`(严格模式除外) |
| **函数返回** | 函数无法正常返回 | 函数正常返回但没有值 |
| **使用场景** | 抛出错误/死循环 | 常规无返回值函数 |

```typescript
// void 示例
function noop(): void {
  console.log("Do nothing");
  // 隐式返回 undefined
}

// never 示例
function fail(): never {
  throw new Error("Something failed");
}
```

## 6. 深入理解 `never`

### 6.1 类型系统的数学视角

从类型理论看，`never` 类似于集合论中的**空集**：
- 任何类型与 `never` 的联合都是原类型：`T | never = T`
- 任何类型与 `never` 的交集都是 `never`：`T & never = never`

### 6.2 编译器优化

TypeScript 编译器会利用 `never` 类型进行优化：
- 在条件类型中排除不可能的分支
- 在映射类型中过滤不需要的属性
- 在类型推断中识别不可达代码

## 7. 实际开发中的用例

### 7.1 防御性编程

```typescript
function parseInput(input: string | number): number {
  if (typeof input === 'string') {
    return parseFloat(input);
  } else if (typeof input === 'number') {
    return input;
  } else {
    // 确保未来添加新类型时会报错
    const _exhaustiveCheck: never = input;
    return _exhaustiveCheck;
  }
}
```

### 7.2 高级类型操作

```typescript
// 提取函数参数类型
type Parameters<T extends (...args: any) => any> = 
  T extends (...args: infer P) => any ? P : never;

// 提取数组元素类型
type ElementType<T> = 
  T extends (infer U)[] ? U : 
  T extends readonly (infer U)[] ? U : 
  never;
```

## 8. 常见误区

### 8.1 误认为 `never` 是 `void`

```typescript
// 错误理解
function wrong(): never {
  console.log("This will return undefined");
  // 实际上应该报错，因为函数正常返回了
}
```

### 8.2 过度使用 `never`

```typescript
// 不必要地使用 never
function overuse(): never {
  throw new Error("Should only use when truly unreachable");
}
```

## 9. 总结

`never` 类型是 TypeScript 类型系统中表示**不可能**的概念，主要用途包括：

1. **标记不可达代码**：确保所有可能的代码路径都被处理
2. **类型运算中的过滤**：在条件类型中排除不需要的类型
3. **防御性编程**：强制开发者处理所有可能的类型情况
4. **高级类型操作**：构建复杂的类型工具和实用类型

**关键记忆点**：
- `never` 是类型系统的"空集"
- 表示永远不会发生的值
- 用于标记不可达代码分支
- 在类型运算中起过滤作用
- 与 `void` 有本质区别

## 10. 完整示例

```typescript
// 1. 基本 never 函数
function fail(message: string): never {
  throw new Error(message);
}

// 2. 类型收窄示例
type Shape = 
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number }
  | { kind: "triangle"; base: number; height: number };

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.side ** 2;
    case "triangle":
      return (shape.base * shape.height) / 2;
    default:
      // 确保处理了所有可能的情况
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}

// 3. 高级类型示例
type ExtractStrings<T> = T extends string ? T : never;

type Mixed = string | number | boolean | null;
type StringsOnly = ExtractStrings<Mixed>; // string

// 4. 空数组推断
const empty = [];
type EmptyItem = typeof empty[number]; // never

// 5. 条件类型中的 never
type ExcludeNull<T> = T extends null | undefined ? never : T;

type ValidValues = ExcludeNull<string | number | null>; // string | number
```
