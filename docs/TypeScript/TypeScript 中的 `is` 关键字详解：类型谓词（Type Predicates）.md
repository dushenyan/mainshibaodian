# TypeScript 中的 `is` 关键字详解：类型谓词（Type Predicates）

## 1. 基本概念

`is` 关键字用于定义**类型谓词函数**，这类函数不仅返回布尔值，还会告诉 TypeScript 编译器在返回 `true` 时参数的具体类型。

```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}
```

## 2. 核心作用

### 2.1 类型收窄（Type Narrowing）

类型谓词能够在条件判断中精确收窄变量类型：

```typescript
function processValue(value: string | number) {
  if (isString(value)) {
    // 此处 value 被收窄为 string 类型
    console.log(value.toUpperCase());
  } else {
    // 此处 value 被收窄为 number 类型
    console.log(value.toFixed(2));
  }
}
```

### 2.2 与普通类型守卫的区别

| 特性 | 类型谓词函数 | 普通类型守卫 |
|------|------------|------------|
| **复用性** | 可多处复用 | 仅限当前作用域 |
| **可读性** | 语义更明确 | 逻辑内联 |
| **复杂度** | 适合复杂判断 | 适合简单判断 |

## 3. 使用场景

### 3.1 验证复杂对象结构

```typescript
interface User {
  id: string;
  name: string;
}

function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' && 
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string'
  );
}

const data: unknown = JSON.parse('...');
if (isUser(data)) {
  console.log(`Hello, ${data.name}`); // 安全访问
}
```

### 3.2 区分联合类型

```typescript
type Shape = Circle | Square;

function isCircle(shape: Shape): shape is Circle {
  return 'radius' in shape;
}

function calculateArea(shape: Shape) {
  if (isCircle(shape)) {
    return Math.PI * shape.radius ** 2; // 识别为 Circle
  }
  return shape.sideLength ** 2; // 自动识别为 Square
}
```

### 3.3 数组元素过滤

```typescript
const mixedArray: (string | number)[] = ['a', 1, 'b', 2];

// 不使用类型谓词
const strings = mixedArray.filter(x => typeof x === 'string'); // 类型仍是 (string | number)[]

// 使用类型谓词
function isString(x: any): x is string {
  return typeof x === 'string';
}
const realStrings = mixedArray.filter(isString); // 类型收窄为 string[]
```

## 4. 高级用法

### 4.1 泛型类型谓词

```typescript
function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

const results: (string | undefined)[] = ['a', undefined, 'b'];
const definedResults = results.filter(isDefined); // string[]
```

### 4.2 基于 `this` 的类型谓词

```typescript
class FileSystemObject {
  isFile(): this is File {
    return this instanceof File;
  }
  isDirectory(): this is Directory {
    return this instanceof Directory;
  }
}
```

### 4.3 组合多个谓词

```typescript
type ApiResponse = SuccessResponse | ErrorResponse;

function isSuccess(res: ApiResponse): res is SuccessResponse {
  return 'data' in res;
}

function hasPagination(res: ApiResponse): res is SuccessResponse & { data: PaginatedData } {
  return isSuccess(res) && 'page' in res.data;
}
```

## 5. 实现要点

1. **返回值必须严格匹配**：谓词函数必须返回布尔值
2. **不能有副作用**：应该是纯判断函数
3. **类型必须精确**：`value is T` 中的 `T` 必须准确反映真实情况
4. **避免过度使用**：简单场景直接用内联类型守卫

## 6. 常见错误

### 6.1 不准确的类型谓词

```typescript
// 错误示例：判断不充分
function isUser(obj: any): obj is User {
  return typeof obj.name === 'string'; // 可能漏检其他属性
}
```

### 6.2 副作用问题

```typescript
// 错误示例：有副作用
function isAdmin(user: User): user is Admin {
  return checkPermission(user); // 不应该包含业务逻辑
}
```

## 7. 最佳实践

1. **优先收窄到最小类型**：使类型尽可能精确
2. **编写测试验证**：确保类型谓词的正确性
3. **文档化复杂谓词**：添加注释说明判断逻辑
4. **与运行时验证结合**：如 JSON Schema 验证

## 8. 完整示例

```typescript
// 类型定义
interface ApiResponse<T> {
  code: number;
  data: T;
  message?: string;
}

interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
}

// 类型谓词
function isSuccessResponse<T>(res: any): res is ApiResponse<T> {
  return res && typeof res.code === 'number' && 'data' in res;
}

function isPaginated<T>(res: ApiResponse<any>): res is ApiResponse<PaginatedData<T>> {
  return isSuccessResponse(res) && 
         typeof res.data?.total === 'number' &&
         Array.isArray(res.data?.items);
}

// 使用示例
async function fetchData() {
  const response = await fetch('/api/data');
  const data = await response.json();
  
  if (isPaginated<User>(data)) {
    console.log(`Total users: ${data.data.total}`);
    data.data.items.forEach(user => {
      console.log(user.name); // 正确推断 user 类型
    });
  }
}
```

## 总结

`is` 关键字的核心价值：

1. **提升类型安全性**：在运行时验证的同时获得编译时类型检查
2. **增强代码可读性**：将复杂类型判断封装为有意义的函数
3. **促进代码复用**：类型守卫逻辑可以多处共享
4. **支持高级模式**：实现类型安全的过滤、验证等操作

**关键记忆点**：
- 形式：`parameterName is Type`
- 必须返回布尔值
- 主要用于函数返回值类型声明
- 与 `typeof`/`instanceof` 等结合使用效果更佳
- 是 TypeScript 高级类型编程的重要工具

合理使用类型谓词可以显著提升代码的类型安全性和可维护性，特别适合处理动态数据（如 API 响应、反序列化结果等）和复杂类型判断场景。
