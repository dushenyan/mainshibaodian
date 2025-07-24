---
title: 项目记录文档示范 — pp CLI 工具
editLink: true
sidebar: false
---

# {{ $frontmatter.title }}

## 目录结构

```plaintext
pp/
├── bin/
│   └── cli.js          # CLI 脚本入口文件
└── package.json        # 项目配置文件
```

## 项目解决的问题

该项目是一个简单的 Node.js 命令行工具示范，主要用于演示如何快速搭建一个 CLI 工具的基础结构。通过该项目，可以学习如何：

- 使用 Node.js 编写命令行脚本
- 配置 package.json 中的 bin 字段，实现全局命令调用
- 结合 npm link 或全局安装，实现命令行工具的本地调试和发布

------

## 基础用法示例

下面示例展示了如何运行该 CLI 工具，以及它的最简单输出。

```json
{
  "template": "node",
  "entry": "bin/cli.js",
  "files": {
    "bin/cli.js": {
      "code": "#! /usr/bin/env node\n\nconsole.log('hello world');\n",
      "active": true
    },
    "package.json": {
      "code": "{\n  \"name\": \"pp\",\n  \"version\": \"1.0.0\",\n  \"main\": \"index.js\",\n  \"bin\": {\n    \"pp\": \"./bin/cli.js\"\n  },\n  \"scripts\": {\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\n  },\n  \"keywords\": [],\n  \"author\": \"杜审言\",\n  \"license\": \"ISC\",\n  \"description\": \"\"\n}\n"
    }
  }
}
```

运行命令：

```bash
node ./bin/cli.js
```

输出：

```plainText
hello world
```

------

## 代码说明

- `bin/cli.js` 文件第一行 `#! /usr/bin/env node` 是 Unix/Linux 系统的 shebang，告诉系统用 Node.js 运行该脚本。
- `console.log('hello world');` 是脚本的主体，打印简单的字符串。
- `package.json` 中的 `bin` 字段配置了命令名 `pp` 对应的脚本路径，方便全局调用。

------

## 高级用法扩展

你可以在 `cli.js` 中添加更多功能，比如：

- 解析命令行参数（使用 `process.argv` 或第三方库如 `commander`）
- 输出彩色日志（使用 `chalk`）
- 异步操作（读取文件、调用 API 等）

示例：使用 `commander` 实现带参数的 CLI

```json
{
  "template": "node",
  "entry": "bin/cli.js",
  "files": {
    "bin/cli.js": {
      "code": "#! /usr/bin/env node\n\nconst { program } = require('commander');\n\nprogram\n  .version('1.0.0')\n  .option('-n, --name <type>', 'your name')\n  .parse(process.argv);\n\nconst options = program.opts();\n\nif (options.name) {\n  console.log(`Hello, ${options.name}!`);\n} else {\n  console.log('Hello world');\n}\n",
      "active": true
    },
    "package.json": {
      "code": "{\n  \"name\": \"pp\",\n  \"version\": \"1.0.0\",\n  \"main\": \"index.js\",\n  \"bin\": {\n    \"pp\": \"./bin/cli.js\"\n  },\n  \"dependencies\": {\n    \"commander\": \"^10.0.0\"\n  },\n  \"scripts\": {\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\n  },\n  \"keywords\": [],\n  \"author\": \"杜审言\",\n  \"license\": \"ISC\",\n  \"description\": \"\"\n}\n"
    }
  }
}
```

运行示例：

```bash
node ./bin/cli.js --name Trae
```

输出：

```plainText
Hello, Trae!
```

```plain
├── bin
│   └── cli.js
├── image.png
└── package.json
```

```bash
// cli.js
#! /usr/bin/env node

console.log('hello world');
```

![image](https://cdn.jsdelivr.net/gh/dushenyan/picx-images-hosting@master/mainsibaodian/image.2h8lvxkfxc.webp)
