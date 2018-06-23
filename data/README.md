## 翻译数据
查看 [繁體數據](https://github.com/biuuu/BLHXFY-HANT)
### 关于剧情翻译
scenario 目录下为所有剧情文件，感谢所有提供翻译朋友的无私贡献。

如果你想提交新的翻译文件，请在 scenario 目录点击 Create new file 按钮，

如果发现有问题的翻译，或者可以改进的地方，请直接点击文件然后点击右上角的“笔图标”进行修改。
```
希望直接上传文件或者需要一次提交多个文件的话，先点右上角的 Fork 按钮，这时你自己的账号下就有了一个同名的项目。
在你账号的项目里找到 data/scenario 目录，点击右上角的 Upload Files 按钮，就能一次上传多个文件了。
添加或修改剧情后，点 Pull request 即可发起请求将修改合并到主分支。
```

**注意事项：**

已经 Fork 的项目并不会自动跟原项目保持一致。

如果不是第一次提交代码，则需要从最新的 提交（Commit） 新建一个 分支（Branch） 后再进行修改或上传新文件操作。

下面简述一下如何通过 github 的网页新建一个最新的分支。
1. 打开 Commit 记录列表 https://github.com/biuuu/BLHXFY/commits/master
2. 每一条记录后面有一个`<>`这样的按钮，点最上面那一条打开 `https://github.com/biuuu/BLHXFY/tree/******` 类似这样一个地址
3. 把这个地址 `https://github.com/biuuu/BLHXFY/tree/******` 的 `biuuu` 改成你的用户名 `https://github.com/yourName/BLHXFY/tree/******`（即yourName 部分用你的用户名代替）
4. 然后再新打开的页面，点击 Tree 按钮，输入一个新的分支名，新建一个分支。
5. 现在你已经创建了一个新分支，并且内容是最新的。在这里修改或上传文件后即可发起 Pull request。


### 角色名
关于角色名，遇到未翻译的名字也会在数据目录下生成对应的csv(npc-name-en.csv和npc-name-jp.csv)，
在里面填上对应名字游戏里就会替换了。

目前代码库里已有英文名：https://github.com/biuuu/BLHXFY/blob/master/data/npc-name-en.csv 以及日文名：https://github.com/biuuu/BLHXFY/blob/master/data/npc-name-jp.csv

### 机翻的名词替换
为了提高机翻的效果，对一些专用名词进行了替换(只支持英文版)，

统一放到了这个文件：https://github.com/biuuu/BLHXFY/blob/master/data/noun.csv (这里面是我随便写的翻译，可能不准确，有问题请直接修改或发issue)

专用名词默认忽略大小写，要区分大小写则在cs列加个1。

## 剧情列表
### 主线剧情
* 苍之少女篇  -  [@煌月夜](https://github.com/KoutsukiYakou)
### 活动剧情和 SIDE STORY
* 若き義勇の振るう剣  -  [@mirror0420](https://github.com/mirror0420)
* リペイント·ザ·メモリー  -  @「灰の冠」
### 角色剧情
* 兰斯洛特  -  [@poss2018](https://github.com/poss2018)
* 圣德芬  -  [@poss2018](https://github.com/poss2018)
* 巴洛瓦  -  @告夫
* 瓦姬拉  -  [@路米斯](https://github.com/toloomis)
* 露娜露  -  [@mirror0420](https://github.com/mirror0420)
## License
<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="知识共享许可协议" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />翻译文本采用<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议</a>进行许可
