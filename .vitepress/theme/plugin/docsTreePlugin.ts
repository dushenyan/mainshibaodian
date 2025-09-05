import type { PluginOption } from 'vite'
import { exec } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { promisify } from 'node:util'

const execPromise = promisify(exec)

interface OptionVo {
  // 需要执行 文件地址
  path: string
  // 缓存生成 文件地址
  cacheFilePath: string
  // 监听目录
  watchDirectory: string
  // 监听目录下所有文件
  watchAll: boolean
  // 监听文件正则
  watchRegex: RegExp
}

// 默认配置
const defaultOptions: OptionVo = {
  path: '/server/index.ts',
  cacheFilePath: '/config/.fm-cache.json',
  watchDirectory: '/docs',
  watchAll: false,
  watchRegex: /^---\r?\n([\s\S]*?)\r?\n---/,
}

async function runTSFileForOptions(options: OptionVo): Promise<void> {
  try {
    // 定位 index.ts 文件 绝对路径
    const indexTsPath = path.join(process.cwd(), options.path)
    // 使用 tsx 直接运行 TypeScript 文件
    await execPromise(`npx tsx ${indexTsPath}`)
    console.log('/server/index.ts 已成功运行')
  }
  catch (error) {
    // 若运行过程中出现错误，打印错误信息
    console.error('运行 index.ts 时出错:', error)
  }
}

/**
 * 文档树插件 用于生成文档树
 * @param options 插件配置
 * @returns
 */
function docsTreePlugin(options: Partial<OptionVo>): PluginOption {
  // 合并配置
  const mergedOptions = { ...defaultOptions, ...options }

  return {
    name: 'vitepress-docs-tree',
    configResolved(config) {
      // 当 VitePress 处于开发模式或构建模式时
      if (config.command === 'serve' || config.command === 'build') {
        (async () => {
          await runTSFileForOptions(mergedOptions)
        })()
      }
    },
    configureServer(server) {
      const cacheFile = path.join(process.cwd(), '.vitepress', mergedOptions.cacheFilePath)

      // 从磁盘读缓存 读取缓存文件[文件修改索引]
      let fmCache: Record<string, string> = {}
      try {
        fmCache = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'))
      }
      catch {
        throw new Error('读取缓存文件失败')
      }

      // 保存到磁盘
      function saveCache(): void {
        fs.writeFileSync(cacheFile, JSON.stringify(fmCache, null, 2))
      }

      async function getFrontMatter(filePath: string): Promise<string> {
        try {
          const content = await import('node:fs/promises').then(m => m.readFile(filePath, 'utf-8'))
          const match = content.match(mergedOptions.watchRegex)
          return match ? match[1] : ''
        }
        catch {
          return ''
        }
      }

      const docsRoot = path.join(process.cwd(), mergedOptions.watchDirectory)
      server.watcher.add(docsRoot)

      if (mergedOptions.watchAll) {
        server.watcher.on('all', async () => {
          await runTSFileForOptions(mergedOptions)
        })
        return
      }

      server.watcher.on('change', async (filePath) => {
        if (!filePath.endsWith('.md'))
          return
        const prev = fmCache[filePath] ?? ''
        const curr = await getFrontMatter(filePath)
        if (prev !== curr) {
          fmCache[filePath] = curr
          saveCache()
          await runTSFileForOptions(mergedOptions)
        }
      })
    },
  }
}

export default docsTreePlugin
