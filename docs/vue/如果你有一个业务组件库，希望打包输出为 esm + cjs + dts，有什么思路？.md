# 如果你需要将一个业务组件库打包输出为 ESM、CJS 和 DTS 格式，你会如何设计构建方案？

**我**（5年经验开发者）：这个问题可以从技术选型、配置实现和产物优化三个层面来回答，我结合具体配置示例说明：

---

### **1. 工具链选型**
```bash
# 推荐工具组合
"devDependencies": {
  "typescript": "^5.0.0",        # 生成d.ts
  "vite": "^4.0.0",              # 构建ESM
  "rollup": "^3.0.0",            # 构建CJS
  "@rollup/plugin-typescript": "^11.0.0" # 处理TS
}
```
**选型理由**：
- Vite 对 ESM 支持最完善（现代浏览器/打包工具首选）
- Rollup 更适合生成 CJS（Node 环境兼容性好）
- TypeScript 原生支持生成 `.d.ts` 声明文件

---

### **2. 多格式输出配置**
```javascript
// vite.config.js (ESM 构建)
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index.esm.js'
    },
    rollupOptions: {
      external: ['vue'] // 排除peerDependencies
    }
  }
})
```

```javascript
// rollup.config.js (CJS 构建)
import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.cjs.js',
    format: 'cjs',
    exports: 'auto'
  },
  plugins: [typescript()],
  external: ['vue']
}
```

```json
// tsconfig.json (DTS 生成)
{
  "compilerOptions": {
    "declaration": true,
    "emitDeclarationOnly": true,
    "outDir": "dist/types"
  }
}
```

---

### **3. 构建脚本优化**
```json
// package.json 示例
{
  "scripts": {
    "build": "run-s build:*",
    "build:types": "tsc",
    "build:esm": "vite build",
    "build:cjs": "rollup -c",
    "prepublishOnly": "npm run build"
  },
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.cjs.js",
      "types": "./dist/types/index.d.ts"
    }
  }
}
```
**关键配置**：
- 使用 `npm-run-all` 并行执行构建任务
- `exports` 字段声明多格式入口
- `prepublishOnly` 确保发布前完整构建

---

### **4. 产物结构示例**
```bash
dist/
├── index.cjs.js       # CommonJS 格式
├── index.esm.js       # ES Module 格式
└── types/
    ├── index.d.ts     # 类型声明
    └── components/    # 组件类型声明
```

---

### **通俗总结（递进式表达）**
1. **"翻译官"比喻**：
   - 源代码就像中文原稿（TS/ES6+）
   - ESM 是英语版本（现代浏览器/打包工具）
   - CJS 是法语版本（Node/旧系统）
   - DTS 是专业术语表（类型定义）

2. **"快餐店"模式**：
   - 厨房（源码）同一套原料
   - 打包机（Vite）出汉堡（ESM）
   - 烤箱（Rollup）出披萨（CJS）
   - 营养表（tsc）自动生成（DTS）

3. **"兼容性金字塔"**：
   - 顶层：ESM（现代应用）
   - 中层：CJS（传统环境）
   - 地基：DTS（类型安全）

（停顿）需要我演示如何为单个组件配置多格式导出吗？
