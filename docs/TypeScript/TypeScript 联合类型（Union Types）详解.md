# TypeScript 联合类型（Union Types）详解

## 1. 联合类型的基本概念

联合类型（Union Types）是 TypeScript 的核心特性之一，它允许一个值可以是**多种类型之一**，使用 `|` 符号连接多个类型。

```typescript
let id: string | number;
id = "ABC123"; // ✅
id = 123;      // ✅
id = true;     // ❌ Type 'boolean' is not assignable to type 'string | number'
```

## 2. 联合类型的特点

### 2.1 类型范围限制

变量只能赋值为联合类型中指定的类型：

```typescript
type Status = "success" | "error" | "pending";
let currentStatus: Status;

currentStatus = "success"; // ✅
currentStatus = "ready";   // ❌ Type '"ready"' is not assignable to type 'Status'
```

### 2.2 类型自动收窄

TypeScript 会根据上下文自动收窄类型范围：

```typescript
function printId(id: string | number) {
  if (typeof id === "string") {
    console.log(id.toUpperCase()); // 此处 id 确定为 string
  } else {
    console.log(id.toFixed(2));    // 此处 id 确定为 number
  }
}
```

## 3. 联合类型的常见使用场景

### 3.1 处理多种输入类型

```typescript
function formatInput(input: string | number | boolean): string {
  if (typeof input === "string") return input.trim();
  if (typeof input === "number") return input.toFixed(2);
  return input ? "YES" : "NO";
}
```

### 3.2 定义状态集合

```typescript
type LoadingState = "idle" | "loading" | "success" | "error";

interface ApiState {
  status: LoadingState;
  data?: any;
  error?: string;
}
```

### 3.3 处理 DOM 元素

```typescript
function getElement(): HTMLElement | null {
  return document.getElementById("app");
}

const el = getElement();
if (el) {
  el.style.color = "red"; // 安全访问
}
```

## 4. 联合类型的类型守卫

### 4.1 `typeof` 类型守卫

```typescript
function padLeft(value: string, padding: string | number) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + value;
  }
  return padding + value;
}
```

### 4.2 `instanceof` 类型守卫

```typescript
class Bird {
  fly() {}
}
class Fish {
  swim() {}
}

function move(pet: Bird | Fish) {
  if (pet instanceof Bird) {
    pet.fly();
  } else {
    pet.swim();
  }
}
```

### 4.3 自定义类型谓词

```typescript
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

type Shape = Circle | Square;

function isCircle(shape: Shape): shape is Circle {
  return shape.kind === "circle";
}

function getArea(shape: Shape) {
  if (isCircle(shape)) {
    return Math.PI * shape.radius ** 2;
  }
  return shape.sideLength ** 2;
}
```

## 5. 联合类型的运算规则

### 5.1 联合类型的交集

```typescript
type A = string | number;
type B = number | boolean;
type C = A & B; // number
```

### 5.2 联合类型的并集

```typescript
type D = A | B; // string | number | boolean
```

### 5.3 与交叉类型的区别

```typescript
type Union = { a: number } | { b: string };
type Intersection = { a: number } & { b: string };

const u: Union = { a: 1 }; // ✅
const i: Intersection = { a: 1, b: "text" }; // ✅
```

## 6. 高级用法

### 6.1 可辨识联合（Discriminated Unions）

```typescript
type NetworkLoadingState = {
  state: "loading";
};

type NetworkSuccessState = {
  state: "success";
  response: {
    data: string;
  };
};

type NetworkErrorState = {
  state: "error";
  error: Error;
};

type NetworkState = 
  | NetworkLoadingState
  | NetworkSuccessState
  | NetworkErrorState;

function processState(state: NetworkState) {
  switch (state.state) {
    case "loading":
      console.log("Loading...");
      break;
    case "success":
      console.log(state.response.data);
      break;
    case "error":
      console.error(state.error.message);
      break;
  }
}
```

### 6.2 联合类型与泛型

```typescript
function merge<T extends string | number>(a: T, b: T): T {
  return a + b; // Error: Operator '+' cannot be applied to types 'T' and 'T'
  // 需要更精确的类型检查
}
```

### 6.3 模板字面量联合类型

```typescript
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type ApiRoute = `/api/${string}`;

function fetchData(method: HttpMethod, route: ApiRoute) {
  // ...
}

fetchData("POST", "/api/users"); // ✅
fetchData("GET", "/users");      // ❌
```

## 7. 实际开发中的最佳实践

1. **优先使用字面量联合**：代替枚举实现简单状态管理
2. **尽早类型收窄**：尽快确定具体类型
3. **合理使用类型守卫**：提高代码类型安全性
4. **避免过度复杂**：保持联合类型的可维护性
5. **配合文档说明**：为复杂联合类型添加注释

## 8. 完整示例

```typescript
// 用户角色系统
type UserRole = "admin" | "editor" | "viewer";

interface BaseUser {
  id: string;
  name: string;
}

interface AdminUser extends BaseUser {
  role: "admin";
  permissions: string[];
}

interface EditorUser extends BaseUser {
  role: "editor";
  editableSections: string[];
}

interface ViewerUser extends BaseUser {
  role: "viewer";
  lastViewed: Date;
}

type User = AdminUser | EditorUser | ViewerUser;

function getUserInfo(user: User) {
  let info = `${user.name} (${user.id})`;
  
  switch (user.role) {
    case "admin":
      return info + `, 权限: ${user.permissions.join(", ")}`;
    case "editor":
      return info + `, 可编辑: ${user.editableSections.join(", ")}`;
    case "viewer":
      return info + `, 最后查看: ${user.lastViewed.toLocaleString()}`;
  }
}

// 使用示例
const admin: User = {
  id: "1",
  name: "Alice",
  role: "admin",
  permissions: ["create", "update", "delete"]
};

console.log(getUserInfo(admin));
```

## 9. 总结

联合类型是 TypeScript 中表示**多选一**的类型系统特性，主要特点包括：

1. **灵活性**：允许一个变量具有多种可能的类型
2. **类型安全**：限制值必须在指定类型范围内
3. **智能推断**：通过类型守卫自动收窄类型范围
4. **模式匹配**：特别适合实现状态机模式

**关键优势**：
- 比 `any` 更安全
- 比重载更简洁
- 比继承更灵活
- 完美配合类型守卫

**适用场景**：
- 处理多种输入类型
- 定义有限状态集合
- 实现多态行为
- 构建可扩展的API接口
