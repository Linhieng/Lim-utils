# 杂烩工具包

因为是杂烩，所以并不打算发布到 npm 公开。
如果想要发布到 npm 公开，可以使用以下命令：

```sh
npm login
npm publish --access public
```

使用本 npm 包流程：：

```sh
git clone https://github.com/Linhieng/Lim-utils.git

cd Lim-utils/lib/misc-utils

npm run install-to-local
# 安装到本地全局 npm 包中

npm list -g
# 可以查看安装是否成功
```

剩下的工作，就是在仓库中直接导入就可以了，当前，要确保你的 node 能给检索到全局 npm 包。

```powershell
New-Item -ItemType SymbolicLink -Target (npm root -g) -Path "$HOME\.node_modules" -Force
# 直接在 ~ 目录中添加一个 .node_modules 文件，链接到 npm 全局包路径中

# 或者：

[Environment]::SetEnvironmentVariable("NODE_PATH", $(npm root -g), "Machine")
# 添加 NODE_PATH 到环境变量中
```
