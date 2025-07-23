---
titleTemplate: TS
bracketEscaping: true
---

# TypeScript中的类型系统详解

TypeScript 是 JavaScript 的超集，其强大的类型系统是它最核心的特性之一。TypeScript 提供了丰富的类型系统，既包含 JavaScript 原有的类型，又扩展了许多静态类型。下面我将全面介绍 TypeScript 中的类型。

## 一、基础类型(Primitive Types)

TypeScript 继承了 JavaScript 的基础类型，并添加了类型注解支持：

1. **number** - 数字类型
   ```typescript
   let age: number = 25;
   let price: number = 99.99;
   ```

2. **string** - 字符串类型
   ```typescript
   let name: string = "Alice";
   let greeting: string = 'Hello, TypeScript!';
   ```

3. **boolean** - 布尔类型
   ```typescript
   let isActive: boolean = true;
   let hasPermission: boolean = false;
   ```

4. **null** - 空值
   ```typescript
   let emptyValue: null = null;
   ```

5. **undefined** - 未定义
   ```typescript
   let notDefined: undefined = undefined;
   ```

6. **symbol** - 符号(ES6新增)
   ```typescript
   const sym: symbol = Symbol('unique');
   ```

7. **bigint** - 大整数(ES2020新增)
   ```typescript
   let bigNum: bigint = 100n;
   ```

## 二、特殊基础类型

1. **void** - 表示没有返回值的函数
   ```typescript
   function logMessage(): void {
     console.log("This function doesn't return anything");
   }
   ```

2. **any** - 任意类型(关闭类型检查)
   ```typescript
   let dynamicValue: any = "initial";
   dynamicValue = 100; // OK
   dynamicValue = true; // OK
   ```

3. **unknown** - 类型安全的any(必须先进行类型检查)
   ```typescript
   let userInput: unknown = "initial";
   if (typeof userInput === "string") {
     console.log(userInput.toUpperCase()); // 安全
   }
   ```

4. **never** - 永远不会发生的值(用于抛出异常或无限循环的函数)
   ```typescript
   function throwError(message: string): never {
     throw new Error(message);
   }
   ```

## 三、对象类型(Object Types)

1. **对象字面量类型**
   ```typescript
   let person: { name: string; age: number } = {
     name: "Bob",
     age: 30
   };
   ```

2. **数组类型**
   - 元素类型后加`[]`
   ```typescript
   let numbers: number[] = [1, 2, 3];
   ```
   - 或使用泛型语法`Array<元素类型>`
   ```typescript
   let strings: Array<string> = ["a", "b", "c"];
   ```

3. **元组(Tuple)** - 固定长度和类型的数组
   ```typescript
   let point: [number, number] = [10, 20];
   ```

4. **枚举(Enum)** - 命名常量集合
   ```typescript
   enum Color {
     Red,
     Green,
     Blue
   }
   let c: Color = Color.Green;
   ```

5. **函数类型**
   ```typescript
   let add: (x: number, y: number) => number = function(x, y) {
     return x + y;
   };
   ```

## 四、高级类型(Advanced Types)

1. **联合类型(Union Types)** - 可以是多种类型之一
   ```typescript
   let id: number | string = 100;
   id = "abc123"; // OK
   ```

2. **交叉类型(Intersection Types)** - 组合多个类型
   ```typescript
   type Named = { name: string };
   type Aged = { age: number };
   type Person = Named & Aged;
   let person: Person = { name: "Alice", age: 25 };
   ```

3. **类型别名(Type Aliases)** - 为类型创建新名称
   ```typescript
   type Point = [number, number];
   let p: Point = [10, 20];
   ```

4. **接口(Interfaces)** - 定义对象形状
   ```typescript
   interface User {
     name: string;
     age?: number; // 可选属性
     readonly id: number; // 只读属性
   }
   let user: User = { name: "Bob", id: 1 };
   ```

5. **类类型**
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
   ```

6. **泛型(Generics)** - 可重用的类型
   ```typescript
   function identity<T>(arg: T): T {
     return arg;
   }
   let output = identity<string>("hello");
   ```

7. **类型断言(Type Assertions)** - 告诉编译器你知道值的类型
   ```typescript
   let someValue: unknown = "this is a string";
   let strLength: number = (someValue as string).length;
   // 或使用尖括号语法(不推荐在.tsx文件中使用)
   let strLength2: number = (<string>someValue).length;
   ```

8. **索引类型(Index Types)**
   ```typescript
   function getProperty<T, K extends keyof T>(obj: T, key: K) {
     return obj[key];
   }
   let x = { a: 1, b: 2, c: 3 };
   getProperty(x, "a"); // OK
   getProperty(x, "m"); // Error
   ```

9. **映射类型(Mapped Types)**
   ```typescript
   type Readonly<T> = {
     readonly [P in keyof T]: T[P];
   };
   type Partial<T> = {
     [P in keyof T]?: T[P];
   };
   ```

10. **条件类型(Conditional Types)**
    ```typescript
    type IsString<T> = T extends string ? true : false;
    type A = IsString<string>; // true
    type B = IsString<number>; // false
    ```

11. **模板字面量类型(Template Literal Types)**
    ```typescript
    type EventName = 'click' | 'scroll' | 'mousemove';
    type HandlerName = `on${Capitalize<EventName>}`;
    // 结果为: "onClick" | "onScroll" | "onMousemove"
    ```

## 五、实用工具类型(Utility Types)

TypeScript 提供了一些内置的工具类型，基于泛型构建：

1. **Partial<T>** - 将所有属性变为可选
   ```typescript
   interface User {
     name: string;
     age: number;
   }
   type PartialUser = Partial<User>;
   ```

2. **Required<T>** - 将所有属性变为必选
   ```typescript
   type RequiredUser = Required<PartialUser>;
   ```

3. **Readonly<T>** - 将所有属性变为只读
   ```typescript
   type ReadonlyUser = Readonly<User>;
   ```

4. **Record<K,T>** - 构造键类型为K，值类型为T的类型
   ```typescript
   type Pages = 'home' | 'about' | 'contact';
   type PageContent = Record<Pages, string>;
   ```

5. **Pick<T,K>** - 从T中选取K指定的属性
   ```typescript
   type UserBasicInfo = Pick<User, 'name'>;
   ```

6. **Omit<T,K>** - 从T中排除K指定的属性
   ```typescript
   type UserWithoutAge = Omit<User, 'age'>;
   ```

7. **Exclude<T,U>** - 从T中排除可以赋值给U的类型
   ```typescript
   type T = 'a' | 'b' | 'c';
   type U = 'a' | 'b';
   type Result = Exclude<T, U>; // 'c'
   ```

8. **Extract<T,U>** - 从T中提取可以赋值给U的类型
   ```typescript
   type Result = Extract<T, U>; // 'a' | 'b'
   ```

9. **NonNullable<T>** - 从T中排除null和undefined
   ```typescript
   type T = string | null | undefined;
   type NonNullableT = NonNullable<T>; // string
   ```

10. **ReturnType<T>** - 获取函数返回值类型
    ```typescript
    function getUser(): { name: string; age: number } {
      return { name: "Alice", age: 25 };
    }
    type UserType = ReturnType<typeof getUser>;
    ```

11. **ConstructorParameters<T>** - 获取构造函数参数类型组成的元组
    ```typescript
    class Person {
      constructor(public name: string, public age: number) {}
    }
    type PersonParams = ConstructorParameters<typeof Person>; // [string, number]
    ```

12. **Uppercase<T>, Lowercase<T>, Capitalize<T>, Uncapitalize<T>** - 字符串字面量类型的转换
    ```typescript
    type T = 'hello';
    type U = Uppercase<T>; // 'HELLO'
    ```

## 六、类型兼容性(Type Compatibility)

TypeScript 使用结构化类型系统(鸭子类型系统)，只要结构匹配就认为类型兼容：

```typescript
interface Named {
  name: string;
}

class Person {
  name: string;
}

let p: Named;
p = new Person(); // OK，因为Person有name属性
```

## 七、类型保护(Type Guards)

TypeScript 提供了多种类型保护机制：

1. **typeof 类型保护**
   ```typescript
   function isNumber(x: any): x is number {
     return typeof x === "number";
   }
   ```

2. **instanceof 类型保护**
   ```typescript
   class Bird {
     fly() {}
   }
   class Fish {
     swim() {}
   }
   function move(pet: Bird | Fish) {
     if (pet instanceof Bird) {
       pet.fly();
     } else {
       pet.swim();
     }
   }
   ```

3. **in 类型保护**
   ```typescript
   function move(pet: Bird | Fish) {
     if ("fly" in pet) {
       pet.fly();
     } else {
       pet.swim();
     }
   }
   ```

4. **自定义类型保护**
   ```typescript
   function isFish(pet: Bird | Fish): pet is Fish {
     return (pet as Fish).swim !== undefined;
   }
   ```

## 八、总结

TypeScript 的类型系统非常丰富，从基础类型到高级类型，从静态类型到动态类型检查，提供了全面的类型安全保障。主要特点包括：

1. **静态类型检查**：在编译时捕获类型错误
2. **类型推断**：自动推断变量类型
3. **类型注解**：显式声明变量类型
4. **类型兼容性**：基于结构而非名义
5. **类型保护**：在运行时检查类型
6. **泛型**：可重用的类型组件
7. **工具类型**：简化复杂类型操作

TypeScript 的类型系统既强大又灵活，既能满足大型项目的严格类型检查需求，又能通过`any`和`unknown`等类型适应JavaScript的动态特性，是现代前端开发不可或缺的工具。
