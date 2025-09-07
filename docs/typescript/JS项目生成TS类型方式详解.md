---
titleTemplate: TS
bracketEscaping: true
---

要从一个 `.js` 文件生成对应的 `.d.ts`（TypeScript 类型声明）文件，通常有两种方式：

---

## 一、🔧 方法一：使用 TypeScript 自动从 JS 文件生成 `.d.ts`（通过 JSDoc 注释 + `allowJs` + `checkJs`）

这是**推荐的方式**，你可以在现有的 JavaScript 项目中逐步加入 TypeScript 类型支持，并让 TypeScript 根据 JSDoc 自动生成类型声明文件（`.d.ts`）。

---

## ✅ 示例项目结构

我们创建一个简单的示例项目，包含：

```
my-js-to-dts-project/
├── src/
│   ├── myModule.js         ← 你的原始 JS 模块
│   └── myModule.d.ts       ← （自动生成或手动补充）
├── tsconfig.json           ← TypeScript 配置文件
├── package.json
└── README.md
```

---

## 1️⃣ 项目初始化

```bash
mkdir my-js-to-dts-project
cd my-js-to-dts-project
npm init -y
```

---

## 2️⃣ 创建一个 JS 模块（src/myModule.js）

这是一个你想要提供类型声明的普通 JavaScript 文件：

```javascript
// src/myModule.js

/**
 * 表示一个用户对象
 * @typedef {Object} User
 * @property {string} name - 用户名称
 * @property {number} age - 用户年龄
 */

/**
 * 创建一个问候语
 * @param {string} name - 用户名
 * @returns {string} 问候字符串
 */
function sayHello(name) {
  return `Hello, ${name}！`;
}

/**
 * 获取用户信息
 * @param {User} user - 用户对象
 * @returns {string}
 */
function getUserInfo(user) {
  return `${user.name} is ${user.age} years old.`;
}

// 导出函数（CommonJS 风格，适用于 Node.js）
module.exports = {
  sayHello,
  getUserInfo,
};
```

> ✅ 注意：我们使用了 **JSDoc 注释** 来描述类型，这是 TypeScript 能理解的方式，即使你写的是 `.js` 文件！

---

## 3️⃣ 创建 `tsconfig.json`

在项目根目录下创建 `tsconfig.json`，用来让 TypeScript 编译器根据 JS 文件生成类型信息或者检查类型（即使你不编译 JS）。

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "moduleResolution": "node",
    "strict": false,
    "esModuleInterop": true,
    "allowJs": true,        // 允许导入/检查 .js 文件
    "checkJs": true,        // 对 .js 文件进行类型检查（基于 JSDoc）
    "declaration": false,   // 不自动为 JS 生成 .d.ts，但我们可以手动或通过工具生成
    "outDir": "./dist",     // （可选）如果你要编译 JS，可以输出到这里
    "rootDir": "./src"      // 源码目录
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

> ❗ 注意：
> - `allowJs: true`：允许 TypeScript 处理 JS 文件。
> - `checkJs: true`：让 TS 根据 JSDoc 检查 JS 文件中的类型。
> - **默认情况下，TypeScript 不会自动为 JS 文件生成 `.d.ts` 文件**，但可以通过工具（如 `dts-gen` 或 `tsc --declaration` 对 TS 文件）来生成。

---

## 4️⃣ 如何生成 `.d.ts` 文件？（重点！）

### ✅ 方式 A：**手动编写 `.d.ts` 文件（推荐用于库作者）**

在 `src/` 目录下新建一个 `myModule.d.ts` 文件，内容如下：

```typescript
// src/myModule.d.ts

export declare function sayHello(name: string): string;

export declare function getUserInfo(user: {
  name: string;
  age: number;
}): string;
```

> 这是最标准的 `.d.ts` 文件，它清晰地描述了模块的类型，其他 TypeScript 项目引入该 JS 模块时会得到类型提示。

然后你可以：
- 把 `myModule.js` 和 `myModule.d.ts` 一起发布为 npm 包，别人引入时就有类型提示了！
- 或者你继续用 JS，但把 `.d.ts` 放旁边，TypeScript 项目也能识别类型。

---

### ✅ 方式 B：**使用 tsc 为 TypeScript 文件生成 .d.ts（如果你愿意将 JS 转成 TS）**

如果你将 `myModule.js` 重命名为 `myModule.ts`，并且写成 TypeScript 语法，那么运行：

```bash
npx tsc --declaration --emitDeclarationOnly
```

就会为每个 TS 文件生成一个 `.d.ts` 文件。

但因为我们这里是 `.js` 文件，所以**不能直接用 tsc 生成 `.d.ts`**，除非你借助工具。

---

### ✅ 方式 C：**使用 `dts-gen` 工具（适用于已有 JS 库，快速生成初始 .d.ts）**

如果你有一个较大的 JS 库，想快速生成一个初始的 `.d.ts` 文件，可以使用微软官方的 https://github.com/microsoft/dts-gen 工具：

```bash
npx dts-gen -m myModule
```

不过它更多用于**已发布的 npm 包**，会根据入口文件生成一个初始的 `.d.ts` 模板，你还需要手动完善。

---

## 5️⃣ 如何在 TypeScript 项目中使用这个 JS + JSDoc 模块？

假设你有一个 TypeScript 项目，想引入上面这个 `myModule.js`，并且希望有类型提示：

### ① TypeScript 项目安装你的 JS 模块（或本地引用）

如果你只是在本地测试：

**app.ts**
```typescript
// 引入你的 JS 模块
import { sayHello, getUserInfo } from './src/myModule.js';

const msg = sayHello('Alice');
console.log(msg);

const user = { name: 'Bob', age: 30 };
console.log(getUserInfo(user));
```

### ② tsconfig.json（TypeScript 项目的配置）

确保你的 TypeScript 项目也开启了 `allowJs`，或者直接引用 `.d.ts` 文件。

---

## ✅ 总结：从 .js 到 .d.ts 的推荐流程

| 场景 | 方法 | 是否自动生成 .d.ts | 适用性 |
|------|------|------------------|--------|
| 你有一个 JS 模块，想为它提供类型（供自己或他人使用 TypeScript 时获得提示） | ✅ 写 JSDoc + 创建 `.d.ts` 文件 | ❌ 手动写 | ⭐⭐⭐⭐⭐（推荐） |
| 你希望 TypeScript 检查你的 JS 文件中的类型 | ✅ tsconfig.json 中设置 `"allowJs": true, "checkJs": true` | ❌ 不生成.d.ts，只做检查 | ⭐⭐⭐ |
| 你有一个已有的 JS 库，想为它生成初始类型声明文件 | ✅ 使用 `dts-gen` 工具 | ✅（生成初始模板） | ⭐⭐⭐ |
| 你想把 JS 项目逐步迁移到 TS，并自动生成类型 | ✅ 逐步重写为 `.ts`，用 `tsc --declaration` 生成 `.d.ts` | ✅ | ⭐⭐⭐⭐ |

---

## 🧩 BONUS：如何发布带有类型的 NPM JS 模块？

如果你要把这个 JS 模块发布到 npm，并希望别人在使用时能获得 TypeScript 类型提示，只需要：

1. 在模块根目录放一个 `myModule.js` 和一个同名的 `myModule.d.ts`。
2. 确保 `package.json` 中有以下字段：

```json
{
  "name": "my-module",
  "main": "src/myModule.js",
  "types": "src/myModule.d.ts",  // ← 告诉 TS 编译器去哪里找类型声明
  "version": "1.0.0"
}
```

这样，当别人用 TypeScript `import` 你的模块时，就会有类型提示！

---

## 📦 项目源码结构回顾

```
my-js-to-dts-project/
├── src/
│   ├── myModule.js          # 你的 JS 模块，带 JSDoc 类型注释
│   └── myModule.d.ts        # （可选）你手写的类型声明文件
├── tsconfig.json            # TypeScript 配置
├── package.json
```

---

## ✅ 如果你想要我帮你生成一个完整的可运行示例项目代码包（含 JS + TS + 配置），请告诉我，我可以为你整理成 ZIP 或 GitHub 模板仓库格式！

---

## 🙌 总结一句话：

> **想从 .js 文件生成 .d.ts 文件，最实用的方式是：**
> 
> 1. **在 JS 文件中写 JSDoc 类型注释**
> 2. **手动或通过工具创建一个配套的 .d.ts 文件**
> 3. **或者将 JS 逐步迁移到 TS，利用 tsc 自动生成 .d.ts**

---

如你想要我为你生成一个完整的 GitHub 模板项目或者脚手架，也可以继续问我！ 😊
