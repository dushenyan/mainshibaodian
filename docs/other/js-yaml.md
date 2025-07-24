---
sidebar: false
outline: [2, 3, 4]
---

# js-yaml库使用

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

try {
  // 创建example.yml文件
  const doc = yaml.load(
    fs.readFileSync('./example.yml', 'utf8'),
  )
  console.log(doc)
}
catch (e) {
  console.log(e)
}
```
