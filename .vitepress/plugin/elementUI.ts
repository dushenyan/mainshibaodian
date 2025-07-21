import type { App } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css' // 支持暗黑模式

export default function (app: App): void {
  app.use(ElementPlus)
}
