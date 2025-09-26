# ESLint 简介

ESLint 是一个开源的 JavaScript 代码检查工具，使用 Node.js 编写，由 Nicholas C. Zakas 于 2013 年 6 月创建。ESLint 的初衷是为了让程序员可以创建自己的检测规则，使其可以在编码的过程中发现问题而不是在执行的过程中。ESLint 的所有规则都被设计成可插入的，为了方便使用，ESLint 内置了一些规则，在这基础上也可以增加自定义规则。

## 官方资源

- 中文官网：http://eslint.cn/
- 配置文档：http://eslint.cn/docs/user-guide/configuring
- 规则列表：http://eslint.cn/docs/rules/

## 安装指南

### 本地安装（推荐）

如果您希望将 ESLint 作为项目构建系统的一部分，建议在项目根目录进行本地安装：

```bash
npm install eslint --save-dev
```

### 全局安装

如果您希望 ESLint 适用于所有项目，可以使用全局安装：

```bash
npm install -g eslint
```

### 初始化配置

安装完成后，使用以下命令生成配置文件：

```bash
eslint --init
```

按照提示选择自定义代码风格，设置完成后会生成 `.eslintrc.js` 配置文件。

## 配置详解

### 默认配置示例

```javascript
module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ]
    }
};
```

### 环境配置

使用 `env` 属性指定要启用的环境，将其设置为 `true`，以确保在进行代码检测时不会把预定义的全局变量识别成未定义的变量而报错：

```javascript
"env": {
    "browser": true,
    "commonjs": true,
    "es6": true,
    "jquery": true
}
```

### 解析器选项

默认情况下，ESLint 支持 ECMAScript 5 语法。如果需要启用对其他版本或 JSX 的支持，可以使用 `parserOptions` 属性指定：

```javascript
"parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
        "jsx": true
    }
}
```

### 规则配置

`"extends": "eslint:recommended"` 表示启用推荐规则。在此基础上可以通过 `rules` 添加自定义规则，每个规则的第一个值代表错误级别：

- `"off"` 或 `0` - 关闭规则
- `"warn"` 或 `1` - 将规则视为警告
- `"error"` 或 `2` - 将规则视为错误

```javascript
"rules": {
    "indent": [
        "error",
        4
    ],
    "linebreak-style": [
        "error",
        "windows"
    ],
    "quotes": [
        "error",
        "single"
    ],
    "semi": [
        "error",
        "never"
    ]
}
```

## VSCode 集成

### 安装扩展

1. 打开 VSCode 扩展面板并搜索 ESLint 扩展
2. 点击安装
3. 安装完成后点击"重新加载"以激活扩展

### 配置设置

在 VSCode 设置中添加配置来指定 `.eslintrc.js` 配置文件路径：

```json
{
    "eslint.options": {
        "configFile": "E:/git/github/styleguide/eslint/.eslintrc.js"
    }
}
```

### 支持 Vue 单文件组件

ESLint 默认只支持 JS 文件的脚本检测。如需支持 Vue 单文件组件的内联脚本检测，需要安装 `eslint-plugin-html` 插件：

```bash
npm install -g eslint-plugin-html
```

然后在 VSCode 设置中添加相关配置：

```json
{
    "eslint.options": {
        "configFile": "E:/git/github/styleguide/eslint/.eslintrc.js",
        "plugins": ["html"]
    },
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        "html",
        "vue"
    ]
}
```

## 常用规则说明

| 规则名称 | 错误级别 | 说明 |
|---------|---------|------|
| no-alert | 0 | 禁止使用 alert confirm prompt |
| no-console | 2 | 禁止使用 console |
| no-debugger | 2 | 禁止使用 debugger |
| no-var | 0 | 禁用 var，用 let 和 const 代替 |
| eqeqeq | 2 | 必须使用全等 |
| semi | [2, "always"] | 语句强制分号结尾 |
| quotes | [1, "single"] | 引号类型 |

## React 项目配置示例

```javascript
// "off" or 0 - turn the rule off
// "warn" or 1 - turn the rule on as a warning (doesn't affect exit code)
// "error" or 2 - turn the rule on as an error (exit code is 1 when triggered)
module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true,
        "jest": true,
        "jquery": true
    },
    "parser": "Espree",
    "globals": {
        "__dirname": "__dirname"
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 6,
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true,
            "globalReturn": true // allow return statements in the global scope
        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": ["error"],
        "indent": [
            2, 4
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": "error",
        "eqeqeq": "error", // require the use of === and !==
        "no-alert": "error", // require the use of === and !==
        "no-multi-spaces": "error", // disallow multiple spaces
        "no-redeclare": "error" // disallow variable redeclaration
    }
};
```

## 参考链接

1. https://www.cnblogs.com/lsgxeva/p/7994474.html
2. https://www.jianshu.com/p/ad1e46faaea2
3. https://juejin.cn/post/7012798266089668645
4. https://cloud.tencent.com/developer/section/1135569
5. https://blog.csdn.net/jjknight/article/details/104498720 （如何在 Vue 中关闭 ESLint 工具）
