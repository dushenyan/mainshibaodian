# TypeScript 中的继承实现详解

## 一、基础继承语法

### 1. 基本类继承

```typescript
// 基类（父类）
class Animal {
    name: string;
    
    constructor(name: string) {
        this.name = name;
    }
    
    move(distance: number = 0) {
        console.log(`${this.name} moved ${distance}m`);
    }
}

// 派生类（子类）
class Dog extends Animal {
    bark() {
        console.log('Woof! Woof!');
    }
}

const dog = new Dog('Buddy');
dog.move(10); // 继承自Animal
dog.bark();   // Dog特有的方法
```

### 2. 构造函数继承

```typescript
class Animal {
    constructor(public name: string) {} // 参数属性简写
}

class Snake extends Animal {
    constructor(name: string, private length: number) {
        super(name); // 必须调用super
    }
    
    slither() {
        console.log(`${this.name} is slithering (length: ${this.length}m)`);
    }
}

const snake = new Snake('Python', 5);
snake.slither();
```

## 二、方法重写与扩展

### 1. 方法重写（Overriding）

```typescript
class Bird extends Animal {
    move(distance: number = 5) { // 重写父类方法
        console.log(`${this.name} flew ${distance}m`);
        super.move(distance); // 可选：调用父类实现
    }
}

const bird = new Bird('Eagle');
bird.move(20);
/* 输出：
Eagle flew 20m
Eagle moved 20m
*/
```

### 2. 属性重写

```typescript
class Animal {
    protected sound: string = '...';
}

class Cat extends Animal {
    sound = 'Meow'; // 重写属性
    
    makeSound() {
        console.log(this.sound);
    }
}

const cat = new Cat();
cat.makeSound(); // "Meow"
```

## 三、访问修饰符与继承

| 修饰符       | 继承特点                          | 示例                     |
|--------------|----------------------------------|-------------------------|
| `public`     | 完全可访问（默认）                | 子类可自由访问和修改      |
| `protected`  | 仅类内部和子类可访问              | 子类可用但外部不可见      |
| `private`    | 仅类内部可访问                   | 子类不可访问             |
| `readonly`   | 初始化后不可修改                 | 可在子类初始化时赋值      |

```typescript
class Base {
    public publicProp = 1;
    protected protectedProp = 2;
    private privateProp = 3;
}

class Derived extends Base {
    showProperties() {
        console.log(this.publicProp);    // 允许
        console.log(this.protectedProp); // 允许
        // console.log(this.privateProp); // 错误
    }
}

const derived = new Derived();
console.log(derived.publicProp);    // 允许
// console.log(derived.protectedProp); // 错误
```

## 四、抽象类与继承

```typescript
// 抽象类（不能实例化）
abstract class Shape {
    abstract getArea(): number; // 抽象方法
    
    showArea() {
        console.log(`Area: ${this.getArea()}`);
    }
}

class Circle extends Shape {
    constructor(private radius: number) {
        super();
    }
    
    getArea(): number { // 必须实现抽象方法
        return Math.PI * this.radius ** 2;
    }
}

const circle = new Circle(5);
circle.showArea(); // "Area: 78.53981633974483"
```

## 五、接口实现与继承

### 1. 类实现接口

```typescript
interface Loggable {
    log(message: string): void;
}

class ConsoleLogger implements Loggable {
    log(message: string) {
        console.log(message);
    }
}

class FileLogger implements Loggable {
    log(message: string) {
        // 实现文件写入逻辑
    }
}
```

### 2. 接口继承类

```typescript
class Control {
    private state: any;
}

interface SelectableControl extends Control {
    select(): void;
}

// 必须包含Control的私有成员
class Button extends Control implements SelectableControl {
    select() {}
}

// 错误：缺少Control的私有成员
// class Image implements SelectableControl {}
```

## 六、多重继承的替代方案

TypeScript 不支持多继承，但可通过以下方式实现类似功能：

### 1. 混入模式（Mixins）

```typescript
// 辅助函数
function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}

// 可混合类
class CanSwim {
    swim() {
        console.log('Swimming');
    }
}

class CanFly {
    fly() {
        console.log('Flying');
    }
}

// 目标类
class Duck {
    // 空实现
}

interface Duck extends CanSwim, CanFly {}
applyMixins(Duck, [CanSwim, CanFly]);

const duck = new Duck();
duck.swim();
duck.fly();
```

### 2. 组合模式（Composition）

```typescript
class Walker {
    walk() {
        console.log('Walking');
    }
}

class Talker {
    talk() {
        console.log('Talking');
    }
}

class Human {
    private walker = new Walker();
    private talker = new Talker();
    
    walk() { this.walker.walk(); }
    talk() { this.talker.talk(); }
}

const person = new Human();
person.walk();
person.talk();
```

## 七、静态成员继承

```typescript
class Base {
    static baseStatic = 'Base Static';
    
    static showStatic() {
        console.log(this.baseStatic);
    }
}

class Derived extends Base {
    static derivedStatic = 'Derived Static';
    
    static showAll() {
        console.log(this.derivedStatic);
        console.log(super.baseStatic); // 通过super访问父类静态成员
    }
}

Derived.showStatic(); // "Base Static"
Derived.showAll();
/* 输出：
Derived Static
Base Static
*/
```

## 八、实际应用示例

### 1. 前端组件继承

```typescript
abstract class UIComponent {
    constructor(protected element: HTMLElement) {}
    
    abstract render(): void;
    
    protected addClass(className: string) {
        this.element.classList.add(className);
    }
}

class Button extends UIComponent {
    constructor(element: HTMLElement, private label: string) {
        super(element);
    }
    
    render() {
        this.element.textContent = this.label;
        this.addClass('btn');
    }
    
    onClick(handler: () => void) {
        this.element.addEventListener('click', handler);
    }
}

const btnElement = document.createElement('button');
const myButton = new Button(btnElement, 'Click Me');
myButton.render();
myButton.onClick(() => console.log('Clicked!'));
document.body.appendChild(btnElement);
```

### 2. 后端服务继承

```typescript
abstract class DatabaseService {
    constructor(protected connectionString: string) {}
    
    abstract connect(): Promise<void>;
    abstract query(sql: string): Promise<any[]>;
}

class MySQLService extends DatabaseService {
    async connect() {
        console.log(`Connecting to MySQL: ${this.connectionString}`);
        // 实际连接逻辑...
    }
    
    async query(sql: string) {
        console.log(`Executing MySQL query: ${sql}`);
        return [/* 查询结果 */];
    }
}

const db = new MySQLService('mysql://user:pass@localhost:3306/db');
await db.connect();
const results = await db.query('SELECT * FROM users');
```

## 九、注意事项

1. **super调用规则**：
   - 必须在构造函数中先调用`super()`才能使用`this`
   - 方法重写中`super.method()`可选择性调用

2. **类型兼容性**：
   ```typescript
   class Animal { name: string }
   class Dog extends Animal { breed: string }
   
   let animal: Animal = new Dog('Buddy'); // 允许（子类实例可赋给父类变量）
   // let dog: Dog = new Animal('Unknown'); // 错误
   ```

3. **避免过度继承**：
   - 深层次的继承链会增加复杂度
   - 优先考虑组合模式（Composition over Inheritance）

4. **抽象类与接口的选择**：
   - 需要共享实现代码 → 抽象类
   - 仅定义契约 → 接口

## 十、总结

TypeScript 继承的核心要点：

1. **语法基础**：
   - 使用 `extends` 关键字建立继承关系
   - 子类必须调用 `super()` 初始化父类

2. **方法控制**：
   - 方法可自由重写（Override）
   - 通过 `super` 访问父类实现
   - 抽象方法强制子类实现

3. **访问控制**：
   - `protected` 成员对子类可见
   - `private` 成员仅类内部可见

4. **设计建议**：
   - 保持继承层次扁平化
   - 复杂场景优先使用组合
   - 公共契约可提取为接口

**最佳实践口诀**：
"继承extends是基础，super调用不能少；
抽象方法须实现，protected子类见；
多重继承用混入，组合模式更灵活。"
