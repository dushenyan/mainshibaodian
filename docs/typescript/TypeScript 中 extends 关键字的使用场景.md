---
titleTemplate: TS
sidebar: false
bracketEscaping: true
---

# TypeScript 中 extends 关键字的使用场景

面试官您好，我来详细介绍一下 TypeScript 中 `extends` 关键字的几种主要使用场景。`extends` 是 TypeScript 中非常核心的关键字，它在不同上下文中有不同的作用。

### 1. 类继承（Class Inheritance）

这是最经典的面向对象继承用法，与 ES6 类继承一致：

```typescript
class Animal {
  name: string;
  
  constructor(name: string) {
    this.name = name;
  }
  
  move(distance: number = 0) {
    console.log(`${this.name} moved ${distance}m.`);
  }
}

class Dog extends Animal {
  breed: string;
  
  constructor(name: string, breed: string) {
    super(name);
    this.breed = breed;
  }
  
  bark() {
    console.log('Woof! Woof!');
  }
}

const myDog = new Dog('Buddy', 'Golden Retriever');
myDog.bark(); // "Woof! Woof!"
myDog.move(10); // "Buddy moved 10m."
```

在这个例子中，`Dog` 类继承了 `Animal` 类的属性和方法，同时可以添加自己的属性和方法。

### 2. 接口继承（Interface Inheritance）

接口可以使用 `extends` 来扩展其他接口：

```typescript
interface Person {
  name: string;
  age: number;
}

interface Employee extends Person {
  employeeId: number;
  department: string;
}

const john: Employee = {
  name: 'John',
  age: 30,
  employeeId: 12345,
  department: 'Engineering'
};
```

接口可以多重继承：

```typescript
interface Shape {
  color: string;
}

interface PenStroke {
  penWidth: number;
}

interface Square extends Shape, PenStroke {
  sideLength: number;
}

const square: Square = {
  color: 'blue',
  penWidth: 5.0,
  sideLength: 10
};
```

### 3. 泛型约束（Generic Constraints）

在泛型中使用 `extends` 来约束类型参数：

```typescript
function logLength<T extends { length: number }>(arg: T): T {
  console.log(arg.length);
  return arg;
}

logLength([1, 2, 3]); // OK
logLength('hello'); // OK
logLength({ length: 42 }); // OK
logLength(123); // Error: number 没有 length 属性
```

这个例子中，`T extends { length: number }` 表示类型参数 `T` 必须包含 `length` 属性。

### 4. 条件类型（Conditional Types）

在 TypeScript 2.8 引入的条件类型中使用 `extends`：

```typescript
type IsString<T> = T extends string ? 'yes' : 'no';

type A = IsString<string>; // 'yes'
type B = IsString<number>; // 'no'
```

更实用的例子 - 提取数组元素类型：

```typescript
type Flatten<T> = T extends Array<infer U> ? U : T;

type StrArray = Array<string>;
type Str = Flatten<StrArray>; // string

type Num = Flatten<number>; // number
```

### 5. 类型参数约束（Type Parameter Constraints）

在定义类型时约束类型参数：

```typescript
type PickProperties<T, K extends keyof T> = {
  [P in K]: T[P];
};

interface User {
  name: string;
  age: number;
  email: string;
}

type UserBasicInfo = PickProperties<User, 'name' | 'age'>;
/*
等同于:
{
  name: string;
  age: number;
}
*/
```

### 6. 高级类型操作

在映射类型和工具类型中使用 `extends`：

```typescript
// 排除 null 和 undefined
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null | undefined>; // string

// 提取函数返回类型
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;

function foo(): number {
  return 42;
}

type FooReturn = ReturnType<typeof foo>; // number
```

## 通俗易懂的总结

可以把 `extends` 关键字想象成三种不同的工具：

1. **家族继承**（类/接口继承）：就像孩子继承父母的姓氏和财产一样，子类/接口可以继承父类/接口的属性和方法。

2. **类型安检门**（泛型约束）：就像进入某些场所需要满足特定条件（如身高要求），泛型类型必须满足 `extends` 后面的条件才能使用。

3. **类型判断器**（条件类型）：就像智能分类器，可以根据类型是否满足条件来返回不同的类型结果。

在实际开发中，`extends` 的这些不同用法共同构成了 TypeScript 强大的类型系统，让我们能够更精确地描述和约束类型关系，既提高了代码的安全性，也增强了工具的支持能力。

## 完整可运行示例

```typescript
// 类继承
class Animal {
  constructor(public name: string) {}
  move(distance: number = 0) {
    console.log(`${this.name} moved ${distance}m.`);
  }
}

class Snake extends Animal {
  constructor(name: string) {
    super(name);
  }
  move(distance = 5) {
    console.log("Slithering...");
    super.move(distance);
  }
}

// 接口继承
interface Shape {
  color: string;
}

interface Circle extends Shape {
  radius: number;
}

// 泛型约束
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

let x = { a: 1, b: 2, c: 3 };
getProperty(x, "a"); // okay
// getProperty(x, "z"); // error

// 条件类型
type TypeName<T> =
  T extends string ? "string" :
  T extends number ? "number" :
  T extends boolean ? "boolean" :
  "object";

type T0 = TypeName<string>;  // "string"
type T1 = TypeName<"a">;     // "string"
type T2 = TypeName<true>;    // "boolean"

// 实际使用示例
const snake = new Snake("Sammy");
snake.move();

const circle: Circle = { color: "red", radius: 10 };
console.log(circle);

console.log(getProperty(x, "b"));
```

这个完整示例展示了 `extends` 关键字在不同场景下的实际应用，您可以在 TypeScript 环境或 Playground 中运行查看效果。
