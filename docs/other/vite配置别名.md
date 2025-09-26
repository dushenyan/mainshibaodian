# typescript + vite别名配置

```
// vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // 配置别名
    }
  }
})
```

> 报错:导入路径不能以导入路径不能以“.ts”扩展名结束

## 省略扩展名

```
// vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // 配置别名
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json']
  }
})
```

> 项目无法运行了，报错显示：找不到这个文件

```
// tsconfig.ts
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"] // 相对位置需要配置baseUrl才能识别，否则会报错
    }
  }
}
```

> 找不到名称“__dirname”

```
npm install --save-dev @types/node
```

