import type { Ref } from 'vue'
import type { EnhancedDocsTreeDataVO } from '../../types/index'
import { ref } from 'vue'
import docsTree from '@/config/docsTree.json'

// 定义一个类型守卫函数，用于验证 docsTree 是否为数组
function isDocsTreeArray(data: unknown): data is EnhancedDocsTreeDataVO[] {
  return Array.isArray(data)
}

/**
 * 根据目录名称获取对应的文档树数据。
 * @param dirName - 要查找的目录名称。
 * @returns 匹配目录名称的子文档树数据，如果未找到则返回 undefined。
 */
export function useDocsTreeData(dirName: string): Ref<EnhancedDocsTreeDataVO[] | undefined> {
  const tree: Ref<EnhancedDocsTreeDataVO[] | undefined> = ref(undefined)

  try {
    // 验证 docsTree 是否为数组
    if (isDocsTreeArray(docsTree)) {
      tree.value = docsTree.find(item => item.title === dirName)?.items
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
