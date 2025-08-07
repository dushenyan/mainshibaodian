# TypeScript 中的 `infer` 关键字详解

## 1. `infer` 的基本概念

`infer` 是 TypeScript 中用于**条件类型中类型推断**的关键字，它允许我们在条件类型中**声明一个待推断的类型变量**，然后在条件为真时使用这个推断出的类型。

```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
```

在这个例子中：
- `infer R` 表示"推断出函数的返回类型"
- 如果 `T` 是函数类型，则返回推断出的返回类型 `R`
- 否则返回 `never`

## 2. `infer` 的工作原理

### 2.1 基本工作流程

1. 在 `extends` 条件类型中声明 `infer` 变量
2. TypeScript 尝试匹配模式并推断类型
3. 如果匹配成功，可以在 `true` 分支使用推断的类型
4. 如果匹配失败，进入 `false` 分支

### 2.2 简单示例

```typescript
type GetArrayType<T> = T extends Array<infer U> ? U : T;

type A = GetArrayType<string[]>; // string
type B = GetArrayType<number[]>; // number
type C = GetArrayType<string>;   // string (不是数组)
```

## 3. `infer` 的常见用法

### 3.1 提取函数返回类型

```typescript
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

function foo() { return 123; }
type FooReturn = MyReturnType<typeof foo>; // number
```

### 3.2 提取函数参数类型

```typescript
type MyParameters<T> = T extends (...args: infer P) => any ? P : never;

function bar(x: string, y: number) {}
type BarParams = MyParameters<typeof bar>; // [string, number]
```

### 3.3 提取 Promise 的解析类型

```typescript
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type PromiseString = Promise<string>;
type Unwrapped = UnwrapPromise<PromiseString>; // string
```

### 3.4 提取数组元素类型

```typescript
type ElementType<T> = T extends (infer U)[] ? U : never;

type StrArray = string[];
type Element = ElementType<StrArray>; // string
```

## 4. 高级用法

### 4.1 递归解包嵌套类型

```typescript
type DeepUnwrap<T> = 
  T extends Promise<infer U> ? DeepUnwrap<U> :
  T extends Array<infer V> ? DeepUnwrap<V>[] :
  T;

type Nested = Promise<Promise<string[]>>;
type UnwrappedNested = DeepUnwrap<Nested>; // string[]
```

### 4.2 提取构造函数参数

```typescript
type ConstructorParameters<T> = 
  T extends new (...args: infer P) => any ? P : never;

class Person {
  constructor(public name: string, public age: number) {}
}
type PersonParams = ConstructorParameters<typeof Person>; // [string, number]
```

### 4.3 提取对象属性类型

```typescript
type PropType<T, K extends keyof T> = 
  T extends { [key in K]: infer V } ? V : never;

interface User {
  id: number;
  name: string;
}
type UserName = PropType<User, 'name'>; // string
```

## 5. 实际应用示例

### 5.1 响应数据解包

```typescript
type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
};

type ResponseData<T> = T extends { success: true; data: infer D } ? D : never;

function handleResponse<T>(response: ApiResponse<T>) {
  if (response.success) {
    const data: ResponseData<typeof response> = response.data;
    // 使用 data
  }
}
```

### 5.2 高阶组件 Props 提取

```typescript
type GetComponentProps<T> = 
  T extends React.ComponentType<infer P> ? P : never;

function withLoading<T extends React.ComponentType<any>>(Component: T) {
  return (props: GetComponentProps<T> & { isLoading: boolean }) => (
    // 实现高阶组件
  );
}
```

## 6. 注意事项

1. **`infer` 只能在条件类型的 `extends` 子句中使用**
2. **每个 `infer` 声明必须对应一个类型变量**
3. **`infer` 变量只在当前条件类型中有效**
4. **`infer` 不能用于常规类型别名或接口**

错误示例：
```typescript
type WrongInfer = infer T; // 错误！不能单独使用
```

## 7. 常见问题解答

### Q: `infer` 和泛型有什么区别？

A: 泛型是显式传递类型参数，而 `infer` 是从已有类型中提取/推断类型。

### Q: 可以同时推断多个类型吗？

A: 可以，可以同时使用多个 `infer` 声明：

```typescript
type FirstTwo<T> = T extends [infer A, infer B, ...any[]] ? [A, B] : never;
type Pair = FirstTwo<[string, number, boolean]>; // [string, number]
```

### Q: `infer` 能推断任意位置的类型吗？

A: 是的，可以在类型结构的任何位置使用 `infer`：

```typescript
type SecondArg<T> = T extends (a: any, b: infer B, ...args: any[]) => any ? B : never;
type B = SecondArg<(x: string, y: number) => void>; // number
```

## 8. 完整示例

```typescript
// 1. 提取数组或元组的元素类型
type Flatten<T> = T extends (infer U)[] ? U : T;

// 2. 提取函数第一个参数类型
type FirstParam<T> = T extends (arg: infer P, ...args: any[]) => any ? P : never;

// 3. 提取对象方法返回值类型
type MethodReturn<T, K extends keyof T> = 
  T[K] extends (...args: any[]) => infer R ? R : never;

// 4. 提取所有函数类型的属性名
type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends Function ? K : never
}[keyof T];

// 使用示例
interface Example {
  id: number;
  name: string;
  update(data: string): boolean;
  delete: (id: number) => Promise<void>;
}

type ExampleFuncKeys = FunctionKeys<Example>; // "update" | "delete"
type UpdateReturn = MethodReturn<Example, 'update'>; // boolean
type DeleteParam = FirstParam<Example['delete']>; // number
```

## 总结

`infer` 关键字是 TypeScript 类型系统中强大的**类型推断工具**，主要用途包括：

1. **从复杂类型中提取部分信息**：如函数参数、返回值等
2. **创建灵活的工具类型**：如 `ReturnType`、`Parameters` 等
3. **实现类型模式匹配**：在条件类型中进行类型解构
4. **构建高级类型操作**：支持复杂的类型转换

**关键记忆点**：
- 只能在条件类型中使用
- 每次只能推断一个类型变量
- 支持在函数、数组、Promise 等各种结构中使用
- 可以与泛型结合实现更复杂的类型操作
- 是 TypeScript 高级类型编程的核心工具之一

掌握 `infer` 可以大幅提升 TypeScript 类型系统的表达能力，是实现复杂类型操作和类型安全抽象的关键技能。
