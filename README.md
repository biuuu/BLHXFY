# 碧蓝幻想翻译
## 前言
插件的原理是通过在游戏的网页中注入 javascript 脚本，修改网络请求中返回的文本，以及添加部分 CSS（样式），来实现汉化。

我们并不清楚 Cygames 对汉化插件的态度，预计往后也不会有明确的支持或反对。

因此在使用之前请自行判断使用汉化插件会不会有风险，如果觉得有则不要使用。

## 简介
使用：https://github.com/biuuu/BLHXFY/blob/master/src/README.md

加入翻译：https://github.com/BLHXFY-Group/BLHXFY/tree/master/data

代码和翻译数据都部署在 github pages 上，使用了 cloudflare 的 CDN。

关于跨域获取翻译数据，使用了 postMessage 的方案，似乎因此不兼容 iOS 上的碧蓝幻想 App，但可以在浏览器里正常使用。
## Devlopment

```bash
# 全局安装 yarn
npm install -g yarn

# 用 yarn 安装模块
yarn install

# 构建用户脚本
yarn build

# 打包CSV和构建用户脚本，并push到当前repo的gh-pages分支
yarn deploy
```

## License
The code is [MIT](https://github.com/biuuu/BLHXFY/blob/master/LICENSE) licensed,
but the translation text has another License. see [details](https://github.com/biuuu/BLHXFY/tree/master/data)
