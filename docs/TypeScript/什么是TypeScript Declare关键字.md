# TypeScript `declare` 关键字详解

## 可用环境代码

```typescript
// 这里将展示 declare 的各种使用场景
```

## 回答

面试官您好，我来详细介绍一下 TypeScript 中的 `declare` 关键字，这是 TypeScript 类型系统中一个非常重要但容易被忽视的特性。

### 1. `declare` 的基本概念

`declare` 关键字用于告诉 TypeScript 编译器："这个实体已经存在，不需要你操心它的实现，只需要知道它的类型信息"。

```typescript
// 声明一个已存在的全局变量
declare const __VERSION__: string;

// 使用这个变量
console.log(`App version: ${__VERSION__}`);
```

### 2. 主要使用场景

#### 2.1 声明全局变量

当我们需要使用在运行时存在但 TypeScript 不知道的全局变量时：

```typescript
// 声明全局变量
declare const process: {
  env: {
    NODE_ENV: 'development' | 'production';
    API_KEY?: string;
  };
};

// 使用
if (process.env.NODE_ENV === 'development') {
  console.log('开发模式');
}
```

#### 2.2 声明第三方库类型

当使用没有类型定义的第三方库时：

```typescript
// 声明一个未类型化的模块
declare module 'untyped-module' {
  export function doSomething(value: number): string;
  export const importantValue: boolean;
}

// 使用
import { doSomething } from 'untyped-module';
doSomething(42);
```

#### 2.3 声明命名空间

为复杂对象提供类型声明：

```typescript
// 声明命名空间
declare namespace MyLib {
  interface Config {
    debug: boolean;
    timeout: number;
  }
  function init(config: Config): void;
}

// 使用
const config: MyLib.Config = {
  debug: true,
  timeout: 5000
};
MyLib.init(config);
```

### 3. 实际开发中的典型应用

#### 3.1 扩展 Window 对象

```typescript
// 扩展 Window 类型
declare global {
  interface Window {
    myApp: {
      version: string;
      init(config: Record<string, any>): void;
    };
  }
}

// 使用
window.myApp = {
  version: '1.0.0',
  init(config) {
    console.log('App initialized with', config);
  }
};
```

#### 3.2 为 JSON 文件提供类型

```typescript
// 声明JSON模块类型
declare module '*.json' {
  const value: {
    [key: string]: any;
  };
  export default value;
}

// 使用
import data from './config.json';
console.log(data.apiUrl);
```

### 4. 高级用法：条件类型声明

```typescript
// 根据环境声明不同的类型
declare const IS_BROWSER: boolean;

declare namespace Platform {
  export type FileSystem = IS_BROWSER extends true 
    ? BrowserFileSystem 
    : NodeFileSystem;
}

interface BrowserFileSystem {
  readFile: (blob: Blob) => Promise<string>;
}

interface NodeFileSystem {
  readFile: (path: string) => Promise<string>;
}
```

### 5. 完整可运行示例

```typescript
// global.d.ts
declare module 'custom-elements' {
  export class FancyButton extends HTMLElement {
    glowColor: string;
    setDanger(): void;
  }
}

// app.ts
import { FancyButton } from 'custom-elements';

const button = new FancyButton();
button.glowColor = 'red';
button.setDanger();

// 扩展现有模块
declare module 'react' {
  interface HTMLAttributes<T> {
    'custom-attr'?: string;
  }
}

// 使用扩展的属性
<div custom-attr="value">Content</div>
```

## 通俗易懂的总结

可以把 `declare` 关键字想象成**给 TypeScript 的说明书**：

1. **介绍信**：`declare` 就像一封介绍信，告诉 TypeScript："这个家伙（变量/函数/类）我认识，它的特征是这样的..."
   
2. **空头支票**：只声明类型不提供实现，就像签了合同但还没执行

3. **翻译官**：当遇到非 TypeScript 代码（如 JS 库、全局变量）时，`declare` 帮助 TypeScript 理解它们

**关键点记忆**：
- `declare` 只存在于编译时，运行时会被完全移除
- 它不会产生任何实际的 JavaScript 代码
- 主要用于类型定义文件（.d.ts）和环境声明
- 让 TypeScript 能够理解现有的 JavaScript 代码

## 最佳实践建议

1. **适度使用**：只在需要描述现有 JavaScript 代码时使用
2. **集中管理**：将全局声明放在 `global.d.ts` 或类似文件中
3. **优先使用类型定义**：尽量使用 `@types/` 包而不是自己声明
4. **配合三斜线指令**：使用 `/// <reference path="..." />` 引入声明文件
5. **及时更新**：随着依赖库更新，相应更新声明

通过合理使用 `declare`，我们可以让 TypeScript 更好地与现有 JavaScript 生态协作，同时保持类型安全的所有优势。
