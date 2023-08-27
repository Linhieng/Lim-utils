/* eslint-env jest */

const os = require("os");
const fs = require("fs");
const { mkdir, j, exist, rm } = require("..");

describe("测试 mkdir", () => {
  const TEST_DIR = j(os.tmpdir(), "fs-util", "mkdir");

  beforeAll(() => {
    fs.rmSync(j(os.tmpdir(), "fs-util"), { recursive: true, force: true });
    fs.rmSync(j(os.tmpdir(), "fs-util", "mkdir"), {
      recursive: true,
      force: true,
    });
    fs.mkdirSync(j(os.tmpdir(), "fs-util"));
    fs.mkdirSync(j(os.tmpdir(), "fs-util", "mkdir"));
  });
  afterAll(() => {
    rm(TEST_DIR);
  });

  test("期待一个错误:  dirPath 与 folder 无法拼接", () => {
    expect(() => mkdir(TEST_DIR, TEST_DIR)).toThrowError(
      "dirPath 与 folder 无法拼接",
    );
  });

  test("期待一个错误：非法的 folder", () => {
    expect(() => mkdir("a/b/c", "C:\\a\\b\\c")).toThrowError("非法的 folder");
  });

  test("创建单个目录", () => {
    mkdir("a", TEST_DIR);
    expect(exist(j(TEST_DIR, "a"))).toBe(true);
    const dir = j(__dirname, "b");
    mkdir(dir);
    expect(exist(dir)).toBe(true);
    fs.rmdirSync(dir);
  });

  test("创建多个目录", () => {
    mkdir("a/b/c/d/e", TEST_DIR);
    expect(exist(j(TEST_DIR, "a/b/c/d/e"))).toBe(true);
    const dir = j(__dirname, "a/b/c/d/e");
    mkdir(dir);
    expect(exist(dir)).toBe(true);
    rm(j(__dirname, "a"));
  });
});
