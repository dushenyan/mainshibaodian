import { writeTreeToFile } from './printTree'

// 生成docs 目录树
writeTreeToFile('./docs', './.vitepress/config/docsTree.json')
