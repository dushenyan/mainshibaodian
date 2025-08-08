# 获取 JavaScript 实例对象原型对象的完整指南

## 标准方法：`Object.getPrototypeOf()`

这是 ES5 引入的标准方法，推荐使用：

```javascript
function Person(name) {
  this.name = name;
}

const person = new Person('Alice');

// 获取实例的原型对象
const proto = Object.getPrototypeOf(person);
console.log(proto === Person.prototype); // true
```

## 传统方法：`__proto__` 属性

非标准但广泛支持的方式（不推荐在生产环境使用）：

```javascript
const proto = person.__proto__;
console.log(proto === Person.prototype); // true
```

## 构造函数方法：`constructor.prototype`

通过实例的构造函数获取原型：

```javascript
const proto = person.constructor.prototype;
console.log(proto === Person.prototype); // true
```

## 特殊情况处理

### 1. 使用 `Object.create(null)` 创建的对象

```javascript
const obj = Object.create(null);
console.log(Object.getPrototypeOf(obj)); // null
console.log(obj.__proto__); // undefined
```

### 2. 修改过原型链的对象

```javascript
const parent = { familyName: 'Smith' };
const child = Object.create(parent);
console.log(Object.getPrototypeOf(child) === parent); // true
```

## 原型链遍历

获取完整的原型链：

```javascript
function getPrototypeChain(obj) {
  const chain = [];
  let current = obj;
  
  while (current = Object.getPrototypeOf(current)) {
    chain.push(current);
  }
  
  return chain;
}

const chain = getPrototypeChain(person);
console.log(chain); // [Person.prototype, Object.prototype]
```

## 实际应用示例

### 1. 检查对象是否拥有某个方法

```javascript
function hasMethod(obj, methodName) {
  const proto = Object.getPrototypeOf(obj);
  return proto && typeof proto[methodName] === 'function';
}

console.log(hasMethod(person, 'toString')); // true
```

### 2. 实现简单的混入(Mixin)

```javascript
const canSwim = {
  swim() {
    console.log(`${this.name} is swimming`);
  }
};

function Fish(name) {
  this.name = name;
}

// 设置原型
Object.setPrototypeOf(Fish.prototype, canSwim);

const nemo = new Fish('Nemo');
nemo.swim(); // "Nemo is swimming"
```

## 不同方法的比较

| 方法 | 标准性 | 推荐度 | 说明 |
|------|--------|--------|------|
| `Object.getPrototypeOf()` | ES5+ | ★★★★★ | 标准方法，最安全 |
| `__proto__` | 非标准 | ★★☆☆☆ | 浏览器普遍支持，但不推荐生产使用 |
| `constructor.prototype` | ES1 | ★★★☆☆ | 可能被修改，不够可靠 |
| `Object.setPrototypeOf()` | ES6 | ★★★★☆ | 修改原型链用 |

## 最佳实践建议

1. **优先使用标准方法**：`Object.getPrototypeOf()`
2. **避免修改原型链**：`Object.setPrototypeOf()` 影响性能
3. **生产环境避免 `__proto__`**：使用标准方法替代
4. **检查原型方法存在性**：`Object.hasOwnProperty.call(proto, 'method')`
5. **考虑兼容性**：旧环境可能需要 polyfill

## 完整代码示例

```javascript
// 1. 基本原型获取
function Vehicle(type) {
  this.type = type;
}
Vehicle.prototype.drive = function() {
  console.log(`Driving a ${this.type}`);
};

const car = new Vehicle('car');

// 方法1: Object.getPrototypeOf
const proto1 = Object.getPrototypeOf(car);
console.log('Method 1:', proto1 === Vehicle.prototype); // true

// 方法2: __proto__ (不推荐)
const proto2 = car.__proto__;
console.log('Method 2:', proto2 === Vehicle.prototype); // true

// 方法3: constructor.prototype
const proto3 = car.constructor.prototype;
console.log('Method 3:', proto3 === Vehicle.prototype); // true

// 2. 原型链遍历
function getAllPrototypes(obj) {
  const protos = [];
  let current = obj;
  
  while (current = Object.getPrototypeOf(current)) {
    protos.push(current);
  }
  
  return protos;
}

console.log('Prototype chain:', getAllPrototypes(car));
// [Vehicle.prototype, Object.prototype]

// 3. 安全检测方法
function hasMethodSafely(obj, methodName) {
  let proto = Object.getPrototypeOf(obj);
  while (proto) {
    if (Object.hasOwnProperty.call(proto, methodName)) {
      return typeof proto[methodName] === 'function';
    }
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

console.log('Has drive method:', hasMethodSafely(car, 'drive')); // true
console.log('Has fake method:', hasMethodSafely(car, 'fly'));    // false
```

## 总结

获取 JavaScript 对象原型对象的主要方法有：

1. **标准方法**：`Object.getPrototypeOf(obj)` - 最推荐
2. **非标准属性**：`obj.__proto__` - 仅用于调试
3. **构造函数引用**：`obj.constructor.prototype` - 可能不可靠

**关键点记忆**：
- 原型是 JavaScript 继承的基础
- 每个对象都有原型（除了 `Object.create(null)` 创建的对象）
- 原型链终点是 `null`
- 优先使用标准方法保证代码可靠性

通过理解这些原型访问方法，您可以更好地处理 JavaScript 的面向对象编程和继承机制。
