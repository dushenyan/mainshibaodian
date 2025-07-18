type CacheType = 'localStorage' | 'sessionStorage'

export const CACHE_KEY = {
  PASS_WORD: 'pass_word',
}

// 定义模拟缓存对象的接口
interface MockCache {
  set: (key: string, value: any, options?: { exp: number }) => void;
  get: (key: string) => any;
  delete: (key: string) => void;
  deleteAllExpires: () => void;
  clear: () => void;
  touch: (key: string, exp: number) => void;
  add: (key: string, value: any, options?: { exp: number }) => void;
  replace: (key: string, value: any, options?: { exp: number }) => void;
}

/**
 * 配置浏览器本地存储的方式，可直接存储对象数组。
 */
export const useCache = async (type: CacheType = 'localStorage') => {
  if (!import.meta.env.SSR) {
    const { default: WebStorageCache } = await import('web-storage-cache');
    const wsCache = new WebStorageCache({
      storage: type
    });
    return {
      wsCache
    };
  } else {
    // SSR 环境下返回模拟的缓存对象
    const mockCache: MockCache = {
      set: () => {},
      get: () => null,
      delete: () => {},
      deleteAllExpires: () => {},
      clear: () => {},
      touch: () => {},
      add: () => {},
      replace: () => {}
    };
    return {
      wsCache: mockCache
    };
  }
};
