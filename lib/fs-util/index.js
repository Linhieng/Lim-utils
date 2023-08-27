const fs = require("fs");
const path = require("path");
const rd = fs.readdirSync;
const j = path.join;
const exist = fs.existsSync;

/**
 * 只有当能够访问到该文件，并且该文件类型是目录时，才会返回 true
 * @param {string} f 一个目录字符串
 * @returns 当文件不存在或者文件不是目录时，返回 false
 */
function isDir(f) {
  try {
    return fs.statSync(f).isDirectory();
  } catch (error) {
    return false;
  }
}

/**
 * 只有当能够访问到该文件，并且该文件类型是文件时，才会返回 true
 * @param {string} f 一个文件字符串
 * @returns 当文件不存在或者文件是目录时，返回 false
 */
function isFile(f) {
  try {
    return fs.statSync(f).isFile();
  } catch (error) {
    return false;
  }
}

/**
 * 返回一个一维数组，该数组包含 root 目录下的所有文件的完整文件路径（递归）
 * 支持正则匹配，默认匹配所有文件
 * @param {string | string[]} root 一个目录字符串或者一个目录字符串数组
 * @param {RegExp} reg 正则匹配文件
 * @returns
 */
function getAllFullFileName(root, reg = /.*/) {
  const stack = [];
  const all_full_filename = [];
  const had_visited = new Set();

  if (typeof root === "string") {
    if (isDir(root)) {
      stack.push(root);
    } else {
      return root;
    }
  } else if (root instanceof Array) {
    for (const file of root) {
      if (isDir(file)) {
        stack.push(file);
      } else if (isFile(file)) {
        all_full_filename.push(file);
      }
    }
  } else {
    return all_full_filename;
  }

  while (stack.length !== 0) {
    const cur = stack.pop();
    had_visited.add(cur);
    if (isDir(cur)) {
      for (const file of rd(cur)) {
        const fullFileName = j(cur, file);
        if (false === had_visited.has(fullFileName)) {
          stack.push(cur);
          stack.push(fullFileName);
          break;
        }
      }
    } else {
      if (reg.test(cur)) {
        all_full_filename.push(cur);
      }
    }
  }
  return all_full_filename;
}

/**
 * 返回文件基本的名称。
 * @param {string} file 一个文件路径。
 * @returns
 */
function getFileBasename(file) {
  if (/[/\\]$/.test(file)) {
    throw new Error("非法的 file");
  }

  const seq = /\//.test(file) ? "/" : "\\";
  return file
    .trim()
    .split(seq)
    .filter((e) => e.length !== 0)
    .pop();
}

/**
 * （同步）删除文件或目录
 * @param {string} file 完整的文件/目录路径
 */
function rm(file) {
  if (exist(file)) {
    fs.rmSync(file, { recursive: true, force: true });
  }
}

/**
 * （同步）递归创建目录
 * @param {string} dirPath 要创建的目录，支持递归创建
 * @param {string} folder 指定在 folder 目录下创建，如果 folder 不存在则报错
 */
function mkdir(dirPath, folder = "") {
  if (folder !== "") {
    if (/^[a-zA-Z]:/.test(dirPath) && /^[a-zA-Z]:/.test(folder)) {
      throw new Error("dirPath 与 folder 无法拼接");
    }
    if (!isDir(folder)) {
      throw new Error("非法的 folder");
    }
  }
  const seq = /\//.test(dirPath) ? "/" : "\\";

  dirPath
    .trim()
    .split(seq)
    .filter((e) => e.length !== 0) // 处理 a/////b///c 这种情况
    .reduce((pre, cur) => {
      if (/^[a-zA-Z]:/.test(cur)) {
        return cur;
      }
      const dir = j(pre, cur);
      if (false === fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      return dir;
    }, folder);
}

/**
 * （同步）通过一个路径来创建文件。当不存在文件夹时，会自动该文件夹。路径分隔符支持 / 和 \\
 * 注意：如果路径以 / 或者 \ 结尾，将会抛出错误。
 * 注意：如果提供了 folder，必须确保 folder 存在，否则将抛出错误。
 * @param {string} filePath 要创建的文件路径
 * @param {string} folder 在该路径下开始创建
 * @returns
 */
function mkfile(filePath, folder = "") {
  if (folder !== "") {
    if (/^[a-zA-Z]:/.test(filePath) && /^[a-zA-Z]:/.test(folder)) {
      throw new Error("filePath 与 folder 无法拼接");
    }
    if (!isDir(folder)) {
      throw new Error("非法的 folder");
    }
  }

  if (/[/\\]$/.test(filePath)) {
    throw new Error("非法的 filePath");
  }

  const seq = /\\/.test(filePath) ? "\\" : "/";

  filePath
    .trim()
    .split(seq)
    .filter((e) => e.length !== 0) // 处理 a/////b///c 这种情况
    .reduce((pre, cur, i, arr) => {
      if (pre === "" && /^[a-zA-Z]:/.test(cur)) {
        return cur;
      }
      const file = j(pre, cur);
      if (i == arr.length - 1) {
        fs.writeFileSync(file, "", "utf-8");
      }
      if (false === fs.existsSync(file)) {
        fs.mkdirSync(file);
      }
      return file;
    }, folder);
}

module.exports = {
  rd,
  j,
  isDir,
  isFile,
  rm,
  exist,
  getAllFullFileName,
  getFileBasename,

  mkdir,
  mkfile,
};
