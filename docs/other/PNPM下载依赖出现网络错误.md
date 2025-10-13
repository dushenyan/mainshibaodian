这个错误 `ERR_INVALID_THIS` 通常是由于 Node.js 版本兼容性问题或网络配置问题导致的。以下是几种解决方案：

## 解决方案

### 1. 检查 Node.js 版本
首先确认你的 Node.js 版本是否兼容：

```bash
node --version
```

jsdoc-to-markdown 需要 Node.js >= 10，建议使用 LTS 版本（如 16.x, 18.x, 20.x）。

### 2. 清除缓存并重试
```bash
# 清除 pnpm 缓存
pnpm store prune

# 或者清除 npm 缓存（如果使用 npm）
npm cache clean --force

# 然后重试安装
pnpm add -D jsdoc-to-markdown
```

### 3. 使用不同的包管理器尝试
如果 pnpm 持续出现问题，可以尝试使用 npm 或 yarn：

```bash
# 使用 npm
npm install -D jsdoc-to-markdown

# 或使用 yarn
yarn add -D jsdoc-to-markdown
```

### 4. 检查网络配置
这个错误可能与网络代理或防火墙设置有关：

```bash
# 检查网络连接
ping registry.npmmirror.com

# 如果使用代理，确保配置正确
echo $HTTP_PROXY
echo $HTTPS_PROXY

# 或者暂时禁用代理
unset HTTP_PROXY
unset HTTPS_PROXY
```

### 5. 使用不同的镜像源
尝试切换 npm 镜像源：

```bash
# 使用官方源
pnpm config set registry https://registry.npmjs.org

# 或使用淘宝镜像
pnpm config set registry https://registry.npmmirror.com

# 然后重试安装
pnpm add -D jsdoc-to-markdown
```

### 6. 检查项目配置
确保 `package.json` 中没有冲突的配置：

```json
{
  "dependencies": {},
  "devDependencies": {
    "jsdoc-to-markdown": "^7.1.1"
  }
}
```

### 7. 如果问题持续存在
如果以上方法都不奏效，可以考虑：

1. **使用替代方案**：考虑使用其他文档生成工具如 `typedoc` 或 `documentation.js`
2. **手动下载**：从 GitHub 直接下载源码
3. **联系维护者**：在 jsdoc-to-markdown 的 GitHub issues 中报告问题

### 临时解决方案
作为临时解决方案，你可以先跳过这个依赖，或者使用较旧的稳定版本：

```bash
pnpm add -D jsdoc-to-markdown@6.0.0
```

尝试这些解决方案，通常清除缓存和检查网络配置可以解决大部分 `ERR_INVALID_THIS` 错误。
