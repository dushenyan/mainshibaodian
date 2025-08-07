# 纯 TypeScript 项目中使用路径别名 (Alias Path) 的完整指南

在纯 TypeScript 项目中配置路径别名可以显著提高代码可维护性和导入语句的可读性。以下是详细的配置步骤：

## 1. 基础配置

### 1.1 修改 `tsconfig.json`

首先需要在 TypeScript 配置文件中添加 `paths` 配置：

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"],
      "@styles/*": ["src/styles/*"]
    }
  }
}
```

**关键参数说明**：
- `baseUrl`: 设置解析非相对路径的基准目录
- `paths`: 定义路径映射规则

## 2. 模块解析配置

### 2.1 安装依赖

虽然纯 TS 项目不需要打包工具，但为了确保模块解析正常工作，建议安装：

```bash
npm install --save-dev tsconfig-paths
```

### 2.2 创建自定义模块加载器

创建 `loader.ts` 文件来初始化路径别名：

```typescript
import { register } from 'tsconfig-paths'
import { resolve } from 'path'

const tsConfig = require('./tsconfig.json')

register({
  baseUrl: tsConfig.compilerOptions.baseUrl,
  paths: tsConfig.compilerOptions.paths
})
```

### 2.3 修改启动脚本

在 `package.json` 中修改启动脚本：

```json
{
  "scripts": {
    "start": "node -r ./loader.js src/index.ts",
    "test": "node -r ./loader.js node_modules/jest/bin/jest.js"
  }
}
```

## 3. 测试配置

### 3.1 编写测试用例

```typescript
// src/utils/math.test.ts
import { add } from '@utils/math'

test('adds 1 + 2 to equal 3', () => {
  expect(add(1, 2)).toBe(3)
})
```

### 3.2 配置 Jest

如果使用 Jest，需要在 `jest.config.js` 中添加：

```javascript
module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1'
  }
}
```

## 4. 高级配置

### 4.1 多环境支持

创建 `tsconfig.paths.json` 专门存放路径配置：

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@shared/*": ["src/shared/*"]
    }
  }
}
```

然后在主 `tsconfig.json` 中继承：

```json
{
  "extends": "./tsconfig.paths.json",
  "compilerOptions": {
    // 其他配置...
  }
}
```

### 4.2 VS Code 智能提示

在 `.vscode/settings.json` 中添加：

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

## 5. 完整示例项目结构

```
project-root/
├── src/
│   ├── components/
│   │   └── Button.tsx
│   ├── utils/
│   │   └── math.ts
│   └── index.ts
├── loader.ts
├── tsconfig.json
├── jest.config.js
└── package.json
```

**使用示例**：

```typescript
// src/index.ts
import { Button } from '@components/Button'
import { add } from '@utils/math'

console.log(add(1, 2))
Button.render()
```

## 6. 常见问题解决

### 6.1 类型检查通过但运行时找不到模块

确保在运行前已正确加载 `loader.ts`，或在运行时使用绝对路径：

```typescript
import { add } from 'src/utils/math' // 回退方案
```

### 6.2 Jest 测试失败

检查 `jest.config.js` 中的 `moduleNameMapper` 是否与 `tsconfig.json` 中的 `paths` 一致。

### 6.3 VS Code 无法解析路径

1. 重启 TypeScript 服务：`Ctrl+Shift+P` > "Restart TS server"
2. 确保工作区使用的是项目本地的 TypeScript 版本

## 7. 最佳实践建议

1. **保持一致性**：全项目统一使用路径别名
2. **合理划分**：按功能模块而非文件类型组织路径别名
3. **避免过度**：只对常用路径设置别名
4. **文档说明**：在 README 中记录项目使用的路径别名
5. **团队共享**：将配置提交到版本控制系统

通过以上配置，您的纯 TypeScript 项目将拥有清晰、可维护的模块导入系统，同时保持开发环境的流畅体验。
