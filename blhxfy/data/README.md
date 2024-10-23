## 翻译数据

### 剧情翻译
scenario 目录存放所有剧情文本。

#### 用插件提取剧情文本
如果还未安装汉化插件，请先看这边的[说明](https://github.com/biuuu/BLHXFY/blob/master/src/README.md)来装上汉化插件。

安装插件后查看剧情时，点击右上角的 Log 按钮，可以看到上方添加了一排按钮，分别是“原文/填充/译文/预览”。

1. 原文：下载当前剧情的 CSV 文件
2. 填充：下载当前剧情的 CSV 文件，但其中的 trans 列被原文填充
3. 译文：下载已翻译的 CSV 文件，如果有的话
4. 预览：弹出一个文本框，粘贴翻译好的剧情文本即可预览。但同时只会缓存5个预览章节，超过后会清除多余的预览。

一般情况点击原文按钮下载剧情文本就可以了。

关于剧情文本的格式：使用任意文本编辑器打开，可以看到文件的第一行是“id,name,text,trans”，这代表这个文件是一个 4 列的表格，通过半角逗号分隔。

前 3 列分别是对话的ID，对话的角色名字，剧情文本的原文。这 3 列都不需要改动，你只需要填写或修改最后的 trans 列，即译文。

当你在 trans 列填写上对应的翻译后，就可以进行预览，具体操作请查看[插件的说明](https://github.com/biuuu/BLHXFY/blob/master/src/README.md)。

注意：插件提供的是utf8编码的逗号分隔的csv文件，你的系统可能会默认用表格类软件打开。但这些表格类软件往往会无视文件原本的编码，这样保存后的文件无法使用。
因此建议使用文本编辑器来编辑，推荐用https://code.visualstudio.com/ 。

完成翻译后就可以提交到项目里，让其他使用插件的人看到你的翻译。如何提交翻译请参考下面的的[说明](#提交翻译)。

  建议上传前在 CSV 里加上自己的 ID 或昵称。可以在文件末尾加一行，id 写成备注就行，注意半角逗号数量跟前面一致。具体格式不限，能让人看出是你翻译的就行。这样也不会影响汉化，插件会忽略这行信息。
  还有一个选择是在剧情简介里加上你的id，这样别人想skip时，可能就会被你帅气的昵称所震慑，不敢妄动。
  如果你懒得加就算了，只是要联系到译者会比较困难。

**因翻译项目的公开、多人参与的性质，已有的翻译并不完美，有很多地方可能都有问题。如果你发现有需要修改的地方随时都可以提交修改。同样的，出于完善翻译的目的，你自己提交的翻译也可能随时会被修改。**

### 角色名
查看剧情文本的 name 列，如果是已经有翻译的角色名，则会显示对应的翻译，没有的话则需要添加。

这里是目前代码库里已有的[日文名](https://github.com/BLHXFY-Group/BLHXFY/blob/master/data/npc-name-jp.csv) 以及 [英文名](https://github.com/BLHXFY-Group/BLHXFY/blob/master/data/npc-name-en.csv)

要修改或添加角色名的话，直接改上面这两个文件就可以。

### 关于机翻
如果当前剧情还没有人提交翻译的话，插件会尝试机翻。

你可以在游戏的设置界面或者剧情的Log里找到汉化插件设置按钮。在里面可以调整是否使用机翻。

另外插件使用了两个步骤来提升机翻的效果：

1. 在将要翻译的文本提交翻译之前，对一些专用名词进行替换。对应的文件是 [noun.csv](https://github.com/BLHXFY-Group/BLHXFY/blob/master/data/etc/noun.csv)，其中前两列是名词和替换，第三列表示是否区分大小写。

2. 在取得机翻返回的文本后，对其中出现的异常翻译进行修复，对应的文件是 [noun-fix.csv](https://github.com/BLHXFY-Group/BLHXFY/blob/master/data/etc/noun-fix.csv)。

如果你在使用机翻时发现有需要替换的名词，或需要修正的翻译，请提交到这两个文件里。

注：在第1步还会替换已有的角色名翻译（npc-name-en.csv 和 npc-name-jp.csv）。

（当使用彩云小译机翻时，不会进行第一步操作）

### 角色技能翻译
skill 目录下是所有的角色技能，随便打开一个文件可以看到格式很简单。

另外部分技能会有强化等级，比如 + 和 ++，则可以手动加上如 skill-1+ 这样的 ID 来显示不同的翻译。

部分角色终突后技能名会变化，这种情况需要 `skill-变化后的技能名` 或者 `special-变化后的技能名` 来进行区分。

可能让人困惑的是 npc 那一行的数字 id 如何获取。

简单来说，就是当你查看角色技能时，游戏里 `/npc/npc/*****` 这个接口返回的数据里的 master.id 即对应的角色 id。

你可以通过浏览器的开发者工具的 Network 栏查看（按 F12 打开）。

### 职业技能翻译
职业技能的翻译存放在当前目录的 job-skill.csv 里。

每个技能有独立的 id，也需要通过开发者工具查看。

etc 目录下还有 buff.csv 和 debuff.csv 对应一些技能的效果说明。

### 界面翻译

* lang-msg.csv - 对应每个页面的 title 提示信息等数据，来源于 `***/content/***` 这种接口的 option.langMsg 字段。
* voice-mypage.csv - 主页角色语音字幕，需要对应音频文件的路径，以及时长。
* etc/common-html.csv - 替换各个页面的 html 模板的文本，来自 `***/content/***` 接口的 data 字段。
* etc/archive.csv - 用语集里的文本替换。
* etc/chat-preset.csv - 战斗中的定型文。
* etc/island-info.csv - 地图上选择岛屿时出现的说明。
* etc/town-info.csv - 当前岛屿的特别地点的说明。
* etc/login-bonus.csv - 每日登录时碧说的话。

大部分界面的翻译都可以通过 etc/common-html.csv 完成，用的是完全匹配的替换模式。

### 提交翻译
翻译数据均为 CSV 格式的文件，感谢所有提供翻译朋友的无私贡献。

如果你想提交新的翻译文件，请在对应目录点击 Upload files 按钮，然后选择文件上传。

由于网页上无法直接创建中文目录，你也可以直接把改好名字的文件夹拖过来上传。

如果发现有问题的翻译，或者可以改进的地方，请直接点击文件然后点击右上角的“笔图标”进行修改。

以上操作建立在你已经加入 BLHXFY-Group 这个组织之上。除非你对 github 已经非常了解，否则都建议先加入再上传。

需要加入 BLHXFY-Group 请在 https://github.com/BLHXFY-Group/BLHXFY/issues 点击 New Issue 按钮，填上你想做什么（提交翻译、修改错误等等），我看到后会发送邀请。

**实在搞不懂这些步骤也可以直接发邮件到 umisuna@qq.com ，我来帮你上传。**

以下内容是介绍在未加入 BLHXFY-Group 的情况如何提交翻译，如果对 git 原理不太了解则不建议阅读。

```
对于未加入 BLHXFY-Group 的翻译人员，希望直接上传文件或者需要一次提交多个文件的话，
先打开 https://github.com/BLHXFY-Group/BLHXFY ，然后点右上角的 Fork 按钮，这时你自己的账号下就有了一个同名的项目。
在你账号的项目里找到 data/scenario 目录，点击右上角的 Upload Files 按钮，就能一次上传多个文件了。
添加或修改剧情后，点 Pull request 即可发起请求将修改合并到主分支。
```

**注意事项：**

已经 Fork 的项目并不会自动跟原项目保持一致。

如果不是第一次提交翻译，则可能会发生冲突，
需要从最新的 提交（Commit） 新建一个 分支（Branch） 后再进行修改或上传新文件操作。

下面简述一下如何通过 github 的网页新建一个最新的分支。
1. 打开 Commit 记录列表 https://github.com/BLHXFY-Group/BLHXFY/commits/master
2. 每一条记录后面有一个`<>`这样的按钮，点最上面那一条打开 `https://github.com/BLHXFY-Group/BLHXFY/tree/******` 类似这样一个地址
3. 把这个地址 `https://github.com/BLHXFY-Group/BLHXFY/tree/******` 的 `BLHXFY-Group` 改成你的用户名 `https://github.com/yourName/BLHXFY/tree/******`（即yourName 部分用你的用户名代替）
4. 然后再新打开的页面，点击 Tree 按钮，输入一个新的分支名，新建一个分支。
5. 现在你已经创建了一个新分支，并且内容是最新的。在这里修改或上传文件后即可发起 Pull request。

**关于上面的 fork 和 pull request 步骤，如果你是已经加入 BLHXFY-Group 的翻译人员可以省略，请直接在 BLHXFY-Group/BLHXFY 的 master 分支上修改或上传，无需再发起 pull request**

## License
<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="知识共享许可协议" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />翻译文本采用<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议</a>共享
