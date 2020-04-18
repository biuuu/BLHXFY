# 碧蓝幻想汉化插件
## 简介
虽然叫汉化插件，其实这只是一段 javascript 脚本。

原理是在游戏的网络请求中返回的数据里替换文本，以达到汉化的目的。

## 使用
### PC端
1. 建议使用 Chrome，首先安装 [Tampermonkey](https://tampermonkey.net/) 扩展
2. 扩展安装完成后，点击脚本的地址 https://blhx.danmu9.com/blhxfy/extension.user.js ，根据扩展的提示安装脚本
3. 回到游戏页面刷新

如果是用手机，可以安装支持用户脚本的浏览器，使用下面的代码。
```javascript
(function(){
  const script = document.createElement('script');
  script.src = 'https://blhx.danmu9.com/blhxfy/extension.user.js';
  document.head.appendChild(script);
}())
```
已知支持用户脚本的浏览器
- iOS: Alook
- Android: Via/Kiwi/米侠/荟萃

iOS注入脚本的另外一种方案：https://github.com/biuuu/BLHXFY/issues/322

注：版本较旧的浏览器可能有兼容性问题，需要删除已安装的脚本，然后安装兼容版：https://blhx.danmu9.com/blhxfy/extension.es5.user.js

另外可能部分地区的网络访问存放翻译数据的域名 blhx.danmu9.com 比较困难，会导致无限 Loading。解决办法是将 blhx.danmu9.com 这个域名也添加到你的代理列表（如果你有的话）。

动手能力强的还可以考虑自建翻译数据的 HTTP 服务器。可以看到翻译数据全是静态文件：https://github.com/biuuu/BLHXFY/tree/gh-pages ，只需要一个简单的静态 HTTP 服务器。

以上两个办法你都搞不定的话只能考虑用其他人建的翻译数据镜像网站了，但我们无法确定第三方的数据是否被修改，请选择你能信任的数据源。
