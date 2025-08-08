import type { EnhancedDocsTreeDataVO } from '../../types/index'
import docsTree from '@/config/docsTree.json'

// 定义一个类型守卫函数，用于验证 docsTree 是否为数组
function isDocsTreeArray(data: unknown): data is EnhancedDocsTreeDataVO[] {
  return Array.isArray(data)
}

export type DocsTreeData = EnhancedDocsTreeDataVO[] | undefined

/**
 * 根据目录名称获取对应的文档树数据。
 * @param dirName - 要查找的目录名称。
 * @returns 匹配目录名称的子文档树数据，如果未找到则返回 undefined。
 */
export function useDocsTreeData(dirName: string): DocsTreeData {
  let tree: DocsTreeData

  try {
    // 验证 docsTree 是否为数组
    if (isDocsTreeArray(docsTree)) {
      tree = docsTree.find(item => item.title === dirName)?.items
    }
    else {
      console.error('docsTree 不是有效的数组类型', docsTree)
    }
  }
  catch (error) {
    console.error('获取文档树数据时出错', error)
  }

  return tree
}

/**
 * 获取title为集合
 * @param tree - 文档树数据。
 * @returns 包含所有文档路径的数组。
 */
export function getTitleSet(): Set<string> {
  const titleSet = new Set<string>()
  docsTree.forEach((item) => {
    // 过滤项
    if (['nav'].includes(item.title))
      return
    titleSet.add(item.title)
  })
  return titleSet
}
