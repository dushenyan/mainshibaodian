# `typeof NaN` 的结果解析

## 1. 直接答案

`typeof NaN` 的返回值是：
```javascript
"number"
```

## 2. 深入解释

### 2.1 为什么是 "number"？

NaN（Not-a-Number）在 JavaScript 中是一种特殊的数值类型：
- 它是 Number 类型的一个特殊值
- 遵循 IEEE 754 浮点数标准中的特殊表示
- 在数字运算失败时产生（如 `0/0` 或 `Math.sqrt(-1)`）

```javascript
console.log(typeof NaN);          // "number"
console.log(typeof Math.sqrt(-1)); // "number"
```

### 2.2 历史背景

NaN 的设计源于 IEEE 754 浮点数标准：
- 1985年首次在 IEEE 754 标准中定义
- JavaScript 采用该标准表示非数字值
- 虽然名为 "Not-a-Number"，但类型上仍属于数字

## 3. 相关特性

### 3.1 NaN 的特殊行为

```javascript
// 1. NaN 不等于自身
console.log(NaN === NaN); // false

// 2. 检测 NaN 的正确方法
console.log(Number.isNaN(NaN));     // true
console.log(Object.is(NaN, NaN));   // true

// 3. 全局 isNaN 的陷阱
console.log(isNaN("string")); // true (会先尝试转换为数字)
```

### 3.2 产生 NaN 的常见操作

```javascript
// 数学运算
0 / 0              // NaN
Infinity - Infinity // NaN
Math.sqrt(-1)      // NaN

// 类型转换失败
Number("string")   // NaN
parseInt("abc")    // NaN
+"abc"             // NaN
```

## 4. 实际应用

### 4.1 安全检测 NaN

```javascript
// 不推荐（因为 isNaN 会先尝试类型转换）
if (isNaN(value)) { /* ... */ }

// 推荐方式
if (Number.isNaN(value)) { /* ... */ }
// 或
if (typeof value === 'number' && isNaN(value)) { /* ... */ }
```

### 4.2 TypeScript 中的处理

```typescript
function safeDivide(a: number, b: number): number | 'NaN' {
  const result = a / b;
  return Number.isNaN(result) ? 'NaN' : result;
}
```

## 5. 常见误区

### 5.1 错误理解 NaN 的类型

```javascript
// 错误认知：认为 NaN 是独立类型
type MyNumber = number | NaN; // 错误！NaN 已经是 number 类型

// 正确做法
type MyNumber = number; // 已经包含 NaN
```

### 5.2 混淆全局 isNaN 和 Number.isNaN

```javascript
// 全局 isNaN 会先尝试转换为数字
isNaN("123abc") // true

// Number.isNaN 不会转换
Number.isNaN("123abc") // false
```

## 6. 总结要点

1. **类型归属**：`typeof NaN` 返回 `"number"`，因为 NaN 是 Number 类型的特殊值
2. **不等特性**：NaN 是唯一不等于自身的值
3. **检测方法**：使用 `Number.isNaN()` 或 `Object.is(NaN, value)`
4. **运算产生**：无效数学运算会产生 NaN
5. **TS 处理**：在 TypeScript 中 NaN 仍被视为 number 类型

## 7. 记忆口诀

"非数也是数，类型查清楚；
自比总不真，检测用专门。"
