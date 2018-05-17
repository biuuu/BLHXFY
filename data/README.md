## 翻译数据
### 关于剧情翻译
scenario 目录下为所有剧情文件，感谢所有提供翻译朋友的无私贡献。

目前已有的主线剧情都由 [@煌月夜](https://github.com/KoutsukiYakou) 翻译。

已有的角色剧情来自 [@poss2018](https://github.com/poss2018) 。

如果你想提交新的翻译文件，请在 scenario 目录点击 Create new file 按钮，

如果发现有问题的翻译，或者可以改进的地方，请直接点击文件然后点击右上角的“笔图标”进行修改。
```
希望直接上传文件或者需要一次提交多个文件的话，先点右上角的 Fork 按钮，这时你自己的账号下就有了一个同名的项目。

在你账号的项目里找到 data/scenario 目录，点击右上角的 Upload Files 按钮，就能一次上传多个文件了。

添加或修改剧情后，点 Pull request 即可发起请求将修改合并到主分支。
```

### 角色名
关于角色名，遇到未翻译的名字也会在数据目录下生成对应的csv(npc-name-en.csv和npc-name-jp.csv)，
在里面填上对应名字游戏里就会替换了。

目前代码库里已有英文名：https://github.com/biuuu/BLHXFY/blob/master/data/npc-name-en.csv 以及日文名：https://github.com/biuuu/BLHXFY/blob/master/data/npc-name-jp.csv

### 机翻的名词替换
为了提高机翻的效果，对一些专用名词进行了替换(只支持英文版)，

统一放到了这个文件：https://github.com/biuuu/BLHXFY/blob/master/data/noun.csv (这里面是我随便写的翻译，可能不准确，有问题请直接修改或发issue)

专用名词默认忽略大小写，要区分大小写则在cs列加个1。

## License
<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="知识共享许可协议" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />翻译文本采用<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议</a>进行许可
