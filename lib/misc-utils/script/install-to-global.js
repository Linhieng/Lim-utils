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
