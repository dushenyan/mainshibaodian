---
titleTemplate: TS
bracketEscaping: true
---

# TypeScript 开发中常用的特性与能力

在多年的 TypeScript 开发实践中，我深入应用了以下 TypeScript 特性，这些特性显著提升了代码质量、开发效率和类型安全性：

## 一、核心类型系统特性

### 1. 高级类型操作
- **条件类型**：`T extends U ? X : Y` 实现类型分支逻辑
```typescript
type IsString<T> = T extends string ? true : false;
```
- **映射类型**：通过 `in` 关键字转换已有类型
```typescript
type Readonly<T> = { readonly [P in keyof T]: T[P] };
```
- **模板字面量类型**：构建动态字符串类型
```typescript
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type ApiRoute = `/api/${string}`;
```

### 2. 类型推断与操作
- **`infer` 推断**：提取嵌套类型信息
```typescript
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
```
- **keyof 和 typeof**：动态获取类型信息
```typescript
const config = { apiUrl: '...', timeout: 5000 };
type ConfigKeys = keyof typeof config; // "apiUrl" | "timeout"
```

## 二、工程化实践

### 1. 类型定义策略
- **声明合并**：扩展第三方类型定义
```typescript
declare module 'react' {
  interface HTMLAttributes<T> {
    customAttr?: string;
  }
}
```
- **类型守卫**：自定义类型谓词函数
```typescript
function isAdmin(user: User): user is Admin {
  return user.role === 'admin';
}
```

### 2. 项目配置方案
- **多 tsconfig 配置**：通过 `extends` 共享基础配置
```json
// tsconfig.base.json
{
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```
- **类型检查加速**：启用 `incremental` 和 `skipLibCheck`

## 三、实战应用场景

### 1. API 类型安全
- **响应类型推导**：
```typescript
type ApiResponse<T> = { data: T } | { error: string };
async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  // ...
}
```
- **路由类型安全**：
```typescript
type ValidRoutes = `/user/${number}` | `/posts/${string}`;
function navigate(route: ValidRoutes) { /*...*/ }
```

### 2. 状态管理
- **Redux 类型化**：
```typescript
type ActionPayloads = {
  'user/login': { email: string; password: string };
  'user/logout': undefined;
};

type Action<T extends keyof ActionPayloads> = {
  type: T;
  payload: ActionPayloads[T];
};
```

### 3. 组件开发
- **React 组件 Props 推导**：
```typescript
type PropsWithDefaults<P, D> = Partial<P> & {
  [K in keyof D]: P[K] extends D[K] ? P[K] : never;
};
```

## 四、高级模式应用

### 1. 类型编程
- **递归类型处理**：
```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
```
- **类型谓词组合**：
```typescript
type Brand<T, B> = T & { __brand: B };
type Email = Brand<string, 'Email'>;
```

### 2. 性能优化
- **常量枚举**：减少运行时开销
```typescript
const enum Direction {
  Up, Down, Left, Right
}
```
- **类型导入分离**：`import type` 减少打包体积

## 五、工具链集成

### 1. 测试工具
- **类型测试**：使用 `@ts-expect-error` 验证类型错误
```typescript
// @ts-expect-error 应该报错
const invalid: number = 'string';
```

### 2. 文档生成
- **TSDoc 注释**：生成类型文档
```typescript
/**
 * 用户基本信息
 * @property id - 用户唯一标识
 */
interface User {
  id: string;
}
```

## 六、最佳实践总结

1. **渐进类型策略**：对新代码严格类型化，逐步改造旧代码
2. **类型分层设计**：
   - 基础类型定义放在 `types/` 目录
   - 业务类型靠近使用场景
3. **工具类型复用**：构建项目专属的类型工具库
4. **类型测试覆盖**：对复杂类型逻辑编写类型测试
5. **文档驱动开发**：通过类型定义自动生成 API 文档

## 完整示例：API 客户端类型安全实现

```typescript
// api/types.ts
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type EndpointConfig = {
  [route: string]: {
    method: HttpMethod;
    request: unknown;
    response: unknown;
  };
};

type ApiEndpoints = {
  '/user': {
    GET: { response: User[] };
    POST: { request: CreateUserDto; response: User };
  };
  '/user/:id': {
    GET: { response: User };
    PUT: { request: UpdateUserDto; response: User };
    DELETE: { response: void };
  };
};

// api/client.ts
type RequestOptions<T extends keyof ApiEndpoints, M extends HttpMethod> = {
  url: T;
  method: M;
  data?: ApiEndpoints[T][M]['request'];
};

async function request<
  T extends keyof ApiEndpoints,
  M extends HttpMethod
>(options: RequestOptions<T, M>): Promise<ApiEndpoints[T][M]['response']> {
  // 实现...
}

// 使用示例
const user = await request({
  url: '/user/123',
  method: 'GET'
}); // 自动推断返回类型为 User
```

通过系统性地应用这些 TypeScript 特性，我们能够构建出高度类型安全、易于维护且开发体验良好的大型前端应用。
