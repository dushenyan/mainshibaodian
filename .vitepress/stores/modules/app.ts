import { defineStore } from 'pinia'

interface StateVO {
  activeName?: string
}

export const useAppStore = defineStore('app', {
  state: (): StateVO => ({
    activeName: undefined,
  }),
  getters: {
    getActiveName(): string | undefined {
      return this.activeName
    },
  },
  actions: {
    setActiveName(name?: string) {
      this.activeName = name
    },
  },
})
