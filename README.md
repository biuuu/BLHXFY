# 碧蓝幻想微风机翻团
## 简介
下载：https://github.com/biuuu/BLHXFY/releases (下载最新的exe文件安装即可，可能会被 smart screen 拦截，点“更多信息”可以继续安装)

原理是建立一个本地http代理服务器，替换剧情文本。在浏览器里使用需要手动配置代理，默认端口8001。

如果使用 SwitchyOmega 等代理管理插件，可以设置只让游戏数据的域名通过代理 ( game.granbluefantasy.jp 和 gbf.game.mbga.jp )

### 关于内置浏览器窗口
如果使用工具自带的窗口开始游戏，则无需配置代理。
在启动代理后，界面上有一个按钮：“打开游戏”。
点它可以直接打开一个游戏窗口，然后里面的代理已经设置好了，所以可以直接看到效果。

    该窗口是使用 electron 直接创建的，内核其实还是 Chromium，一般比最新版本落后一点点。
    由于 electron 对 Chrome 扩展支持不完善，viramate 在这里是用不了的。所以基本上只能作为看剧情专用。
    在没有开启前置代理的情况下，这个窗口的数据等于直连到游戏服务器。
    在开启前置代理的情况下，这个窗口的所有HTTP请求都会发往前置代理。

### 关于剧情翻译
对于已经有了翻译文本 （[scenario](https://github.com/biuuu/BLHXFY/tree/master/data/scenario)） 的剧情，会直接替换。

对于还没翻译文本的剧情会使用 google 翻译进行机翻。

机翻成功后，会在本地数据目录下生成对应的翻译文件，文件使用 csv 格式保存。（注意：已经生成文件的剧情之后都会读取文件里的数据，不会再用 google 翻译，除非删掉对应的本地文件）

可以使用任意文本工具编辑 csv，保存后游戏里就能看到你的修改。
如果希望其他人看到你的翻译，可以将你修改后的 csv 文件提交到 github。

不会使用 Git 可以直接用 github 的 web 界面来上传文件和发起 pull request。

参考：https://github.com/biuuu/BLHXFY/tree/master/data

### 关于技能翻译
已有的人物技能：[查看](https://github.com/biuuu/BLHXFY/tree/master/data/skill)

类似剧情翻译，在游戏里查看人物技能时，会在本地数据目录下的skill文件夹生成对应的 csv 文件。（游戏语言必须是日语）

编辑文件内容即可替换游戏里的技能显示。注意需要把 active 行的 0 改为 1，才会让这个文件生效。改回 0 则不会替换技能显示。

提交技能翻译时可以删除 active 行。

另外部分节能会有强化等级，比如 + 和 ++，但翻译始终只会显示一种，所以如果技能强化后有不同的描述，建议全部写上去。
## Devlopment
全局安装 yarn
```
npm install -g yarn
```
用 yarn 安装模块
```
yarn install
```
启动代理服务器
```
yarn proxy
```
或者作为 electron App 启动
```
yarn start
```

打包成应用
```
yarn dist
```

## License
MIT
