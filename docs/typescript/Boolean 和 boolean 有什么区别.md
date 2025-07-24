---
sidebar: false
outline: [2, 3, 4]
---

# Boolean 和 boolean 有什么区别

在 TypeScript 中，`Boolean` 和 `boolean` 看起来非常相似，但它们实际上代表完全不同的概念，有着重要的区别：

## 1. `boolean` - 原始布尔类型

`boolean` 是 TypeScript 中的基本原始类型(primitive type)，表示 JavaScript 中的 `true` 或 `false` 值。

```typescript
let isDone: boolean = false;  // 正确
isDone = true;                // 正确
isDone = new Boolean(true);   // 错误！不能将 Boolean 对象赋值给 boolean 类型
```

特点：
- 表示 JavaScript 的原始布尔值
- 是值类型(不是对象)
- 性能更好(因为是原始类型)
- 是 TypeScript 中推荐使用的布尔类型

## 2. `Boolean` - 布尔包装对象类型

`Boolean` 是 JavaScript 的布尔包装对象(Boolean wrapper object)的类型，它是通过 `new Boolean()` 创建的对象。

```typescript
let isDone: Boolean = new Boolean(false);  // 正确
isDone = false;                            // 错误！不能将原始布尔值赋值给 Boolean 类型
```

特点：
- 是 JavaScript 的 Boolean 包装对象类型
- 是引用类型(对象)
- 可以访问 Boolean 对象的方法(如 `toString()`)
- 在 TypeScript 中通常不推荐使用

## 关键区别

| 特性        | `boolean` (原始类型) | `Boolean` (包装对象) |
|------------|---------------------|---------------------|
| 类型        | 原始类型(primitive) | 对象类型(object)    |
| 创建方式    | `let b: boolean = true;` | `let b: Boolean = new Boolean(true);` |
| 存储        | 直接存储值           | 存储对象引用         |
| 性能        | 更高                 | 较低(因为是对象)     |
| 方法访问    | 不能直接访问方法     | 可以访问方法         |
| 推荐使用    | 推荐                 | 不推荐               |
| 自动装箱    | JavaScript 会自动将原始值转换为包装对象(当调用方法时) | - |

## 为什么 `Boolean` 包装对象不推荐使用

1. **不必要的复杂性**：原始布尔值已经足够满足所有需求
2. **性能开销**：创建对象比使用原始值有额外的性能开销
3. **潜在的混淆**：`Boolean` 包装对象的 `valueOf()` 方法返回原始值，可能导致意外行为
4. **类型安全**：TypeScript 的类型系统更倾向于使用原始类型

## 实际示例

```typescript
// 正确的使用方式 - 使用 boolean 原始类型
let isActive: boolean = true;
if (isActive) {
  console.log("Active");  // 直接使用原始值
}

// 不推荐的使用方式 - 使用 Boolean 包装对象
let isDisabled: Boolean = new Boolean(false);
if (isDisabled.valueOf()) {  // 必须调用 valueOf() 获取原始值
  console.log("Disabled");
}

// JavaScript 的自动装箱(不推荐依赖这种行为)
let primitiveBool: boolean = true;
let objBool: Boolean = new Boolean(true);

// 以下比较会返回 false，因为一个是原始值，一个是对象
console.log(primitiveBool === objBool);  // false

// 即使值相同，类型也不同
function acceptBoolean(b: boolean) {}
acceptBoolean(primitiveBool);  // OK
acceptBoolean(objBool);        // 错误！
```

## 总结

- **总是优先使用 `boolean`**：这是 TypeScript 中表示布尔值的正确方式
- **避免使用 `Boolean`**：除非你有特殊需求需要使用 Boolean 包装对象(这种情况非常罕见)
- **记住**：在 JavaScript 中，`typeof true` 返回 `"boolean"`，而 `typeof new Boolean(true)` 返回 `"object"`

这种区别类似于 TypeScript 中其他原始类型和它们的包装对象之间的区别(如 `number` vs `Number`，`string` vs `String`)。
