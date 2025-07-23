// 从 vite 导入 PluginOption 类型，用于定义 Vite 插件的选项类型
import type { PluginOption } from 'vite'
// 导入 Node.js 的 fs 模块，用于文件系统操作
import fs from 'node:fs'
import matter from 'gray-matter'

// 转义Markdown中的尖括号，但保留代码块内容
/**
 * 转义 Markdown 内容中的尖括号，同时保留代码块内的原始内容。
 * @param markdownContent - 待处理的 Markdown 文本内容。
 * @returns 转义后的 Markdown 文本内容。
 */
function escapeMarkdownBrackets(markdownContent: string): string {
  // 正则表达式模式：匹配代码块，支持多行的 ``` 包裹的代码块和单行的 ` 包裹的代码块
  const codeBlockPattern = /```[\s\S]*?```|`[\s\S]*?`/g

  // 临时替换代码块为占位符，用于后续处理时跳过代码块内容
  const codeBlocks: any[] = []
  // 将 Markdown 内容中的代码块替换为占位符，并将代码块存储到 codeBlocks 数组中
  const contentWithoutCodeBlocks = markdownContent.replace(codeBlockPattern, (match) => {
    // 将匹配到的代码块添加到 codeBlocks 数组中
    codeBlocks.push(match)
    // 返回占位符，占位符包含代码块在数组中的索引
    return `__CODE_BLOCK_${codeBlocks.length - 1}__`
  })

  // 转义普通文本中的尖括号，将 < 替换为 &lt;，> 替换为 &gt;
  const escapedContent = contentWithoutCodeBlocks
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // 恢复代码块内容，将占位符替换为原来的代码块
  return escapedContent.replace(/__CODE_BLOCK_(\d+)__/g, (_, index) => {
    // 根据占位符中的索引从 codeBlocks 数组中获取原始代码块
    return codeBlocks[index]
  })
}

interface OptionVo {
}

// Vite插件：在Markdown文件被处理前转义尖括号
/**
 * Vite 插件，用于在处理 Markdown 文件之前转义其中的尖括号。
 */
function markdownBracketEscaper(options?: OptionVo): PluginOption {
  return {
    // 插件名称
    name: 'markdown-bracket-escaper',
    // 插件执行顺序，pre 表示在其他插件之前执行
    enforce: 'pre',
    /**
     * 转换函数，在文件被处理前执行。
     * @param code - 文件的原始内容。
     * @param id - 文件的路径。
     * @returns 转换后的内容，如果不处理则返回 null。
     */
    async transform(code: string, id: string) {
      // 只处理 Markdown 文件 或者 忽略处理exclude包含文件
      if (!id.endsWith('.md'))
        return null

      try {
        // 读取原始文件内容
        const rawContent = await fs.promises.readFile(id, 'utf-8')
        // 解析 Frontmatter
        const { data } = matter(rawContent)
        let escapedContent = rawContent
        // 检查 bracketEscaping 配置 开启<>解析
        if (data.bracketEscaping) {
          // 转义尖括号
          escapedContent = escapeMarkdownBrackets(rawContent)
        }
        return escapedContent
      }
      catch (err) {
        // 处理文件读取或转义过程中出现的错误
        console.error('Error processing Markdown file:', err)
        return code
      }
    },
  }
}

export default markdownBracketEscaper
