/* eslint-env jest */

const os = require("os");
const { mkfile, mkdir, j, rm, exist } = require("..");

describe("测试 mkfile", () => {
  const TEST_DIR = j(os.tmpdir(), "fs-util", "mkfile");

  beforeAll(() => {
    mkdir(j("fs-util", "mkfile"), os.tmpdir());
  });
  afterAll(() => {
    rm(TEST_DIR);
  });

  test("期待一个错误：非法的 filePath", () => {
    expect(() => mkfile("a/b/c.txt/")).toThrow("非法的 filePath");
    expect(() => mkfile("a\\b\\c.txt\\")).toThrow("非法的 filePath");
  });

  test("期待一个错误：非法的 folder", () => {
    expect(() => mkfile("a/b/c.txt", "C:\\nul\\nul")).toThrow("非法的 folder");
  });

  test("简单的创建一个文件", () => {
    const filepath = "a.txt";
    const file = j(TEST_DIR, filepath);
    rm(file);
    mkfile(file);
    expect(exist(file)).toBe(true);
    rm(file);
    mkfile(filepath, TEST_DIR);
    expect(exist(file)).toBe(true);
    rm(file);
  });

  test("递归创建文件", () => {
    const filepath = "a/b/c/d/e/a.txt";
    const file = j(TEST_DIR, filepath);
    rm(file);
    mkfile(file);
    expect(exist(file)).toBe(true);
    rm(file);
    mkfile(filepath, TEST_DIR);
    expect(exist(file)).toBe(true);
    rm(file);
  });
});
