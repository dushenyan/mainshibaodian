# Prettier 代码格式化工具

Prettier 是一个支持多种语言的 **opinionated** 代码格式化工具，可以集成到多种编辑器中，支持少量的配置。

所谓 "opinionated"（固执己见的），是指 Prettier 的配置都是预设好的，不支持过多的自由配置（类似于 Mac，硬件配置是固定的，不支持用户自行升级）。

## 1. 工作原理

Prettier 的原理很简单：
1. 将代码解析为抽象语法树（AST）- AST 与代码风格无关
2. 根据 AST 按照 Prettier 的风格重新输出代码

想要查看 Prettier 的转化过程，可以访问官方提供的[在线检测网站](https://prettier.io/playground/)。

## 2. 官方资源

- 中文官网：https://www.prettier.cn/
- 在线格式化工具：https://prettier.io/playground/

## 3. 安装方式

### 3.1 基础安装

使用 pnpm 安装：

```bash
# 使用 npm
pnpm install --save-dev --save-exact prettier
```

> 将会在 `package.json` 中添加 `prettier` 精确版本 无附加 **^** 或 **~**

### 3.2 配置文件

安装后需要创建配置文件和忽略文件。
Prettier 支持多种配置文件格式：

- 在 `package.json` 中添加 `prettier` 对象
- `.prettierrc` 文件（JSON 或 YAML 格式）
- `.prettierrc.json`、`.prettierrc.yml`、`.prettierrc.yaml` 或 `.prettierrc.json5` 文件
- `.prettierrc.js`、`.prettierrc.cjs`、`prettier.config.js` 或 `prettier.config.cjs` 文件（需使用 `module.exports` 导出对象）
- `prettierrc.toml` 文件

## 4. 配置说明

### 4.1 操作目录

所有操作应在**主工程目录**下进行。

### 4.2 配置示例 (此处的规则供参考，其中多半是默认值，可根据个人习惯修改)

```javascript
// .prettierrc.js
module.exports = {
  printWidth: 80, // 单行长度
  tabWidth: 2, // 缩进长度
  useTabs: false, // 使用空格代替 tab 缩进
  semi: true, // 句末使用分号
  singleQuote: true, // 使用单引号
  quoteProps: 'as-needed', // 仅在必需时为对象的 key 添加引号
  jsxSingleQuote: true, // JSX 中使用单引号
  trailingComma: 'all', // 多行时尽可能打印尾随逗号
  bracketSpacing: true, // 在对象前后添加空格 - eg: { foo: bar }
  jsxBracketSameLine: true, // 多属性 HTML 标签的 '>' 折行放置
  arrowParens: 'always', // 单参数箭头函数参数周围使用圆括号 - eg: (x) => x
  requirePragma: false, // 无需顶部注释即可格式化
  insertPragma: false, // 在已被 prettier 格式化的文件顶部加上标注
  proseWrap: 'preserve', // Markdown 文件的折行方式
  htmlWhitespaceSensitivity: 'ignore', // 对 HTML 全局空白不敏感
  vueIndentScriptAndStyle: false, // 不对 Vue 中的 script 及 style 标签缩进
  endOfLine: 'lf', // 结束行形式
  embeddedLanguageFormatting: 'auto', // 对引用代码进行格式化
};
```

### .prettierignore 忽略文件

**.prettierignore忽略文件格式化**

```
.DS_Store
node_modules
/dist

# local env files
.env.local
.env.*.local

# Log files
**/*.log*

# Editor directories and files
.idea
.vscode
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# others 
package.json
package-lock.json
.prettierrc
.prettierignore
.gitignore

*.md
```

## 5. 命令行使用

### 5.1 格式化全部文档

```bash
# 使用 npx
npx prettier --write .
```

### 5.2 格式化指定文档

```bash
# 使用 npx
npx prettier --write src/components/Button.js
```

### 5.3 检查文档是否已格式化

```bash
# 使用 npx
npx prettier --check .
```

## 6. 编辑器集成

### 6.1 支持的编辑器及插件

| 编辑器       | 插件名                    |
| ------------ | ------------------------- |
| VS Code      | Prettier - Code formatter |
| Vim          | vim-prettier              |
| Sublime Text | JsPrettier                |

### 6.2 VSCode 配置示例

首先安装 [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) 扩展。

### 6.2.1 配置步骤

1. 使用快捷键 `⇧ + ⌘ + P` 启动 Command Palette
2. 搜索 "Format Document With" 并选择 "Configure Default Formatter"
3. 选择 "Prettier - Code formatter"

### 6.2.2 如需在保存时自动格式化：
1. 使用 `⌘ + ,` 打开设置页面
2. 搜索并启用 "Format On Save" 选项

完整的 VS Code 配置示例（`settings.json`）：

```json
{
  "editor.formatOnSave": true,
  // Prettier 默认支持多种文件类型（如 .js 、 .ts 、 .html 、 .css 等）
  // "editor.defaultFormatter": "esbenp.prettier-vscode"
  // Prettier 配置
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  /* Prettier 的配置 */
  "prettier.printWidth": 100, // 超过最大值换行
  "prettier.tabWidth": 4, // 缩进字节数
  "prettier.useTabs": false, // 缩进不使用 tab，使用空格
  "prettier.semi": true, // 句尾添加分号
  "prettier.singleQuote": true, // 使用单引号代替双引号
  "prettier.proseWrap": "preserve", // 默认值。因为使用了一些折行敏感型的渲染器（如 GitHub comment）而按照 markdown 文本样式进行折行
  "prettier.arrowParens": "avoid", // (x) => {} 箭头函数参数只有一个时是否要有小括号。avoid：省略括号
  "prettier.bracketSpacing": true, // 在对象，数组括号与文字之间加空格 "{ foo: bar }"
  "prettier.disableLanguages": ["vue"], // 不格式化 vue 文件，vue 文件的格式化单独设置
  "prettier.endOfLine": "auto", // 结尾是 \n \r \n\r auto
  "prettier.htmlWhitespaceSensitivity": "ignore",
  "prettier.ignorePath": ".prettierignore", // 不使用 prettier 格式化的文件填写在项目的 .prettierignore 文件中
  "prettier.jsxBracketSameLine": false, // 在 jsx 中把 '>' 是否单独放一行
  "prettier.jsxSingleQuote": false, // 在 jsx 中使用单引号代替双引号
  "prettier.requireConfig": false, // Require a 'prettierconfig' to format prettier
  "prettier.trailingComma": "es5" // 在对象或数组最后一个元素后面是否加逗号（在 ES5 中加尾逗号）
}
```

> 注意：`settings.json` 中的配置对所有项目生效，您也可以在项目中创建 Prettier 的配置文件进行覆盖。


### 6.2.3 ESLint 配合

解决方案是安装 `eslint-config-prettier`，并在 ESLint 的配置文件中添加到 `extends`：

```json
// .eslintrc.json
{
  "extends": ["eslint:recommended", "prettier"]
}
```

## 特殊配置

如果您不喜欢 Prettier 将 HTML、Vue 模板或 JSX 等的默认配置 `"whitespace-sensitive": "css"` 格式化时把一对尖括号分为两行：

```html
<!-- input -->
<span class="dolorum atque aspernatur">Est molestiae sunt facilis qui rem.</span>
<div class="voluptatem architecto at">Architecto rerum architecto incidunt sint.</div>

<!-- output -->
<span class="dolorum atque aspernatur"
  >Est molestiae sunt facilis qui rem.</span
>
<div class="voluptatem architecto at">
  Architecto rerum architecto incidunt sint.
</div>
```

可以配置 Prettier 的 `whitespace-sensitive` 选项为 `ignore`。

## 参考链接

1. https://juejin.cn/post/6938687606687432740
2. https://segmentfault.com/a/1190000012909159
