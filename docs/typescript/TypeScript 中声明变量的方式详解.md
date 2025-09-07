# TypeScript 中声明变量的方式详解

## 一、基础变量声明方式

### 1. `var` - 函数作用域声明（ES5）

```typescript
var message = "Hello"; // 函数作用域
function example() {
    var inner = "World";
    console.log(message); // 可以访问外部var
}
console.log(inner); // 错误：inner未定义
```

### 2. `let` - 块级作用域声明（ES6）

```typescript
let count = 10; // 块级作用域
if (true) {
    let local = 5;
    console.log(count); // 可以访问外部let
}
console.log(local); // 错误：local未定义
```

### 3. `const` - 块级常量声明（ES6）

```typescript
const PI = 3.14159; // 必须初始化
// PI = 3.14; // 错误：不能重新赋值
const obj = { name: "TS" };
obj.name = "JavaScript"; // 允许修改属性
```

## 二、TypeScript 特有声明方式

### 4. 类型注解声明

```typescript
// 显式类型注解
let username: string = "Alice";
let userAge: number;
let isAdmin: boolean = false;

// 数组类型
let numbers: number[] = [1, 2, 3];
let mixed: (string | number)[] = ["a", 1];

// 元组类型
let person: [string, number] = ["Alice", 30];
```

### 5. 类型推断声明

```typescript
// 自动类型推断
let inferredString = "TypeScript"; // 推断为string
let inferredNumber = 42; // 推断为number
let inferredArray = [1, "two"]; // 推断为 (string | number)[]
```

### 6. 解构声明

```typescript
// 数组解构
let [first, second] = [1, 2]; // first: number, second: number

// 对象解构
let { id, name } = { id: 1, name: "Alice" }; // id: number, name: string

// 带类型注解的解构
let { age }: { age: number } = { age: 25 };
```

## 三、高级声明模式

### 7. 联合类型声明

```typescript
let flexible: string | number;
flexible = "text"; // 允许
flexible = 100; // 允许
// flexible = true; // 错误

// 应用场景：API响应
type ApiResponse = 
    | { status: "success"; data: any }
    | { status: "error"; message: string };

let response: ApiResponse;
```

### 8. 类型别名与接口声明

```typescript
// 类型别名
type Point = {
    x: number;
    y: number;
};
let point: Point = { x: 10, y: 20 };

// 接口
interface User {
    id: number;
    name: string;
}
let user: User = { id: 1, name: "Alice" };
```

### 9. 枚举声明

```typescript
// 数字枚举
enum Direction {
    Up = 1,
    Down,
    Left,
    Right
}
let move: Direction = Direction.Up;

// 字符串枚举
enum LogLevel {
    ERROR = "ERROR",
    WARN = "WARNING",
    INFO = "INFO"
}
let level: LogLevel = LogLevel.INFO;
```

### 10. 只读声明

```typescript
// readonly属性
interface Config {
    readonly apiUrl: string;
}
let config: Config = { apiUrl: "https://api.example.com" };
// config.apiUrl = "new-url"; // 错误

// Readonly工具类型
let fixedArray: ReadonlyArray<number> = [1, 2, 3];
// fixedArray.push(4); // 错误
```

## 四、环境声明（特殊场景）

### 11. 声明全局变量

```typescript
// 声明全局变量（通常在.d.ts文件中）
declare const VERSION: string;
console.log(VERSION);

// 声明已有库
declare module "my-library" {
    export function doSomething(): void;
}
```

### 12. 非空断言声明

```typescript
let maybeString: string | undefined;
// let length = maybeString.length; // 错误
let length = maybeString!.length; // 非空断言（需确保非空）
```

## 五、最佳实践建议

1. **优先使用 `const`**：
   ```typescript
   // 除非需要重新赋值，否则用const
   const MAX_SIZE = 100;
   let counter = 0; // 需要改变的值
   ```

2. **合理使用类型推断**：
   ```typescript
   // 简单情况让TS推断
   const name = "Alice"; // 自动推断为string
   // 复杂情况显式注解
   const coordinates: { x: number; y: number } = { x: 10, y: 20 };
   ```

3. **联合类型优于 `any`**：
   ```typescript
   // 不要用
   let data: any = fetchData();
   // 应该用
   let data: string | number | null = fetchData();
   ```

4. **合理使用解构**：
   ```typescript
   // 函数参数解构
   function printUser({ name, age }: { name: string; age: number }) {
       console.log(`${name} is ${age} years old`);
   }
   ```

## 六、完整示例

```typescript
// 综合示例
type UserRole = "admin" | "user" | "guest";

interface UserProfile {
    id: number;
    name: string;
    role: UserRole;
    readonly createdAt: Date;
}

// 变量声明
const APP_NAME = "MyTSApp";
let activeUsers: UserProfile[] = [];

// 解构声明
const [primaryUser, ...otherUsers] = activeUsers;

// 类型守卫
function isAdmin(user: UserProfile): user is UserProfile & { role: "admin" } {
    return user.role === "admin";
}

// 使用示例
if (activeUsers.length > 0 && isAdmin(primaryUser)) {
    console.log(`${primaryUser.name} is an admin`);
}
```

## 总结

TypeScript 的变量声明方式既包含 JavaScript 的基础语法，又扩展了强大的类型系统：

1. **基础三剑客**：
   - `var` - 函数作用域（已不推荐）
   - `let` - 块级可变变量
   - `const` - 块级常量

2. **类型增强**：
   - 类型注解（`: Type` 语法）
   - 类型推断（自动推导类型）
   - 联合类型（`string | number`）

3. **高级模式**：
   - 解构声明（数组/对象解构）
   - 类型别名与接口
   - 枚举类型
   - 只读属性

4. **特殊声明**：
   - 环境声明（`.d.ts` 文件）
   - 非空断言（`!` 操作符）

**开发口诀**：
'变量声明分作用域，类型注解要清晰；
const优先保不变，let用于可变值；
接口别名定形状，解构枚举增便利。'

在实际项目中：
- 新项目应完全避免使用 `var`
- 优先使用 `const` 声明不变的值
- 复杂数据结构使用接口/类型别名
- 善用类型推断简化代码
- 对外暴露的API需要显式类型注解
