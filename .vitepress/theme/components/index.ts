import type { App } from 'vue'

const modules = import.meta.glob('./**/*.vue', { eager: true })

function getComponentName(path: string): string | null {
  const re = /^\.\/(.*)\.vue$/g
  const result = re.exec(path)
  if (!result)
    return null
  const parts = result[1].split('/')
  if (parts[parts.length - 1] === 'index') {
    parts.splice(parts.length - 1, 1)
  }
  return parts.join('-')
}

// eslint-disable-next-line ts/explicit-function-return-type
export default function (app: App) {
  Object.keys(modules).forEach((path) => {
    const component = modules[path].default
    if (!component)
      return
    const componentName = getComponentName(path)
    if (!componentName)
      return
    app.component(componentName, component)
  })
}
