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
