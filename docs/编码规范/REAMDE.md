## 简介

**组件库`components`（[使用文档](https://shuzihainan.yuque.com/seqbww/cub2b0/muvviz)）与工具库`utils`（[使用文档](https://shuzihainan.yuque.com/seqbww/cub2b0/pmtseg)）已发布为`npm`包**

## 风格指南

### Components

所有的`Component`文件都是以大写开头 (PascalCase)，除了 `index.vue`。参考[vue 风格指南](https://cn.vuejs.org/v2/style-guide/)。

例：

- `@/components/BackToTop/index.vue`
- `@/views/example/components/Button.vue`

### Views

在`views`文件下，代表路由的`.vue`文件都使用横线连接 (kebab-case)，代表路由的文件夹也是使用同样的规则。

例：

- `@/views/error-page/index.vue`
- `@/views/home/page-one.vue`

### JS 文件

`.js`文件都遵循横线连接 (kebab-case)，`@/store/modules`中`.js`文件可使用小驼峰命名法。

例：

- `@/utils/open-window.js`
- `@/store/modules/tagsView.js`

## 注意事项

- **若不使用 tagViews 组件，建议将 AppMain 中的 keepAlive 移除。**
- **不适用缓存的路由页面，需在路由 meta 中添加 noCache。**
- **`@/src/settings.js`文件中包含部分配置开关**
- **element-ui 组件的引入在`el-loader.js`中**
- **项目使用`dayjs`代替`moment`**
- **图标可使用`svg`格式，同时可使用`svgo`命令来压缩精简`@/icons/svg`文件**
- **当路由过多时，可在`@/router`中新建`modules`文件夹，将路由定义在`modules`中后再引入到`index.js`**

## 关于代码提交规范

参考[https://www.conventionalcommits.org](https://www.conventionalcommits.org/)

### 可自行输入规范化 commit 或执行 `yarn commit` 调用规范提交工具

Commit message 都包括三个部分：Header，Body 和 Footer

```
<type>(<scope>): <subject>
// 空一行
<body>
// 空一行
<footer>
```

简易提交示例：
`feat: initial commit`

Header 是必需的，Body 和 Footer 可以省略。

### Header 包括三个字段：`type`（必需）、`scope`（可选）和`subject`（必需）。

1. type

   `type`用于说明 commit 的类别

   ```
   feat：新功能（feature）
   fix：修补bug
   docs：文档（documentation）
   style：代码格式（不影响代码运行的变动）
   refactor：重构（即不是新增功能，也不是修改bug的代码变动）
   test：增加测试
   perf：优化性能
   revert：代码回滚
   chore：构建过程或辅助工具的变动，非src和test文件变动
   ci：更改持续集成软件的配置文件和package中的scripts命令，例如scopes: Travis, Circle等
   build：变更项目构建或外部依赖（例如scopes: webpack、gulp、npm等）
   ```

2. scope

   `scope`用于说明 commit 影响的范围

3. subject

   `subject`是 commit 目的的简短描述，不超过 50 个字符

   ```
   以动词开头，使用第一人称现在时，比如change，而不是changed或changes
   第一个字母小写
   结尾不加句号（.）
   ```

### Body 部分是对本次 commit 的详细描述，可以分成多行

### Footer 部分只用于两种情况

1. 不兼容变动

   如果当前代码与上一个版本不兼容，则 Footer 部分以`BREAKING CHANGE`开头，后面是对变动的描述、以及变动理由和迁移方法。

2. 关闭 Issue

   如果当前 commit 针对某个 issue，那么可以在 Footer 部分关闭这个 issue 。

### 参考链接

[vue-element-admin](https://panjiachen.github.io/vue-element-admin-site/zh/guide/)
