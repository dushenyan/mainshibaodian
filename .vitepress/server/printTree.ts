import type { DocsTreeDataVO } from '../types/index'
import fs from 'node:fs'
import path from 'node:path'

export function getTree(dirPath: string): DocsTreeDataVO[] {
  const items = fs.readdirSync(dirPath, { withFileTypes: true })
  return items.map((item) => {
    if (item.isDirectory()) {
      return {
        title: item.name,
        items: getTree(path.join(dirPath, item.name)),
      }
    }
    else {
      return {
        title: item.name,
      }
    }
  })
}

// 新增函数：将目录结构写入文件
// eslint-disable-next-line ts/explicit-function-return-type
export function writeTreeToFile(dirPath: string, outputFile: string) {
  const tree = getTree(dirPath)
  fs.writeFileSync(outputFile, JSON.stringify(tree, null, 2), 'utf-8')
  console.log(`${outputFile} 已生成`)
}
