import type { PluginOption } from 'vite'
import { exec } from 'node:child_process'
import path from 'node:path'
import { promisify } from 'node:util'

const execPromise = promisify(exec)

// 定义 VitePress 插件，在 VitePress 启动时运行指定的 TypeScript 文件
// todo: 需要传递参数
const runIndexOnStart: PluginOption = {
  name: 'run-index-on-start',
  // 在 Vite 配置即将应用时触发
  configResolved(config) {
    // 当 VitePress 处于开发模式或构建模式时
    if (config.command === 'serve' || config.command === 'build') {
      (async () => {
        try {
          // 定位 index.ts 文件
          const indexTsPath = path.resolve(__dirname, '../../server/index.ts')

          // 使用 tsx 直接运行 TypeScript 文件
          await execPromise(`npx tsx ${indexTsPath}`)
          console.log('/server/index.ts 已成功运行')
        }
        catch (error) {
          // 若运行过程中出现错误，打印错误信息
          console.error('运行 index.ts 时出错:', error)
        }
      })()
    }
  },
}

export default runIndexOnStart
