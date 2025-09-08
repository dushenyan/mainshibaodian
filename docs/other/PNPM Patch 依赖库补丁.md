# PNPM Patch 依赖库补丁

匹配生成补丁静态文件 用户可以自行修改逻辑代码
```sh
pnpm patch vitepress@1.0.0-rc.34

```
![image](https://cdn.jsdelivr.net/gh/dushenyan/picx-images-hosting@master/mainsibaodian/image.9rjr0tdcvu.webp)

生成补丁文件 按照绝对路径

```sh
pnpm patch-commit /Users/shenyandu/Desktop/mainshibaodian/node_modules/.pnpm_patches/vitepress@1.0.0-rc.34
```
![image](https://cdn.jsdelivr.net/gh/dushenyan/picx-images-hosting@master/mainsibaodian/image.1apch5xkkl.webp)


## 参考链接

- [PNPM修补依赖](https://pnpm.io/zh/cli/patch)
