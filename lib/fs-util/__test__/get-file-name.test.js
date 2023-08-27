const { getFileBasename } = require("..");

/* eslint-env jest */

describe("测试 getFileBasename", () => {
  test("期待一个错误：非法的 file", () => {
    expect(() => getFileBasename("a\\")).toThrowError("非法的 file");
    expect(() => getFileBasename("a/")).toThrowError("非法的 file");
  });

  test("基本场景", () => {
    const test_val = [
      "C:\\Users\\Public\\githubcode\\Private\\local-js-utils\\.vscode\\settings.abd.json",
      ".vscode\\settings.abd.json",
      ".\\.vscode\\settings.abd.json",
      "C:/Users/Public/githubcode/Private/local-js-utils/.vscode/settings.abd.json",
      ".vscode/settings.abd.json",
      "./.vscode/settings.abd.json",
      "settings.abd.json",
    ];
    const true_val = "settings.abd.json";

    for (const val of test_val) {
      expect(getFileBasename(val)).toBe(true_val);
    }
  });
});
