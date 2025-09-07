# TypeScript 中枚举与常量枚举的区别

## 核心区别概述

| 特性 | 常规枚举 (enum) | 常量枚举 (const enum) |
|------|---------------|----------------------|
| **编译结果** | 生成真实对象 | 完全擦除，内联值 |
| **运行时存在** | ✅ 是 | ❌ 否 |
| **性能影响** | 有运行时开销 | 无运行时开销 |
| **反向映射** | 支持 | 不支持 |
| **使用场景** | 需要运行时访问 | 仅编译时使用 |
| **代码体积** | 增加 | 减少 |

## 详细解释

### 1. 常规枚举 (enum)

常规枚举会生成真实的 JavaScript 对象，保留在运行时：

```typescript
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT'
}

// 编译后的JS代码：
/*
var Direction;
(function (Direction) {
    Direction["Up"] = "UP";
    Direction["Down"] = "DOWN";
    Direction["Left"] = "LEFT";
    Direction["Right"] = "RIGHT";
})(Direction || (Direction = {}));
*/
```

**特点**：
- 生成实际的运行时对象
- 支持反向映射（数字枚举）
- 可以通过 `Direction.Up` 在运行时访问
- 会增加输出代码体积

### 2. 常量枚举 (const enum)

常量枚举会在编译阶段被完全擦除，使用处直接替换为值：

```typescript
const enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT'
}

const move = Direction.Up;

// 编译后的JS代码：
/*
const move = "UP"; // 直接替换为值
*/
```

**特点**：
- 编译后不存在运行时对象
- 不支持反向映射
- 不能通过 `Direction.Up` 在运行时访问
- 减少代码体积，提升性能
- 必须在使用时就能确定值（不能延迟计算）

## 对比示例

### 1. 基本使用对比

```typescript
// 常规枚举
enum LogLevel {
  Info = 0,
  Warn = 1,
  Error = 2
}

// 常量枚举
const enum HttpStatus {
  OK = 200,
  NotFound = 404,
  ServerError = 500
}
```

### 2. 编译结果对比

**常规枚举编译结果**：
```javascript
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Info"] = 0] = "Info";
    LogLevel[LogLevel["Warn"] = 1] = "Warn";
    LogLevel[LogLevel["Error"] = 2] = "Error";
})(LogLevel || (LogLevel = {}));
```

**常量枚举编译结果**：
```javascript
// 无任何生成代码，使用处直接替换为值
const status = 200; // HttpStatus.OK → 200
```

### 3. 反向映射对比

```typescript
// 常规枚举支持反向映射
enum NumericEnum {
  A, B, C
}
console.log(NumericEnum[NumericEnum.A]); // "A"

// 常量枚举不支持反向映射
const enum ConstNumericEnum {
  A, B, C
}
// console.log(ConstNumericEnum[0]); // 错误！
```

## 使用场景建议

### 使用常规枚举当：
1. 需要在运行时访问枚举（如动态查找）
2. 需要反向映射功能
3. 枚举值可能被外部库使用
4. 需要序列化/反序列化枚举

```typescript
enum UserRole {
  Admin = 'ADMIN',
  User = 'USER'
}

// 运行时动态使用
function checkRole(role: string) {
  return Object.values(UserRole).includes(role as UserRole);
}
```

### 使用常量枚举当：
1. 仅编译时使用枚举
2. 追求极致性能
3. 需要最小化打包体积
4. 枚举值不会在运行时动态访问

```typescript
const enum KeyboardKey {
  Enter = 13,
  Escape = 27,
  Space = 32
}

function handleKeyPress(keyCode: number) {
  if (keyCode === KeyboardKey.Enter) {
    // ...
  }
}
```

## 性能影响分析

### 常规枚举
- **内存占用**：生成额外对象
- **访问速度**：需要属性查找
- **代码体积**：增加枚举定义代码

### 常量枚举
- **内存占用**：无
- **访问速度**：直接使用字面量
- **代码体积**：无额外代码

## 高级用法

### 1. 常量枚举的计算值

常量枚举允许有限的计算：

```typescript
const enum FilePermission {
  Read = 1 << 1,
  Write = 1 << 2,
  Execute = 1 << 3
}
// 使用处会直接替换为计算后的值
```

### 2. 环境常量枚举

声明但不定义常量枚举，用于类型检查：

```typescript
declare const enum Direction {
  Up,
  Down,
  Left,
  Right
}
```

## 限制与注意事项

1. **常量枚举的限制**：
   - 不能与常规枚举混用
   - 不能延迟计算值
   - 不能动态访问

2. **Babel 兼容性**：
   - 需要 `@babel/plugin-transform-typescript`
   - 需开启 `optimizeConstEnums` 选项

3. **发布库的考虑**：
   - 如果发布库供他人使用，常规枚举更安全

## 通俗易懂的总结

可以把枚举和常量枚举比作**两种不同的字典**：

1. **常规枚举**就像一本实体字典：
   - 真实存在，随时可以翻阅（运行时访问）
   - 可以正查反查（反向映射）
   - 但需要随身携带（增加代码体积）

2. **常量枚举**就像背下来的单词：
   - 没有实体书（无运行时对象）
   - 使用时直接说意思（直接替换为值）
   - 轻便高效（减少体积提升性能）
   - 但遇到生词就麻烦（不能动态访问）

**开发建议**：
- 应用代码优先使用常量枚举
- 库代码优先使用常规枚举
- 性能敏感区域使用常量枚举
- 需要灵活性的场景用常规枚举

**完整实例**

```typescript
// 常规枚举示例
enum Color {
  Red = '#FF0000',
  Green = '#00FF00',
  Blue = '#0000FF'
}

function getColorName(color: Color): string {
  // 运行时访问
  return Color[color] || 'Unknown';
}

// 常量枚举示例
const enum Size {
  Small = 'S',
  Medium = 'M',
  Large = 'L'
}

function getSizeLabel(size: Size): string {
  // 编译后直接替换为 'S', 'M', 'L'
  return size; 
}

// 测试
console.log(getColorName(Color.Red)); // "Red"
console.log(getSizeLabel(Size.Medium)); // "M"

// 查看编译结果差异
/*
// 常规枚举生成真实对象
var Color;
(function (Color) {
    Color["Red"] = "#FF0000";
    Color["Green"] = "#00FF00";
    Color["Blue"] = "#0000FF";
})(Color || (Color = {}));

// 常量枚举无生成代码，直接替换
console.log(getSizeLabel("M")); // "M"
*/
```

## EP01 反向枚举扩展


你代码中定义的 `NumericEnum` 是一个**字符串枚举**：

```typescript
enum NumericEnum {
  A = 'ADMIN', B = 'blin', C = 'CLass'
}
```

字符串枚举在 TypeScript 中**不支持反向映射**，也就是说：

```typescript
console.log(NumericEnum[NumericEnum.A]); // 这里会输出 undefined，而不是 "A"
```

因为 `NumericEnum.A` 是字符串 `'ADMIN'`，`NumericEnum['ADMIN']` 并不存在。

------

#### 反向映射只支持数字枚举

例如：

```typescript
enum NumericEnum {
  A, B, C
}
console.log(NumericEnum[NumericEnum.A]); // 输出 "A"
```

这是因为数字枚举的值是数字，TypeScript 会自动生成反向映射。

------
#### 如果你想实现字符串枚举的反向映射，可以手动写一个映射对象，例如：

```typescript
enum StringEnum {
  A = 'ADMIN',
  B = 'blin',
  C = 'CLass'
}

const reverseMap: Record<string, keyof typeof StringEnum> = {};
for (const key in StringEnum) {
  const value = StringEnum[key as keyof typeof StringEnum];
  reverseMap[value] = key as keyof typeof StringEnum;
}

console.log(reverseMap['ADMIN']); // 输出 "A"
```

这样你就可以通过字符串值反查对应的枚举键。

------

总结：

- **数字枚举支持自动反向映射**
- **字符串枚举不支持自动反向映射，需要手动实现**
