import type { EnhancedDocsTreeDataVO } from '../types/index'
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

// 辅助函数：获取文件的元数据
function getFileMetadata(filePath: string): Record<string, any> | undefined {
  if (path.extname(filePath) === '.md') {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const { data } = matter(fileContent)
      return data
    }
    catch (error) {
      console.error(`读取文件 ${filePath} 的元数据时出错:`, error)
    }
  }
  return undefined
}

// 辅助函数：生成链接
function generateLink(baseDir: string, filePath: string): string {
  const relativePath = path.relative(baseDir, filePath)
  const extname = path.extname(relativePath)
  // 移除文件扩展名
  let linkPath = relativePath.replace(extname, '')

  // 确保链接以 /docs 开头
  if (!linkPath.startsWith('/docs')) {
    linkPath = `/docs/${linkPath.replace(/^\/+/, '')}`
  }

  // 对链接进行编码
  return encodeURIComponent(linkPath)
}

export function getTree(dirPath: string, baseDir = dirPath): EnhancedDocsTreeDataVO[] {
  const items = fs.readdirSync(dirPath, { withFileTypes: true })
  return items.filter((item) => {
    const fileName = item.name
    const filterFileName = ['index.md', '.DS_Store']
    // 过滤掉 index.md 和 .DS_Store 文件
    if (item.isFile() && filterFileName.includes(fileName)) {
      return false
    }
    return true
  }).map((item) => {
    const fullPath = path.join(dirPath, item.name)
    const extname = path.extname(item.name)
    const titleWithoutExtension = item.name.replace(extname, '')

    if (item.isDirectory()) {
      return {
        title: titleWithoutExtension,
        items: getTree(fullPath, baseDir),
        link: generateLink(baseDir, fullPath),
      }
    }
    else {
      const metadata = getFileMetadata(fullPath)
      return {
        title: titleWithoutExtension,
        metadata,
        link: generateLink(baseDir, fullPath),
        fileExtension: extname,
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
