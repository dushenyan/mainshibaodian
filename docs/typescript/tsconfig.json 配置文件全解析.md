# tsconfig.json 配置文件全解析 (TypeScript 4.9+)

## 一、基础配置结构

```json
{
  "compilerOptions": {
    /* 基本选项 */
    "target": "es5",
    "module": "commonjs",
    "lib": ["es6", "dom"],
    
    /* 严格类型检查 */
    "strict": true,
    
    /* 模块解析 */
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    },
    
    /* 输出控制 */
    "outDir": "./dist",
    "rootDir": "./src",
    
    /* 其他配置 */
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

## 二、核心配置详解

### 1. 编译目标配置

| 属性 | 值示例 | 中文解释 | 特点说明 |
|------|--------|----------|----------|
| `target` | `"es5"` | 目标ECMAScript版本 | 控制输出JS语法版本，可选：`es3`/`es5`/`es6`/`es2015`-`es2022`/`esnext` |
| `module` | `"commonjs"` | 模块系统类型 | 决定模块语法，常用：`commonjs`(Node)、`es2015`/`esnext`(浏览器) |
| `lib` | `["es6", "dom"]` | 内置库声明 | 指定包含的内置API类型声明，如DOM/BOM/ES特性 |

**示例**：
```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "esnext",
    "lib": ["es2020", "dom", "dom.iterable"]
  }
}
```

### 2. 路径与模块解析

| 属性 | 值示例 | 中文解释 | 特点说明 |
|------|--------|----------|----------|
| `baseUrl` | `"./"` | 基础路径 | 解析非相对模块的基准目录 |
| `paths` | `{"@/*":["src/*"]}` | 路径映射 | 设置模块路径别名 |
| `moduleResolution` | `"node"` | 模块解析策略 | `node`(Node.js方式)/`classic`(旧版TS方式) |
| `typeRoots` | `["./typings"]` | 类型声明根目录 | 覆盖默认的`@types`查找位置 |

**示例**：
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"]
    },
    "moduleResolution": "node"
  }
}
```

### 3. 严格类型检查

| 属性 | 值示例 | 中文解释 | 特点说明 |
|------|--------|----------|----------|
| `strict` | `true` | 严格模式总开关 | 启用所有严格检查 |
| `noImplicitAny` | `true` | 禁止隐式any | 必须显式声明any类型 |
| `strictNullChecks` | `true` | 严格null检查 | null/undefined需明确处理 |
| `strictFunctionTypes` | `true` | 严格函数类型 | 函数参数逆变检查 |
| `strictBindCallApply` | `true` | 严格bind/call/apply | 检查参数匹配 |
| `strictPropertyInitialization` | `true` | 严格属性初始化 | 类属性必须初始化 |

**示例**：
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### 4. 输出控制

| 属性 | 值示例 | 中文解释 | 特点说明 |
|------|--------|----------|----------|
| `outDir` | `"dist"` | 输出目录 | 编译后文件输出位置 |
| `rootDir` | `"src"` | 根目录 | 控制输入文件结构 |
| `outFile` | `"bundle.js"` | 单文件输出 | 合并为单个文件(需module为amd/system) |
| `removeComments` | `true` | 移除注释 | 删除编译后注释 |
| `declaration` | `true` | 生成声明文件 | 产出`.d.ts`类型文件 |
| `sourceMap` | `true` | 生成sourcemap | 调试时映射源码 |

**示例**：
```json
{
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "declaration": true,
    "sourceMap": true
  }
}
```

### 5. JavaScript相关

| 属性 | 值示例 | 中文解释 | 特点说明 |
|------|--------|----------|----------|
| `allowJs` | `true` | 允许JS文件 | 编译JS文件 |
| `checkJs` | `true` | 检查JS文件 | 对JS文件进行类型检查 |
| `jsx` | `"react"` | JSX处理 | 控制JSX编译方式 |
| `jsxFactory` | `"h"` | JSX工厂函数 | 自定义JSX转换函数 |

**示例**：
```json
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "jsx": "react-jsx",
    "jsxImportSource": "preact"
  }
}
```

### 6. 高级配置

| 属性 | 值示例 | 中文解释 | 特点说明 |
|------|--------|----------|----------|
| `esModuleInterop` | `true` | ES模块互操作 | 改善CommonJS/ES模块兼容性 |
| `skipLibCheck` | `true` | 跳过库检查 | 忽略声明文件类型检查 |
| `forceConsistentCasingInFileNames` | `true` | 强制文件名大小写一致 | 防止大小写问题 |
| `isolatedModules` | `true` | 独立模块编译 | 确保单文件可编译 |
| `useDefineForClassFields` | `true` | 使用标准类字段 | 符合ECMAScript标准类字段定义 |

**示例**：
```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

## 三、完整配置案例

### 1. Node.js项目配置

```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "lib": ["es2020"],
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts"]
}
```

### 2. 前端React项目配置

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "esnext",
    "lib": ["dom", "dom.iterable", "esnext"],
    "jsx": "react-jsx",
    "strict": true,
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "allowJs": true,
    "noEmit": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

### 3. 库开发配置

```json
{
  "compilerOptions": {
    "target": "es2015",
    "module": "esnext",
    "lib": ["es2015", "dom"],
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "moduleResolution": "node",
    "composite": true,
    "incremental": true
  },
  "include": ["src"],
  "references": [
    { "path": "../shared" }
  ]
}
```

## 四、特殊配置说明

### 1. 增量编译

```json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo"
  }
}
```
- `incremental`: 启用增量编译
- `tsBuildInfoFile`: 指定增量编译信息文件位置

### 2. 项目引用

```json
{
  "references": [
    { "path": "../core" },
    { "path": "../utils" }
  ]
}
```
- 用于monorepo项目结构
- 支持跨项目类型引用

### 3. 编译器插件

```json
{
  "compilerOptions": {
    "plugins": [
      { "name": "typescript-plugin-css-modules" }
    ]
  }
}
```
- 扩展TypeScript功能
- 需要额外安装插件

## 五、最佳实践建议

1. **严格模式优先**：
   ```json
   "strict": true
   ```

2. **按环境选择target**：
   - Node.js: `es2020`
   - 浏览器: `es5` 或 `es2015`

3. **路径别名推荐**：
   ```json
   "baseUrl": ".",
   "paths": {
     "@/*": ["src/*"]
   }
   ```

4. **库开发必备**：
   ```json
   "declaration": true,
   "declarationMap": true
   ```

5. **现代前端项目**：
   ```json
   "jsx": "react-jsx",
   "module": "esnext"
   ```

6. **性能优化**：
   ```json
   "incremental": true,
   "skipLibCheck": true
   ```

通过合理配置tsconfig.json，可以显著提升TypeScript项目的开发体验和代码质量。建议根据项目类型选择合适的预设配置，再根据具体需求进行调整。
