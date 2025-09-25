# TypeScript 中命名空间与模块的深度解析

## 一、核心概念对比

| 特性                | 命名空间 (Namespace)               | 模块 (Module)                   |
|---------------------|------------------------------------|---------------------------------|
| **组织方式**         | 逻辑分组（语法上的组织）             | 物理隔离（文件系统级的组织）       |
| **作用域**           | 全局或限定命名空间内                 | 模块作用域（需显式导出导入）        |
| **文件关系**         | 多文件可合并到同一命名空间           | 一个文件即一个独立模块             |
| **依赖管理**         | 依赖隐式存在（需手动管理顺序）        | 显式声明依赖（自动解析）           |
| **编译输出**         | 可生成合并的全局代码                 | 生成隔离的模块系统代码             |
| **适用场景**         | 浏览器环境/传统项目                 | 现代应用/Node.js/前端框架          |

## 二、命名空间详解

### 1. 基本语法

```typescript
// shapes.ts
namespace Shapes {
    export interface Point {
        x: number;
        y: number;
    }
    
    export class Circle {
        constructor(public center: Point, public radius: number) {}
    }
}

// 使用：通过完全限定名
const circle = new Shapes.Circle({ x: 0, y: 0 }, 10);
```

### 2. 多文件扩展

```typescript
// shapes-additional.ts
/// <reference path="shapes.ts" />
namespace Shapes {
    export class Rectangle {
        constructor(public origin: Point, public width: number, public height: number) {}
    }
}

// 使用合并后的命名空间
const rect = new Shapes.Rectangle({ x: 0, y: 0 }, 100, 50);
```

### 3. 现代替代方案

```typescript
// 使用模块替代命名空间（推荐）
export interface Point {
    x: number;
    y: number;
}

export class Circle {
    constructor(public center: Point, public radius: number) {}
}
```

## 三、模块系统详解

### 1. ES 模块标准语法

```typescript
// math.ts
export function add(a: number, b: number): number {
    return a + b;
}

export const PI = 3.1415926;

// app.ts
import { add, PI } from './math';
console.log(add(PI, 10));
```

### 2. 模块类型系统

```typescript
// types.d.ts
declare module "*.vue" {
    import { DefineComponent } from "vue";
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module "lodash" {
    export function shuffle<T>(collection: T[]): T[];
}
```

### 3. 动态导入

```typescript
// 按需加载模块
async function loadModule() {
    const { heavyOperation } = await import('./heavy-module');
    heavyOperation();
}
```

## 四、关键区别与选择标准

### 1. 编译行为差异

```javascript
// 命名空间编译结果（非模块系统）
var Shapes;
(function (Shapes) {
    // 内部代码...
})(Shapes || (Shapes = {}));

// 模块编译结果（ES模块）
export function add(a, b) {
    return a + b;
}
```

### 2. 依赖解析对比

```typescript
// 命名空间（隐式依赖）
/// <reference path="shapes.ts" />
namespace MyApp {
    // 直接使用 Shapes 命名空间
}

// 模块（显式依赖）
import { Circle } from './shapes';
```

### 3. 现代项目选择建议

| 考虑因素             | 选择命名空间          | 选择模块               |
|----------------------|-----------------------|------------------------|
| 项目规模             | 小型/简单             | 中大型/复杂            |
| 目标环境             | 浏览器全局环境        | Node.js/现代前端框架    |
| 代码复用             | 有限复用              | 高复用需求             |
| 构建工具             | 传统打包工具          | Webpack/Rollup/Vite    |
| 类型安全             | 较弱                  | 强类型支持             |

## 五、迁移策略示例

### 从命名空间到模块

```typescript
// 旧版命名空间代码
namespace Utilities {
    export function formatDate(date: Date) {
        return date.toISOString();
    }
}

// 迁移为模块
// utilities.ts
export function formatDate(date: Date) {
    return date.toISOString();
}

// app.ts
import { formatDate } from './utilities';
```

### 混合使用场景（不推荐）

```typescript
// legacy.ts
namespace Legacy {
    export const oldFunc = () => console.log("旧代码");
}

// modern.ts
export function newFunc() {
    import("./legacy").then(({ Legacy }) => {
        Legacy.oldFunc();
    });
}
```

## 六、最佳实践建议

1. **新项目一律使用模块**
   - 默认使用 ES 模块语法
   - 配置 `"module": "ESNext"` 或 `"CommonJS"`

2. **旧项目迁移策略**
   ```typescript
   // 步骤1：添加模块系统支持
   // tsconfig.json
   {
     "compilerOptions": {
       "module": "CommonJS",
       "esModuleInterop": true
     }
   }
   
   // 步骤2：逐步替换命名空间
   ```

3. **模块组织技巧**
   ```typescript
   // 使用模块重导出
   // shapes/index.ts
   export * from './circle';
   export * from './rectangle';
   export * from './point';
   ```

4. **类型声明管理**
   ```typescript
   // 全局类型声明（替代命名空间）
   // global.d.ts
   declare global {
     interface Window {
       myLib: typeof import('./my-lib');
     }
   }
   ```

## 七、通俗总结

"理解命名空间和模块的区别就像规划城市布局：

1. **命名空间是旧城区**：
   - 建筑（代码）挤在一起
   - 道路（依赖）错综复杂
   - 改造困难但兼容旧系统

2. **模块是新开发区**：
   - 每个建筑（模块）独立地块
   - 明确规划的道路系统（导入导出）
   - 易于扩展和维护

**开发口诀**：
'新项目用模块，旧代码保兼容；
全局污染命名空，隔离重用模块中。'

在实际工程中：
- 现代框架（React/Vue）项目必须用模块
- 传统网页脚本可暂时保留命名空间
- 模块通过 tree-shaking 优化打包体积
- 命名空间适合简单的类型声明合并"
