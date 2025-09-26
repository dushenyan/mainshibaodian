## NVM是什么

------

nvm全英文也叫node.js version management，是一个nodejs的版本管理工具。nvm和n都是node.js版本管理工具，为了解决node.js各种版本存在不兼容现象可以通过它可以安装和切换不同版本的node.js。

## 官网指引

------

文档：https://github.com/nvm-sh/nvm/blob/master/README.md

## 安装

------

1. 安装准备工作

   > 安装之前对其进行操作
   > 如果安装了node，首先将电脑中关于node.js的东西全部删除掉：
   > 卸载node.js
   > 在node的安装目录中再次查看，是否还有node文件夹，如果有，一起删除
   > 在C:\Users\用户名 文件夹下查看是否存在 .npmrc 以及 .yarnrc 文件，如果有，请删除
   > 环境变量中将node相关的也删除

- 检查电脑是否安装nodejs环境
- 存在进行删除卸载操作
- 在用户文件夹下是否存在.npmrc以及.yarnrc文件 如果有全部删除 连带环境变量也进行删除

1. **下载**[**nvm地址**](https://github.com/coreybutler/nvm-windows/releases)

- nvm-noinstall.zip是免安装版，需要进行环境配置
- nvm-setup.zip是安装版，安装过后直接使用，`最好使用`安装版。

1. 图形化界面

   ```
   **next**
   ```

   依次点击安装，这些操作最好在powershell命令界面下使用

   > 配置目录 : nvm安装目录下存在settings.txt



## 更换镜像

------

nvm会安装不存在node和npm，默认源在国外，建议换国内源。如果下载node过慢，请更换国内镜像源, 在 nvm 的安装路径下，找到 settings.txt，设置node_mirro与npm_mirror为国内镜像地址。
或者去nvm根目录 **C:\Users...Roaming\nvm**下修改setting文件：

> nvm node_mirror https://npm.taobao.org/mirrors/node/
> nvm npm_mirror https://npm.taobao.org/mirrors/npm/

注意，这里设置的是安装node和npm本身的源，并不是设置安装node包的源，可以在选择好node后，执行

> npm config set registry [https://registry.npm.taobao.org](https://registry.npm.taobao.org/)

可通过 **npm config list** 查看。



## 常用命令

------

打开PowerShell命令窗口，输入nvm，出现该界面说明安装成功
查看安装过的所有node.js版本

> nvm list

安装新版本(这里我已经安装过，版本号根据需求操作)

> nvm install 12.18.3

切换或使用指定版本

> nvm use 12.18.3

卸载指定版本

> nvm uninstall 12.18.3

查看nvm安装路径

> nvm root

下载最新的node版本和与之对应的npm版本

> nvm install latest

显示可下载版本的部分列表

> nvm list available

安装最新稳定版 node，当前是 node v12.9.1 (npm v7.9.0)

> nvm install stable

安装指定版本，可模糊安装，如：安装 v4.4.0，既可

> nvm install v4.4.0，又可 $ nvm install 4.4$ nvm install

删除已安装的指定版本，语法与 install 用法一致

> nvm uninstall

切换使用指定的版本

> // 临时版本 - 只在当前窗口生效指定版本
> $ nvm use
>
> // 永久版本 - 所有窗口生效指定版本
> $ nvm alias default

注意：在任意一个命令行窗口进行切换之后，其他的窗口或其他命令行工具窗口 需要关掉工具，重启才能生效。（例如 VSCode 内或外部命令切换之后，需要重启 VSCode，才能正常生效，否则或处于 临时生效状态，也就是在 VSCode 中重新打开一个命令行查看版本还会是旧版本，所以必须要重启。）这里的 重启 不是简单的关掉窗口重启，没有退出后台进程，而是完全退出杀死工具进程，重新启动。
列出所有远程服务器的版本（官方 node version list）

> $ nvm ls-remote

显示当前的版本

> $ nvm current

给不同的版本号添加别名

> nvm alias

删除已定义的别名

> $ nvm unalias

在当前版本 node 环境下，重新全局安装指定版本号的 npm 包

> $ nvm reinstall-packages

**补充**

- nvm arch：显示node是运行在32位还是64位。
- nvm install [arch] ：安装node， version是特定版本也可以是最新稳定版本latest。可选参数arch指定安装32位还是64位版本，默认是系统位数。可以添加–insecure绕过远程服务器的SSL。
- nvm list [available] ：显示已安装的列表。可选参数available，显示可安装的所有版本。list可简化为ls。
- nvm on ：开启node.js版本管理。
- nvm off ：关闭node.js版本管理。
- nvm proxy [url] ：设置下载代理。不加可选参数url，显示当前代理。将url设置为none则移除代理。
- nvm node_mirror [url] ：设置node镜像。默认是https://nodejs.org/dist/。如果不写url，则使用默认url。设置后可至安装目录settings.txt文件查看，也可直接在该文件操作。
- nvm npm_mirror [url] ：设置npm镜像。https://github.com/npm/cli/archive/。如果不写url，则使用默认url。设置后可至安装目录settings.txt文件查看，也可直接在该文件操作。
- nvm uninstall ：卸载指定版本node。
- nvm use [version] [arch] ：使用制定版本node。可指定32/64位。
- nvm root [path] ：设置存储不同版本node的目录。如果未设置，默认使用当前目录。
- nvm version ：显示nvm版本。version可简化为v。



## 包管理器缓存配置

------

**终端命令式修改**

```
# 查看缓存目录
npm config get cache
yarn cache dir

# 清理缓存包
npm cache clean --force
yarn cache clean

# 设置npm缓存目录:修改默认在C盘的缓存，防止C盘过大（提前建立好缓存文件夹）
npm config set prefix "D:\nvm-temp\node-global"
npm config set cache "D:\nvm-temp\node-cache"

# 配置Yarn缓存目录: 第一步
yarn config set prefix D:\nvm-temp\yarn-global
yarn config set cache-folder D:\nvm-temp\yarn-cache
yarn config set global-folder D:\nvm-temp\yarn-global

# 第二步，打开%userprofile%，修改.yarnrc，添加新行：
--global-folder "D:\\nvm-temp\\yarn-global"
# 最后通过yarn global dir验证一下修改是否成功

# 查看当前源
npm get registry
yarn config get registry

# 设置镜像源
npm config set registry http://registry.npm.taobao.org/
yarn config set registry http://registry.npm.taobao.org/

# 安装淘宝的cnpm
npm install -g cnpm --registry=https://registry.npm.taobao.org

# 安装tyarn
npm i yarn tyarn -g

# yarn中global包升级
yarn global upgrade

# yarn中特定包升级
yarn upgrade -lastest umi
yarn upgrade umi@3.0.0
```

**PATH环境变量**
我们要将执行文件的目录，添加到系统变量中，这样才能支持那些包的命令行运行，其中包括：

1. npm的global文件夹，比如G:\temp\node-global
2. yarn的global的bin文件夹，比如G:\temp\yarn-global

添加到系统的PATH系统变量（环境变量）中。为避免错误，建议将新添加的系统变量提升到列表顶端，随后重启电脑。
如果不重启电脑的话，可能导致部分编辑器的集成命令行因没有同步系统变量而找不到执行文件。



## nvm 如何实现 node 版本切换

------

在安装 nvm 时候让记下两个安装路径：（下面称 nvm 路径和 node 路径）
nvm安装路径默认为: C://Users/Administrator/AppData/Roming/nvm nvm安装的node路径默认为: C://ProgramFile/nodejs （其实是个快捷方式）

- 在计算机切换到 nvm 路径：[![img](https://cdn.nlark.com/yuque/0/2022/png/1427114/1643172811577-7692f61b-859b-4c25-85f7-702ed160a4a6.png#clientId=ue65e45f8-0cf4-4&from=paste&height=230&id=u92e4c50d&margin=%5Bobject%20Object%5D&originHeight=307&originWidth=799&originalType=url&ratio=1&status=done&style=none&taskId=u8bd7873d-cb84-43aa-bcaa-29e57ea4aab&width=599)](https://cdn.nlark.com/yuque/0/2022/png/1427114/1643172811577-7692f61b-859b-4c25-85f7-702ed160a4a6.png#clientId=ue65e45f8-0cf4-4&from=paste&height=230&id=u92e4c50d&margin=[object Object]&originHeight=307&originWidth=799&originalType=url&ratio=1&status=done&style=none&taskId=u8bd7873d-cb84-43aa-bcaa-29e57ea4aab&width=599)这是 dk 计算机上的 nvm 目录，当前安装了两个版本的 node，想使用哪个版本的 node，本质上是创建要使用那个 node 版本的快捷方式，替换 **node 路径** 。
- 在计算机切换到 node 路径：[![img](https://cdn.nlark.com/yuque/0/2022/png/1427114/1643172811584-b128b1e2-bcac-4d05-8337-90dfe8dce027.png#clientId=ue65e45f8-0cf4-4&from=paste&height=537&id=u9a8baf8c&margin=%5Bobject%20Object%5D&originHeight=716&originWidth=840&originalType=url&ratio=1&status=done&style=none&taskId=uc9ea8f1d-df28-4ce7-be92-d7be82212cc&width=630)](https://cdn.nlark.com/yuque/0/2022/png/1427114/1643172811584-b128b1e2-bcac-4d05-8337-90dfe8dce027.png#clientId=ue65e45f8-0cf4-4&from=paste&height=537&id=u9a8baf8c&margin=[object Object]&originHeight=716&originWidth=840&originalType=url&ratio=1&status=done&style=none&taskId=uc9ea8f1d-df28-4ce7-be92-d7be82212cc&width=630)可以看到，这个目录有个 node_modules 文件夹和许多 cmd 命令，未来安装的全局包都放在这里。

------

相关网站
https://www.runoob.com/w3cnote/nvm-manager-node-versions.html
https://blog.csdn.net/Y1914960928/article/details/121748603
https://dkvirus.gitbooks.io/-npm/content/21-shi-yong-nvm-an-zhuang-npm.html
http://nvm.uihtm.com/
