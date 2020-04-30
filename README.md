# 碧蓝幻想翻译
[![Build Status](https://github.com/biuuu/BLHXFY/workflows/Build/badge.svg?branch=master)](https://github.com/biuuu/BLHXFY/actions?query=workflow%3ABuild)
<a href="http://game.granbluefantasy.jp/#quest/index"><img alt="Port Breeze" src="https://img.shields.io/badge/Port-Breeze-green.svg"></a>

[☁检查更新](https://blhx.danmu9.com/blhxfy/extension.user.js)

## 前言
插件的原理是通过在游戏的网页中注入 javascript 脚本，修改网络请求中返回的文本，以及添加部分 CSS（样式），来实现汉化。

我们并不清楚 Cygames 对汉化插件的态度，预计往后也不会有明确的支持或反对。

因此在使用之前请自行判断使用汉化插件会不会有风险，如果觉得有则不要使用。

## 简介
安装插件：[说明](https://github.com/biuuu/BLHXFY/blob/master/src/README.md)

提交翻译：[说明](https://github.com/BLHXFY-Group/BLHXFY)

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
