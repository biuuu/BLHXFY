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

# 关于机翻
如果当前剧情还没有人提交翻译的话，插件可以使用 google 翻译进行机翻。

默认英文版开启机翻，日语版关闭。你可以在游戏的设置界面或者剧情的Log里找到汉化插件设置按钮。在里面可以调整是否使用机翻。

日语版的机翻往往会出现奇怪的结果，英语版会相对好一点。

另外插件使用了两个步骤来提升机翻的效果：

1. 在将要翻译的文本提交到 google 翻译之前，对一些专用名词进行替换。对应的文件是[noun.csv](https://github.com/BLHXFY-Group/BLHXFY/blob/master/data/etc/noun.csv)，其中前两列是名词和替换，第三列表示是否区分大小写。

2. 在取得 google 翻译返回的文本后，对其中出现的异常翻译进行修复，对应的文件是[noun-fix.csv](https://github.com/BLHXFY-Group/BLHXFY/blob/master/data/etc/noun-fix.csv)。

注：在第1步还会替换已有的角色名翻译（npc-name-en.csv 和 npc-name-jp.csv）。

如果你在使用机翻时发现有需要替换的名词，或需要修正的翻译，请提交到这两个文件里。
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
