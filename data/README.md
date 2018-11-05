### 关于剧情翻译
scenario 目录下为所有剧情文件，感谢所有提供翻译朋友的无私贡献。

如果你想提交新的翻译文件，请在对应目录点击 Upload files 按钮，然后选择文件上传。由于网页上无法直接创建中文目录，你也可以直接把改好名字的文件夹拖过来上传。

如果发现有问题的翻译，或者可以改进的地方，请直接点击文件然后点击右上角的“笔图标”进行修改。

建议上传前在csv里加上自己的ID。可以在文件末尾加一行，id写成备注就行，注意半角逗号数量跟前面一致。具体格式不限，能让人看出是你翻译的就行。这样也不会影响汉化，插件会忽略这行信息。
还有一个选择是在剧情简介里加上你的id，这样别人想skip时，可能就会被你帅气的昵称所震慑，不敢妄动。
如果你懒得加就算了，只是我要找到译者比较困难。

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

### 角色名
关于角色名，遇到未翻译的名字也会在数据目录下生成对应的csv(npc-name-en.csv和npc-name-jp.csv)，
在里面填上对应名字游戏里就会替换了。

这里是目前代码库里已有的[日文名](https://github.com/BLHXFY-Group/BLHXFY/blob/master/data/npc-name-jp.csv) 以及 [英文名](https://github.com/BLHXFY-Group/BLHXFY/blob/master/data/npc-name-en.csv)


## License
<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="知识共享许可协议" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />翻译文本采用<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议</a>进行许可
