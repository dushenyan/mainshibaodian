export { }

declare module 'vitepress-plugin-nprogress';

declare global {
  interface Fn<T = any> {
    (...arg: T[]): T
  }

  interface Window {
    lc: any
    decrypt: any
  }
}
