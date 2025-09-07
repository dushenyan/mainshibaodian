# TypeScript 中的方法重写（Method Overriding）详解

## 一、基本概念

方法重写（Method Overriding）是面向对象编程中的重要特性，指子类重新定义父类中已有的方法。在 TypeScript 中，这是通过类继承实现的。

```typescript
class Animal {
    makeSound(): void {
        console.log("动物发出声音");
    }
}

class Dog extends Animal {
    makeSound(): void {
        console.log("汪汪汪！");
    }
}

const myDog = new Dog();
myDog.makeSound(); // 输出："汪汪汪！"
```

## 二、方法重写的核心特点

### 1. 继承关系要求
- 必须存在继承关系（extends）
- 只能重写父类中已存在的方法

### 2. 方法签名一致
重写方法必须与父类方法保持**相同的名称和参数类型**（返回值类型可以更具体）

```typescript
class Printer {
    print(content: string): void {
        console.log(content);
    }
}

class ColorPrinter extends Printer {
    // 正确：参数类型相同
    print(content: string): void {
        console.log(`\x1b[31m${content}\x1b[0m`); // 红色输出
    }
    
    // 错误：参数类型不同（不是重写，是重载）
    // print(content: number): void {} 
}
```

## 三、高级用法

### 1. 调用父类方法（super）

```typescript
class Vehicle {
    startEngine(): void {
        console.log("引擎启动");
    }
}

class Car extends Vehicle {
    startEngine(): void {
        super.startEngine(); // 调用父类方法
        console.log("车载系统初始化完成");
    }
}

const myCar = new Car();
myCar.startEngine();
/* 输出：
引擎启动
车载系统初始化完成
*/
```

### 2. 访问修饰符与重写

| 修饰符       | 能否重写 | 特点说明                     |
|--------------|----------|-----------------------------|
| `public`     | ✅        | 默认修饰符，可自由重写        |
| `protected`  | ✅        | 只能在子类中访问和重写       |
| `private`    | ❌        | 不能被子类访问和重写          |
| `readonly`   | -         | 属性修饰符，与方法重写无关    |

```typescript
class Base {
    public common() { console.log("Base"); }
    protected protectedMethod() { console.log("Protected"); }
    private privateMethod() { console.log("Private"); }
}

class Derived extends Base {
    // 正确：重写public方法
    common() { console.log("Derived"); }
    
    // 正确：重写protected方法
    protectedMethod() { console.log("New Protected"); }
    
    // 错误：不能重写private方法
    // privateMethod() {} 
}
```

### 3. 静态方法重写

```typescript
class Logger {
    static log(message: string): void {
        console.log(`[LOG] ${message}`);
    }
}

class TimestampLogger extends Logger {
    static log(message: string): void {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${message}`);
    }
}

TimestampLogger.log("用户登录"); // 输出带时间戳的日志
```

## 四、方法重写 vs 方法重载

| 特性         | 方法重写 (Overriding)               | 方法重载 (Overloading)            |
|--------------|------------------------------------|----------------------------------|
| **关系**     | 子类与父类之间                     | 同一个类内部                     |
| **目的**     | 改变实现逻辑                       | 提供多种参数调用方式             |
| **签名**     | 必须完全相同                       | 参数类型或数量必须不同           |
| **调用**     | 运行时决定（动态绑定）             | 编译时决定（静态绑定）           |

```typescript
// 重载示例（同一类内）
class Calculator {
    add(a: number, b: number): number;
    add(a: string, b: string): string;
    add(a: any, b: any): any {
        return a + b;
    }
}

// 重写示例（跨继承层次）
class ScientificCalculator extends Calculator {
    add(a: number, b: number): number {
        return super.add(a, b);
    }
}
```

## 五、实际应用场景

### 1. 框架中的生命周期方法

```typescript
abstract class Component {
    abstract render(): void;
    
    beforeMount(): void {
        console.log("默认挂载前逻辑");
    }
}

class MyComponent extends Component {
    render(): void {
        console.log("组件渲染");
    }
    
    beforeMount(): void {
        super.beforeMount();
        console.log("扩展的挂载前逻辑");
    }
}
```

### 2. 定制化业务逻辑

```typescript
class PaymentProcessor {
    validate(): boolean {
        return true; // 基础验证
    }
}

class CreditCardProcessor extends PaymentProcessor {
    validate(): boolean {
        return super.validate() && 
               this.checkCardNumber() && 
               this.checkExpiryDate();
    }
    
    private checkCardNumber(): boolean {
        /* 卡号验证逻辑 */
        return true;
    }
}
```

### 3. 模板方法模式

```typescript
abstract class DataExporter {
    export(): void {
        this.prepareData();
        this.formatData();
        this.save();
    }
    
    protected abstract prepareData(): void;
    
    protected formatData(): void {
        // 默认格式化实现
    }
    
    private save(): void {
        console.log("数据保存");
    }
}

class CSVExporter extends DataExporter {
    protected prepareData(): void {
        console.log("准备CSV数据");
    }
    
    protected formatData(): void {
        super.formatData();
        console.log("转换为CSV格式");
    }
}
```

## 六、注意事项

1. **构造函数重写**：
   ```typescript
   class Parent {
       constructor(name: string) {}
   }
   
   class Child extends Parent {
       constructor(name: string, age: number) {
           super(name); // 必须调用super
           this.age = age;
       }
   }
   ```

2. **属性重写限制**：
   ```typescript
   class Base {
       protected value: string = "base";
   }
   
   class Derived extends Base {
       // 可以重写属性
       protected value: string = "derived";
       
       // 但不能改变类型
       // protected value: number = 123; // 错误
   }
   ```

3. **final模拟（禁止重写）**：
   ```typescript
   class CriticalComponent {
       public readonly criticalMethod = (): void => {
           console.log("关键逻辑，不可修改");
       };
   }
   
   class HackAttempt extends CriticalComponent {
       // 无法重写
       // criticalMethod = () => console.log("入侵失败");
   }
   ```

## 七、总结

TypeScript 方法重写的核心要点：

1. **继承是前提**：必须通过 `extends` 建立父子类关系
2. **签名需一致**：方法名和参数类型必须相同（返回值可协变）
3. **super是关键**：通过 `super.method()` 调用父类实现
4. **修饰符影响**：
   - `public`/`protected` 方法可重写
   - `private` 方法不可重写
5. **静态方法也可重写**：但通过类名调用而非实例

**开发口诀**：
"继承父类扩功能，方法重写逻辑新；
签名一致是必须，super调用保核心；
publicprotected可改写，private方法不变更。"

在实际项目中，方法重写常用于：
- 框架生命周期定制
- 业务逻辑扩展
- 设计模式实现（如模板方法）
- 库功能的个性化修改
