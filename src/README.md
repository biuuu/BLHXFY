# 碧蓝幻想汉化插件
## 简介
虽然叫汉化插件，其实这只是一段 javascript 脚本。

原理是在游戏的网络请求中返回的数据里替换文本，以达到汉化的目的。

## 使用
### PC端
1. 建议使用 Chrome，首先安装 [Tampermonkey](https://tampermonkey.net/) 扩展
2. 扩展安装完成后，点击脚本的地址 https://blhx.danmu9.com/blhxfy/extension.user.js ，根据扩展的提示安装脚本
3. 回到游戏页面刷新

注：版本较旧的浏览器可能有兼容性问题，需要删除已安装的脚本，然后安装兼容版：https://blhx.danmu9.com/blhxfy/extension.es5.user.js

另外可能部分地区的网络访问存放翻译数据的域名 blhx.danmu9.com 比较困难，会导致无限 Loading。解决办法是将 blhx.danmu9.com 这个域名也添加到你的代理列表（如果你有的话）。

动手能力强的还可以考虑自建翻译数据的 HTTP 服务器。可以看到翻译数据全是静态文件：https://github.com/biuuu/BLHXFY/tree/gh-pages ，只需要一个简单的静态 HTTP 服务器。

以上两个办法你都搞不定的话只能考虑用其他人建的翻译数据镜像网站了，但我们无法确定第三方的数据是否被修改，请选择你能信任的数据源。

### Android
同 PC 端，不过一般会使用 yandex 浏览器来安装 Tampermonkey 扩展。
### iOS
由于 iOS 没有能直接安装插件或使用用户脚本的浏览器，会麻烦一点。

但我们的目的只是给网页插入一段 javascript ，办法还是很多的。

这里提供一个思路：利用一些代理 APP 提供的 URL 重写功能，将游戏本身的一个脚本重定向到我们指定的脚本来加载汉化插件。

例如编辑 Shadowrocket （不是国区搜到的那个12元的，原版已在国区下架，需到外服购买） 的配置，点击“添加URL重写”，然后按下面的格式添加规则：
```
URL: ^http://(game-a3\.granbluefantasy\.jp|gbf\.game-a3\.mbga\.jp)/assets(_en)?/\d+/js[^/]*/config\.js$
TO: https://blhx.danmu9.com/blhxfy/game-config.js
```
这会将游戏的 config.js 重定向到 https://blhx.danmu9.com/blhxfy/game-config.js
（因为游戏的 js 文件会被浏览器缓存，你可能需要清除缓存才能看到效果）

可以看到`https://blhx.danmu9.com/blhxfy/game-config.js`的内容是这样的：
```
document.write('<script src="http://game-a3.granbluefantasy.jp/assets/' + Game.version + '/js/config.js?lyria"></script>')
document.write('<script src="https://blhx.danmu9.com/blhxfy/extension.ios.user.js"></script>')
```
里面加载了游戏原来的 config.js 并且额外加载了一个汉化插件的 js 文件，这样也就相当于额外加载了汉化插件。

不过 Shadowrocket 毕竟是用来连接代理服务器的。
如果你没有什么代理服务器只想直连，同时也想用这个 URL 重写，则需要将配置里的其他规则清空，代理服务器随便写一个不存在的即可。

这里提供一个已清空的配置文件：https://blhx.danmu9.com/blhxfy/data/static/blhxfy-without-proxy.conf 用 Shadowrocket 可以直接导入。

不限于 Shadowrocket ，你有其他支持 URL 重写的 APP 都可以尝试这个办法，
只需要将 `^http://(game-a3\.granbluefantasy\.jp|gbf\.game-a3\.mbga\.jp)/assets(_en)?/\d+/js[^/]*/config\.js$` 重定向到 `https://blhx.danmu9.com/blhxfy/game-config.js`

甚至 Android 上也可以用这个方案，这样你就不必一定要在 yandex 浏览器上使用汉化插件了。不过这里并不支持加载 viramate 等
Chrome 扩展。

注：目前脚本不兼容 uiwebview，因此使用上面的方案一定要在浏览器里打开游戏，用 iOS 的碧蓝幻想 APP 会卡 Loading。

## 关于机翻
如果当前剧情还没有人提交翻译的话，插件尝试机翻。

你可以在游戏的设置界面或者剧情的Log里找到汉化插件设置按钮。在里面可以调整是否使用机翻。

另外插件使用了两个步骤来提升机翻的效果：

1. 在将要翻译的文本提交翻译之前，对一些专用名词进行替换。对应的文件是 [noun.csv](https://github.com/BLHXFY-Group/BLHXFY/blob/master/data/etc/noun.csv)，其中前两列是名词和替换，第三列表示是否区分大小写。

2. 在取得机翻返回的文本后，对其中出现的异常翻译进行修复，对应的文件是 [noun-fix.csv](https://github.com/BLHXFY-Group/BLHXFY/blob/master/data/etc/noun-fix.csv)。

如果你在使用机翻时发现有需要替换的名词，或需要修正的翻译，请提交到这两个文件里。

注：在第1步还会替换已有的角色名翻译（npc-name-en.csv 和 npc-name-jp.csv）。

（当使用彩云小译机翻时，不会进行第一步操作）
