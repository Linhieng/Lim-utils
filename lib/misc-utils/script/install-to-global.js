/**
 * TODO: 可以考虑提供一个选项，选择 npm 或者 pnpm
 * 但是 pnpm 似乎有点复杂，它支持 monorepo，但似乎有文件层级的要求（也许是我不太清楚）
 * 总之，pnpm 支持下面命令
 *    pnpm add .\linhieng-misc-utils-0.1.0.tgz
 * 但却不支持添加参数 -g
 *    pnpm add -g .\linhieng-misc-utils-0.1.0.tgz
 * 这样运行时会提示报错 
 *    ENOENT: no such file or directory, open 'C:\Users\k\AppData\Local\pnpm\global\5\linhieng-misc-utils-0.1.0.tgz'
 * 虽然我可以考虑将文件复制到对应为止，但这样子总感觉不对劲。
 * 如果使用 npm 则没有这么多问题。
 */
// get-package-name.js
const { execSync } = require('child_process');
const path = require('path');
function packAndInstallGlobally(packageJsonPath) {
  const packageDir = path.dirname(packageJsonPath);

  const output = execSync('npm pack', { cwd: packageDir });
  const packageName = output.toString().trim()
  console.log('打包成功')

  execSync(`npm i -g ${packageName}`);
  console.log('已安装到全局')
}

if (require.main === module) {
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  packAndInstallGlobally(packageJsonPath);
}
