---
tags: ['useEmits']
---

# Hooks工具函数

## useEmits
> 事件总线,用于组件之间的通信 

1.封装hooks库
```ts
// useEmits.ts
import mitt from 'mitt'
import { onBeforeUnmount } from 'vue'

export enum EmitType {
  ListDrawerClose = 'listDrawerClose',
}

interface OptionsVO {
  name: string
  onCallback: Fn<unknown>
}

const emitter = mitt()

// eslint-disable-next-line ts/explicit-function-return-type
export function useEmits(options?: OptionsVO) {
  if (options) {
    emitter.on(options.name, options.onCallback)

    onBeforeUnmount(() => {
      emitter.off(options.name, options.onCallback)
    })
  }

  return emitter
}
```

2.监听事件
```ts
useEmits({
      name: EmitType.ListDrawerClose,
      onCallback: (val: any) => {
        console.log(val)
        showListDrawer.value = false
      },
    })
```

3.派发事件
```ts
useEmits().emit(EmitType.ListDrawerClose, { a: 1 })
```
