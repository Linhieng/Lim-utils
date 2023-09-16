/* eslint-disable */
const {
  createProxy,
  mergeObj,
  arrayPush,
  isObject,
  mergeErrorSchema,
} = require("..");

describe("createProxy", () => {
  test("test createProxy", () => {
    const proxy = createProxy();
    proxy.a.b.c.d.e.f = 1;
    expect(proxy.a.b.c.d.e.f).toBe(1);
  });

  test("test createProxy with custom raw", () => {
    const raw = {};
    const proxy = createProxy(raw);
    proxy.a.b.c.d.e.f = 1;
    expect(raw.a.b.c.d.e.f).toBe(1);
  });
});

describe("isObject", () => {
  test("array is not Object", () => {
    const array = [];
    expect(isObject(array)).toBeFalsy();
  });
  test("null is not Object", () => {
    expect(isObject(null)).toBeFalsy();
  });
  test("{} is Object", () => {
    expect(isObject({})).toBeTruthy();
  });
});

describe("mergeObj", () => {
  test("errors 是 undefined 和 array", () => {
    const obj1 = {};
    const obj2 = {
      name: {
        __errors: ["名称过长"],
      },
    };
    const ans = {
      name: {
        __errors: ["名称过长"],
      },
    };
    const obj3 = mergeObj(obj1, obj2);
    expect(obj3).toEqual(ans);
  });
  test("errors 是 undefined 和 string", () => {
    const obj1 = {};
    const obj2 = {
      name: {
        __errors: "名称过长",
      },
    };
    const ans = {
      name: {
        __errors: ["名称过长"],
      },
    };
    const obj3 = mergeObj(obj1, obj2);
    expect(obj3).toEqual(ans);
  });
  test("errors 是 string 和 string", () => {
    const obj1 = {
      name: {
        __errors: "名称过长a",
      },
    };
    const obj2 = {
      name: {
        __errors: "名称过长b",
      },
    };
    const ans = {
      name: {
        __errors: ["名称过长a", "名称过长b"],
      },
    };
    const obj3 = mergeObj(obj1, obj2);
    expect(obj3).toEqual(ans);
  });
  test("errors 是 string 和 array", () => {
    const obj1 = {
      name: {
        __errors: "名称过长a",
      },
    };
    const obj2 = {
      name: {
        __errors: ["名称过长b"],
      },
    };
    const ans = {
      name: {
        __errors: ["名称过长a", "名称过长b"],
      },
    };
    const obj3 = mergeObj(obj1, obj2);
    expect(obj3).toEqual(ans);
  });
  test("errors 是 array 和 string", () => {
    const obj1 = {
      name: {
        __errors: ["名称过长a"],
      },
    };
    const obj2 = {
      name: {
        __errors: "名称过长b",
      },
    };
    const ans = {
      name: {
        __errors: ["名称过长a", "名称过长b"],
      },
    };
    const obj3 = mergeObj(obj1, obj2);
    expect(obj3).toEqual(ans);
  });
  test("errors 是 array 和 array", () => {
    const obj1 = {
      name: {
        __errors: ["名称过长1"],
      },
    };
    const obj2 = {
      name: {
        __errors: ["名称过长2"],
      },
    };
    const ans = {
      name: {
        __errors: ["名称过长1", "名称过长2"],
      },
    };
    const obj3 = mergeObj(obj1, obj2);
    expect(obj3).toEqual(ans);
  });
  test("errors 是 object 和 string, 期待报错", () => {
    const obj1 = {
      name: {
        __errors: {},
      },
    };
    const obj2 = {
      name: {
        __errors: "名称过长2",
      },
    };
    expect(() => mergeObj(obj1, obj2)).toThrow();
  });
  test("obj 多层级合并", () => {
    const obj1 = {
      a: {
        a1: {
          __errors: ["名称过长a1"],
        },
      },
    };
    const obj2 = {
      a: {
        __errors: ["名称过长a"],
        b: {
          __errors: ["名称过长b"],
          c: {
            __errors: ["名称过长c"],
          },
        },
      },
    };
    const ans = {
      a: {
        __errors: ["名称过长a"],
        a1: {
          __errors: ["名称过长a1"],
        },
        b: {
          __errors: ["名称过长b"],
          c: {
            __errors: ["名称过长c"],
          },
        },
      },
    };
    const obj3 = mergeObj(obj1, obj2);
    expect(obj3).toEqual(ans);
  });
});

describe("mergeErrorSchema", () => {
  test("__errors 是 array 和 array", () => {
    const target = {
      a: { __errors: ["1", "2"] },
      b: { __errors: ["1", "2"] },
    };
    const agent = {
      a: { __errors: ["3", "4"] },
    };
    const ans = {
      a: { __errors: ["1", "2", "3", "4"] },
      b: { __errors: ["1", "2"] },
    };
    mergeErrorSchema(target, agent);
    expect(target).toEqual(ans);
  });
  test("__errors 是 undefined 和 array", () => {
    const target = {
      b: { __errors: ["1", "2"] },
    };
    const agent = {
      a: { __errors: ["3", "4"] },
    };
    const ans = {
      a: { __errors: ["3", "4"] },
      b: { __errors: ["1", "2"] },
    };
    mergeErrorSchema(target, agent);
    expect(target).toEqual(ans);
  });
});
