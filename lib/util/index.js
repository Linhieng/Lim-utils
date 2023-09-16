function createProxy(raw = {}) {
  return new Proxy(raw, {
    get(target, property, receiver) {
      if (Reflect.get(target, property, receiver) === undefined) {
        Reflect.set(target, property, createProxy(), receiver);
      }
      return Reflect.get(target, property, receiver);
    },
  });
}

function isObject(val) {
  return typeof val === "object" && val !== null && !Array.isArray(val);
}

function mergeObj(obj1, obj2) {
  for (const key of Object.keys(obj2)) {
    if (key === "__errors") {
      if (obj1[key] instanceof Array) {
        if (obj2[key] instanceof Array) {
          obj1[key].push(...obj2[key]);
        } else if (typeof obj2[key] === "string") {
          obj1[key].push(obj2[key]);
        }
      } else if (typeof obj1[key] === "string") {
        if (obj2[key] instanceof Array) {
          obj1[key] = [obj1[key], ...obj2[key]];
        } else if (typeof obj2[key] === "string") {
          obj1[key] = [obj1[key], obj2[key]];
        }
      } else if (obj1[key] === undefined) {
        if (obj2[key] instanceof Array) {
          obj1[key] = [...obj2[key]];
        } else if (typeof obj2[key] === "string") {
          obj1[key] = [obj2[key]];
        }
      } else {
        throw new Error(
          `属性 ${key} 类型不兼容, ${typeof obj1[
            key
          ]} is not assignable to ${typeof obj2[key]}`,
        );
      }
    } else if (isObject(obj2[key])) {
      if (!isObject(obj1[key])) {
        obj1[key] = {};
      }
      mergeObj(obj1[key], obj2[key]);
    }
  }
  return obj1;
}

/**
 * 将 agent 上的所有 __errors 拷贝到 target 上
 * 保证 target 的 __errors 是字符串数组
 * 保证 agent 的 __errors 是字符串数组
 * 保证 target 和 agent 的“根节点”只有 __errors
 */
function mergeErrorSchema(target, agent) {
  Object.keys(agent).forEach((key) => {
    if (key === "__errors") {
      if (Array.isArray(target[key])) {
        target[key].push(...agent[key]);
      } else {
        target[key] = [...agent[key]];
      }
    } else if (isObject(agent[key])) {
      if (!isObject(target[key])) {
        target[key] = {};
      }
      mergeErrorSchema(target[key], agent[key]);
    }
  });
}

module.exports = {
  createProxy,
  isObject,
  mergeObj,
  mergeErrorSchema,
};
