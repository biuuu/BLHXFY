# 碧蓝幻想微风机翻团
**关于汉化插件的风险：**

请注意，最近CY发布了关于禁止使用非法工具的公告。链接：https://ngabbs.com/read.php?tid=15595060 

因为汉化插件不会影响游戏的平衡性，所以我认为游戏厂商应该不会将其归类为非法工具。我自己的判断是汉化插件的使用没有风险，并会一直使用。

如果你选择使用汉化插件的话，请结合官方公告来做出自己的判断。如果有任何疑虑的话，请不要使用。

## 前言
从 v1.0.0 开始，项目里的 electron 版 App 相关代码被移除（原有代码查看 archive 分支），只保留用户脚本相关代码。

今后将只更新和维护用户脚本（即汉化插件），下面的工具不再维护和更新。做剧情翻译也建议使用汉化插件来完成。

关于插件的使用说明：https://github.com/biuuu/BLHXFY/blob/master/src/README.md

## 简介
（注意：下面的工具已不再更新和维护，建议使用浏览器汉化插件）

下载：https://github.com/biuuu/BLHXFY/releases

(下载最新的exe文件安装即可，可能会被 smart screen 拦截，点“更多信息”可以继续安装)

原理是建立一个本地http代理服务器，替换剧情文本。在浏览器里使用需要手动配置代理，默认端口8001

如果使用 SwitchyOmega 等代理管理插件，可以新建个 PAC 情景模式，地址填 http://127.0.0.1:8001/pac

如果修改过默认的 8001 端口，则地址里的 8001 改成对应的数字

如果你的游戏页面需要其他代理工具才能流畅使用（如 SS/ACGP/岛风GO），则需在工具的设置里打开前置代理选项，然后前置代理端口改为其他代理工具的端口（注意工具自己使用的 8001 端口不用改），常见的其他代理工具的端口有 SS -> 1080 / ACGP -> 8123 / 岛风GO -> 8099

使用前置代理后，数据会通过 工具 -> 其他代理 -> 游戏服务器 的顺序发送，这样就相当于工具和加速一起生效了

### 关于剧情翻译
对于已经有了翻译文本 （[scenario](https://github.com/BLHXFY-Group/BLHXFY/tree/master/data/scenario)） 的剧情，会直接替换。

对于还没翻译文本的剧情会使用 google 翻译进行机翻。

机翻成功后，会在本地数据目录下生成对应的翻译文件，文件使用 csv 格式保存。（注意：已经生成文件的剧情之后都会读取文件里的数据，不会再用 google 翻译，除非删掉对应的本地文件）

可以使用任意文本工具编辑 csv，保存后游戏里就能看到你的修改。
如果希望其他人看到你的翻译，可以将你修改后的 csv 文件提交到 github。

不会使用 Git 可以直接用 github 的 web 界面来上传文件和发起 pull request。

参考：https://github.com/BLHXFY-Group/BLHXFY/tree/master/data

### 关于技能翻译
已有的人物技能：[查看](https://github.com/BLHXFY-Group/BLHXFY/tree/master/data/skill)

类似剧情翻译，在游戏里查看人物技能时，会在本地数据目录下的skill文件夹生成对应的 csv 文件。（游戏语言必须是日语）

编辑文件内容即可替换游戏里的技能显示。注意需要把 active 行的 0 改为 1，才会让这个文件生效。改回 0 则不会替换技能显示。

另外部分技能会有强化等级，比如 + 和 ++，则可以手动加上如 skill-1+ 这样的 ID 来显示不同的翻译。

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
