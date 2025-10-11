基础结构
```json
➜  start-website-template git:(master) ✗ tree            
.
├── README.md
├── package-lock.json
├── package.json
├── src
│   ├── assets
│   │   ├── images
│   │   │   └── README.md
│   │   ├── js
│   │   │   ├── README.md
│   │   │   ├── flexible.js
│   │   │   ├── jquery
│   │   │   │   ├── jquery-1.8.3.min.js
│   │   │   │   └── jquery-ui-1.10.3.min.js
│   │   │   ├── jquery.fullPage
│   │   │   │   ├── jquery.fullPage.css
│   │   │   │   └── jquery.fullPage.min.js
│   │   │   └── swiper-animate
│   │   │       ├── README.md
│   │   │       ├── animate.min.css
│   │   │       └── swiper.animate1.0.2.min.js
│   │   ├── style
│   │   │   ├── normalize.css
│   │   │   └── responsive.css
│   │   └── video
│   │       └── README.md
│   └── views
│       ├── about
│       │   ├── index.html
│       │   ├── index.js
│       │   └── index.less
│       └── index
│           ├── index.html
│           ├── index.js
│           └── index.less
└── webpack.config.js

13 directories, 23 files
```



webpack.config.js
```js
const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const LessPluginAutoPrefix = require("less-plugin-autoprefix");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const app = path.join(__dirname, "src");

module.exports = {
  entry: {
    index: "./src/views/index/index.js",
    about: "./src/views/about/index.js",
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    filename: "js/[name].js",
    chunkFilename: "js/[id].chunk.js",
  },
  resolve: {
    extensions: [".js"],
    alias: {
      "@": app,
      "~": path.resolve(app, "assets")
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
          },
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                strictMath: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(html)$/,
        use: "html-loader",
      },
      {
        test: /\.(mp4|mov)(\?.*)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "video/",
              name: "[contenthash].[ext]",
            },
          },
        ],
      },

      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              // context: "./assets/images/",
              outputPath: "images/",
              name: "[contenthash].[ext]",
            },
          },
        ],
      },
    ],
  },
  // optimization: {
  //   splitChunks: {
  //     name: "vendors",
  //     chunks: ["index", "list", "about"],
  //     minChunks: 3,
  //   },
  // },
  plugins: [
    new CleanWebpackPlugin(),

    new webpack.ProvidePlugin({
      $: 'jquery'
    }),
    new MiniCssExtractPlugin({
      filename: "style/[name].[chunkhash].css",
    }),

    new HtmlWebpackPlugin({
      // favicon: "./src/assets/images/favicon.ico",
      filename: "./index.html",
      template: "./src/views/index/index.html",
      inject: "body",
      hash: true,
      chunks: ["vendors", "index"],
      minify: {
        removeComments: true,
        collapseWhitespace: false,
        removeAttributeQuotes: true,
      },
    }),
    new HtmlWebpackPlugin({
      // favicon: "./src/assets/images/favicon.ico",
      filename: "./about.html",
      template: "./src/views/about/index.html",
      inject: true,
      hash: true,
      chunks: ["vendors", "about"],
      minify: {
        removeComments: true,
        collapseWhitespace: false,
        removeAttributeQuotes: true,
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    open: true,
    contentBase: "./",
    host: "localhost",
    port: 8888,
    inline: true,
    hot: true,
  },
};
```

package.json
```json
{
  "name": "start-website-template",
  "version": "0.10.1",
  "description": "用于构建响应式页面的起手模板",
  "main": "index.js",
  "scripts": {
    "dev": "webpack-dev-server",
    "build": "webpack",
    "serve": "npm run build &&  serve -s dist"
  },
  "keywords": [
    "webpack",
    "build serve",
    "website",
    "responsive"
  ],
  "author": "dushenyan",
  "license": "ISC",
  "dependencies": {
    "bootstrap": "^5.1.3",
    "jquery": "^3.5.1",
    "swiper": "^6.4.5",
    "swiper-animate-cn": "^1.1.1",
    "wowjs": "^1.1.3"
  },
  "devDependencies": {
    "serve": "^14.0.0",
    "@webpack-cli/serve": "^1.7.0",
    "clean-webpack-plugin": "^3.0.0",
    "css-loader": "^5.0.1",
    "file-loader": "^6.2.0",
    "html-loader": "^1.3.2",
    "html-url-loader": "^1.0.5",
    "html-webpack-plugin": "^4.5.0",
    "less": "^4.0.0",
    "less-loader": "^7.1.0",
    "less-plugin-autoprefix": "^2.0.0",
    "mini-css-extract-plugin": "^1.3.3",
    "style-loader": "^2.0.0",
    "url-loader": "^4.1.1",
    "webpack": "^5.1.3",
    "webpack-cli": "^3.3.12",
    "webpack-dev-server": "^3.11.3"
  }
}
```

about/xxx
```
<!-- about.html -->
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>starter-website-template</title>
</head>

<body>
  <nav>
    <ul class="center">
      <li class="menu-item"><a href="/">首页</a></li>
      <li class="menu-item"><a href="about.html">关于我们</a></li>
    </ul>
  </nav>
  <main class="center">
    我是关于我们
  </main>
</body>

</html>

<!-- about.js -->
// 公共逻辑文件
import "@/assets/js/flexible.js";

// 公共样式文件
import "./index.less";

<!-- about.less -->
.center {
  display: flex;
  justify-content: center;
  list-style: none;
}
```

index/xxx
```
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>starter-website-template</title>
</head>

<body>
	<nav>
		<ul class="center">
			<li class="menu-item"><a href="/">首页</a></li>
			<li class="menu-item"><a href="about.html">关于我们</a></li>
		</ul>
	</nav>
	<main class="center">
		我是首页
	</main>
</body>

</html>

<!-- index.js -->
// 公共逻辑文件
import "@/assets/js/flexible.js";

import "./index.less";

<!-- index.less -->
.center{
  display: flex;
  justify-content: center;
  list-style: none;
}
```
