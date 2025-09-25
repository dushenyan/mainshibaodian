# TypeScript 中 any 和 unknown 的区别详解

## 核心区别对比

| 特性                | any 类型                     | unknown 类型                  |
|---------------------|-----------------------------|------------------------------|
| **类型检查**         | 完全禁用类型检查              | 保留类型检查但类型未知         |
| **赋值自由**         | 可赋值给任意类型              | 不能赋值给非 unknown/any 类型 |
| **方法调用**         | 可直接调用任意方法            | 必须先进行类型检查或断言       |
| **类型安全**         | 完全放弃类型安全              | 保持类型安全                 |
| **使用场景**         | 兼容旧代码/快速原型           | 安全处理未知类型输入          |
| **类型收缩**         | 不需要                      | 需要类型守卫或断言            |

## 详细解释与代码示例

### 1. 类型检查行为差异

```typescript
// @环境: TypeScript 4.0+
let anyValue: any = "hello";
let unknownValue: unknown = "world";

// any 允许任意操作（危险！）
anyValue.toFixed(2); // 运行时可能出错
anyValue(); // 可以当函数调用（即使不是函数）

// unknown 禁止危险操作（安全）
// unknownValue.toUpperCase(); // 错误：Object is of type 'unknown'
// unknownValue(); // 错误：Object is of type 'unknown'
```

### 2. 赋值差异

```typescript
let str: string;
let num: number;
let unk: unknown;

str = anyValue; // 允许（危险，可能类型不匹配）
num = anyValue; // 允许

// str = unknownValue; // 错误：Type 'unknown' is not assignable to type 'string'
unk = unknownValue; // 允许
unk = anyValue; // 允许
```

### 3. 安全使用 unknown 的方式

```typescript
// 类型守卫
if (typeof unknownValue === 'string') {
    console.log(unknownValue.toUpperCase()); // 安全
}

// 类型断言
const strValue = unknownValue as string;
console.log(strValue.length);

// 用户自定义类型守卫
function isNumber(x: unknown): x is number {
    return typeof x === 'number';
}

if (isNumber(unknownValue)) {
    console.log(unknownValue.toFixed(2));
}
```

### 4. 实际应用场景对比

```typescript
// 从第三方库获取数据（推荐使用 unknown）
function fetchData(): unknown {
    return JSON.parse(localStorage.getItem('data') || 'null');
}

// 旧代码迁移（临时使用 any）
function legacyCode(input: any) {
    // 需要逐步替换为具体类型
    console.log(input.length);
}

// 处理 API 响应
interface ApiResponse {
    data: unknown;
    status: number;
}

function processResponse(response: ApiResponse) {
    if (response.status === 200) {
        // 安全处理未知 data 类型
        if (typeof response.data === 'object' && response.data !== null) {
            console.log('Received object data');
        }
    }
}
```

## 可运行完整示例

```typescript
// @环境: TypeScript 4.0+
// 完整示例可直接在 TypeScript Playground 运行

// 模拟从外部源获取数据
function getDataFromSource(): unknown {
    return Math.random() > 0.5 
        ? "字符串数据" 
        : { id: 123, value: "对象数据" };
}

// 使用 any 的危险示例
function processWithAny() {
    const data: any = getDataFromSource();
    console.log(data.toUpperCase()); // 运行时可能出错
}

// 使用 unknown 的安全示例
function processWithUnknown() {
    const data: unknown = getDataFromSource();
    
    if (typeof data === 'string') {
        console.log('字符串:', data.toUpperCase());
    } else if (typeof data === 'object' && data !== null) {
        console.log('对象:', JSON.stringify(data));
    } else {
        console.log('未知类型数据');
    }
}

// 测试运行
try {
    console.log('=== any 处理 ===');
    processWithAny(); // 50% 概率抛出运行时错误
} catch (e) {
    console.error('any 处理出错:', e);
}

console.log('\n=== unknown 处理 ===');
processWithUnknown(); // 总是安全执行

/* 可能的输出：
=== any 处理 ===
[对象数据].toUpperCase is not a function

=== unknown 处理 ===
字符串: 字符串数据
或
对象: {"id":123,"value":"对象数据"}
*/
```

## 最佳实践建议

1. **优先使用 unknown**：
   - 处理动态内容（JSON 解析、API 响应）
   - 类型安全的替代 any 的方案

2. **谨慎使用 any**：
   - 仅用于兼容旧代码
   - 快速原型开发阶段
   - 确实需要绕过类型检查的特殊情况

3. **迁移策略**：
   ```typescript
   // 从 any 迁移到 unknown 的步骤
   function migrateFromAny(value: any) {
       // 第一阶段：改为 unknown
       const safeValue: unknown = value;
       
       // 第二阶段：逐步添加类型检查
       if (typeof safeValue === 'string') {
           // 处理字符串
       }
   }
   ```

4. **类型收缩模式**：
   ```typescript
   // 使用类型谓词
   function isUserData(x: unknown): x is { name: string; age: number } {
       return typeof x === 'object' && 
              x !== null &&
              'name' in x && 
              'age' in x;
   }
   ```

## 通俗易懂的总结

"理解 `any` 和 `unknown` 的区别就像选择不同的安全策略：

1. **any 是关闭所有警报**：
   - 允许任何操作
   - 相当于告诉 TypeScript "别管这个变量"
   - 方便但危险，可能隐藏运行时错误

2. **unknown 是开启安全检查**：
   - 保持警惕但允许未知
   - 相当于说"我不确定这是什么，使用前请验证"
   - 需要先证明类型安全才能操作

**开发口诀**：
'未知输入用 unknown，any 只作最后选；
类型守卫先验证，安全代码少风险。'

在实际项目中：
- 新代码中几乎不需要使用 any
- 从第三方获取的数据应优先用 unknown
- 逐步将现有 any 替换为 unknown 或具体类型
- 结合类型守卫提高代码安全性"
