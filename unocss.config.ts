import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons()
  ],
  shortcuts: {
    // 可按需添加自定义快捷类
  },
  rules: [
    // 可按需添加自定义规则
  ]
})
