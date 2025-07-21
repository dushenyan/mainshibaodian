import { defineConfig, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetAttributify(),
    presetIcons(),
  ],
  shortcuts: {
    // 可按需添加自定义快捷类
  },
  rules: [
    // 可按需添加自定义规则
  ],
})
