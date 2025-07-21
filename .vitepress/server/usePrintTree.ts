import fs from 'node:fs'
import path from 'node:path'

interface C {
  name: string
  children?: C[]
}
console.log('lalala')

export function getTree(dirPath: string): C[] {
  const items = fs.readdirSync(dirPath, { withFileTypes: true })
  return items.map((item) => {
    if (item.isDirectory()) {
      return {
        name: item.name,
        children: getTree(path.join(dirPath, item.name)),
      }
    }
    else {
      return { name: item.name }
    }
  })
}

// 新增函数：将目录结构写入文件
export function writeTreeToFile(dirPath: string, outputFile: string) {
  const tree = getTree(dirPath)
  fs.writeFileSync(outputFile, JSON.stringify(tree, null, 2), 'utf-8')
}

writeTreeToFile('./docs', 'tree1.json')
