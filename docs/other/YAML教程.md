# js-yaml库使用

## 环境搭建
```shell
# 创建项目
pnpm create vite 

# 选择创建ts项目

# 添加依赖
nio js-yaml
```

## 基础使用
将对象转为json
```js
import fs from 'node:fs'
import yaml from 'js-yaml'

try {
  const obj = {
    name: 'dushenyan',
    age: 18,
    hobbies: [
      'coding',
      'reading',
      'swimming',
    ],
    fn: 'function () { return 1 }',
    reg: '/test/',
  }
  fs.writeFileSync(
    './example-1.yml',
    yaml.dump(obj),
    'utf8',
  )
}
catch (e) {
  console.log(e)
}

```

读取example.yml文件
```js
try {
  const doc = yaml.load(
    fs.readFileSync('./example.yml', 'utf8'),
  )
  console.log(doc)
}
catch (e) {
  console.log(e)
}
```


### 链接

- [YAML 入门教程](https://www.runoob.com/w3cnote/yaml-intro.html)
