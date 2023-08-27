// spell-checker:word mkfile

const os = require("os");
const fs = require("fs");
const { rm, getAllFullFileName, j } = require("..");

/* eslint-env jest */

function mkfile(filePath, folder = "") {
  if (false === /[\\/]/.test(filePath)) {
    fs.writeFileSync(j(folder, filePath), "", "utf-8");
    return;
  }

  let seq = "/";
  if (/\\/.test(filePath)) {
    seq = "\\";
  }
  filePath
    .trim()
    .split(seq)
    .filter((e) => e.length !== 0)
    .reduce((pre, cur, i, arr) => {
      if (false === fs.existsSync(j(folder, pre))) {
        fs.mkdirSync(j(folder, pre));
      }
      if (i == arr.length - 1) {
        fs.writeFileSync(j(folder, pre, cur), "", "utf-8");
      }
      return j(pre, cur);
    });
}

function mkdir(dirPath, folder) {
  dirPath
    .trim()
    .split("\\")
    .filter((e) => e.length !== 0)
    .reduce((pre, cur) => {
      const dir = j(pre, cur);
      if (false === fs.existsSync(j(folder, dir))) {
        fs.mkdirSync(j(folder, dir));
      }
      return dir;
    }, "");
}

describe("递归获取目录中的所有文件", () => {
  let TEST_DIR = "";
  let excepted = [];

  beforeEach(() => {
    TEST_DIR = j(os.tmpdir(), "fs-util", "fs-get-full-file-name");
    mkdir(j("fs-util", "fs-get-full-file-name"), os.tmpdir());

    excepted = [
      "readme.md",
      "book1/readme.md",
      "book1/unit1/a.mp3",
      "book1/unit1/b.mp3",
      "book2/a.mp3",
      "book2/unit1/a.mp3",
    ];

    excepted.forEach((file) => mkfile(file, TEST_DIR));

    for (let i = 0; i < excepted.length; i++) {
      excepted[i] = j(TEST_DIR, excepted[i]);
    }
  });

  afterEach(() => {
    rm(TEST_DIR);
  });

  test("传入参数是文件夹字符串", () => {
    const received = getAllFullFileName(TEST_DIR);
    expect(received).toBeInstanceOf(Array);
    expect(received.length).toBe(excepted.length);
    expect(excepted).toEqual(expect.arrayContaining(received));
    expect(received).toEqual(expect.arrayContaining(excepted));
  });

  test("传入的参数是字符串数组", () => {
    excepted.shift();
    const received = getAllFullFileName([
      j(TEST_DIR, "book1"),
      j(TEST_DIR, "book2"),
    ]);
    expect(received).toBeInstanceOf(Array);
    expect(received.length).toBe(received.length);
    expect(received).toEqual(expect.arrayContaining(excepted));
    expect(excepted).toEqual(expect.arrayContaining(received));
  });
});
