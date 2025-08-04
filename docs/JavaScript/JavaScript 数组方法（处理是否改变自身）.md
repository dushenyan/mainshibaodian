# JavaScript 数组方法：改变自身 vs 不改变自身

## 会改变原数组的方法（破坏性方法）

这些方法会直接修改原数组的内容：

### 1. 修改元素
- `push()` - 末尾添加元素
- `pop()` - 删除并返回最后一个元素
- `unshift()` - 开头添加元素
- `shift()` - 删除并返回第一个元素

```javascript
const arr = [1, 2, 3];
arr.push(4); // arr 变为 [1, 2, 3, 4]
```

### 2. 排序和重排
- `sort()` - 排序数组
- `reverse()` - 反转数组顺序

```javascript
const arr = [3, 1, 2];
arr.sort(); // arr 变为 [1, 2, 3]
```

### 3. 增删改操作
- `splice()` - 添加/删除/替换元素
- `fill()` - 填充数组元素
- `copyWithin()` - 复制数组内元素

```javascript
const arr = [1, 2, 3, 4];
arr.splice(1, 2, 'a', 'b'); // arr 变为 [1, 'a', 'b', 4]
```

## 不会改变原数组的方法（非破坏性方法）

这些方法返回新值或新数组，不改变原数组：

### 1. 查询和访问
- `concat()` - 合并数组
- `slice()` - 提取部分数组
- `join()` - 数组转字符串
- `indexOf()`/`lastIndexOf()` - 查找元素位置
- `includes()` - 判断是否包含元素

```javascript
const arr = [1, 2, 3];
const newArr = arr.concat([4, 5]); // arr 仍为 [1, 2, 3]
```

### 2. 迭代方法
- `map()` - 映射新数组
- `filter()` - 过滤数组
- `reduce()`/`reduceRight()` - 累计计算
- `find()`/`findIndex()` - 查找元素
- `every()`/`some()` - 条件判断

```javascript
const arr = [1, 2, 3];
const doubled = arr.map(x => x * 2); // arr 仍为 [1, 2, 3]
```

### 3. 其他
- `flat()`/`flatMap()` - 扁平化数组
- `toLocaleString()` - 本地化字符串表示
- `toString()` - 数组转字符串

```javascript
const arr = [1, [2, 3]];
const flattened = arr.flat(); // arr 仍为 [1, [2, 3]]
```

## 完整对比表格

| 方法 | 是否改变原数组 | 说明 |
|------|--------------|------|
| `push()` | ✅ | 末尾添加元素 |
| `pop()` | ✅ | 删除最后一个元素 |
| `unshift()` | ✅ | 开头添加元素 |
| `shift()` | ✅ | 删除第一个元素 |
| `sort()` | ✅ | 排序数组 |
| `reverse()` | ✅ | 反转数组 |
| `splice()` | ✅ | 增删改元素 |
| `fill()` | ✅ | 填充数组 |
| `copyWithin()` | ✅ | 内部复制元素 |
| `concat()` | ❌ | 合并数组 |
| `slice()` | ❌ | 提取子数组 |
| `join()` | ❌ | 数组转字符串 |
| `indexOf()` | ❌ | 查找元素位置 |
| `lastIndexOf()` | ❌ | 反向查找元素 |
| `includes()` | ❌ | 判断是否包含 |
| `map()` | ❌ | 映射新数组 |
| `filter()` | ❌ | 过滤数组 |
| `reduce()` | ❌ | 累计计算 |
| `find()` | ❌ | 查找元素 |
| `findIndex()` | ❌ | 查找元素索引 |
| `every()` | ❌ | 全满足条件 |
| `some()` | ❌ | 部分满足条件 |
| `flat()` | ❌ | 扁平化数组 |
| `flatMap()` | ❌ | 映射后扁平化 |
| `toLocaleString()` | ❌ | 本地化字符串 |
| `toString()` | ❌ | 转字符串 |

## 特殊案例

### `forEach()` - 不改变原数组

虽然 `forEach()` 可以修改数组元素，但它本身不改变数组结构：

```javascript
const arr = [1, 2, 3];
arr.forEach((item, index) => {
  arr[index] = item * 2; // 修改元素值
});
// arr 变为 [2, 4, 6] - 但这是通过修改元素实现的，不是 forEach 的直接行为
```

## 最佳实践建议

1. **函数式编程**：优先使用不改变原数组的方法，使代码更可预测
2. **性能考虑**：改变原数组的方法通常性能更好（避免创建新数组）
3. **明确意图**：如果确实需要修改原数组，使用破坏性方法并添加注释说明
4. **React/Vue 开发**：在状态管理中，通常应避免直接修改数组状态

## 示例：安全修改数组

```javascript
// 不推荐 - 直接修改
const addItem = (arr, item) => {
  arr.push(item); // 直接修改外部数组
};

// 推荐 - 返回新数组
const addItem = (arr, item) => {
  return [...arr, item]; // 不修改原数组
};
```

理解这些方法的区别对于编写可维护的 JavaScript 代码至关重要，特别是在状态管理和函数式编程场景中。
