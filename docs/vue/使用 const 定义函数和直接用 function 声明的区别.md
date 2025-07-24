---
sidebar: false
outline: [2, 3, 4]
---

# 使用 const 定义函数和直接用 function 声明的区别

## 可用环境代码

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>函数声明方式对比</title>
  <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>
</head>
<body>
  <div id="app">
    <!-- 示例代码将在这里展示 -->
  </div>

  <script>
    // 代码示例将在这里定义
  </script>
</body>
</html>
```

## 面试回答

面试官您好，关于使用`const`定义函数和直接用`function`声明的区别，我将从多个方面进行详细说明，包括语法特性、作用域、提升(hoisting)行为、可变性以及实际应用场景等。

### 1. 基本语法差异

首先，我们来看最基本的语法形式：

```javascript
// 函数声明
function functionDeclaration() {
  console.log('这是一个函数声明')
}

// 使用const定义函数表达式
function functionExpression() {
  console.log('这是一个使用const定义的函数表达式')
}

// 使用const定义箭头函数
function arrowFunction() {
  console.log('这是一个使用const定义的箭头函数')
}
```

### 2. 提升(Hoisting)行为

这是两者最显著的区别之一：

```javascript
// 测试提升行为
try {
  hoistedFunction() // 可以调用，因为函数声明会被提升
}
catch (e) {
  console.log('hoistedFunction调用失败:', e.message)
}

try {
  notHoistedFunction() // 会抛出错误，因为函数表达式不会被提升
}
catch (e) {
  console.log('notHoistedFunction调用失败:', e.message)
}

// 函数声明
function hoistedFunction() {
  console.log('这是一个被提升的函数声明')
}

// 函数表达式
function notHoistedFunction() {
  console.log('这是一个不会被提升的函数表达式')
}
```

**关键区别**：
- 函数声明会被提升到当前作用域的顶部，可以在声明前调用
- 使用`const`定义的函数表达式不会被提升，必须在定义后才能调用

### 3. 作用域和重复声明

```javascript
// 函数声明在同一作用域内不能重复声明
function duplicateDeclaration() {}
// function duplicateDeclaration() {} // 这里会抛出语法错误

// 使用const定义的函数可以看作是一个常量赋值
function duplicateFunction() {}
// const duplicateFunction = function() {}; // 这里会抛出TypeError，因为重复声明const变量
```

**关键区别**：
- 函数声明在同一作用域内不能重复声明
- 使用`const`定义的函数实际上是一个常量赋值，不能重复声明(但可以重新赋值，如果使用`let`)

不过这里需要澄清一个常见的误解：虽然`const`定义的函数不能重新赋值，但函数内部的属性是可以修改的(除非函数是冻结的)。

### 4. 作为值的函数

使用`const`定义的函数更适合作为值传递：

```javascript
// 函数作为参数传递
function executeFunction(fn) {
  fn()
}

// 函数声明
function declaredFunction() {
  console.log('函数声明作为参数')
}

// 函数表达式
function expressedFunction() {
  console.log('函数表达式作为参数')
}

executeFunction(declaredFunction) // 可以
executeFunction(expressedFunction) // 可以

// 在对象属性中
const obj = {
  declaredFunc() { console.log('对象中的函数声明') }, // 实际上这也是函数表达式
  expressedFunc() { console.log('对象中的函数表达式') }
}

// 更清晰的函数表达式作为对象属性
const obj2 = {
  func() { console.log('对象属性中的函数表达式') }
}
```

**关键区别**：
- 函数声明不能直接作为对象属性赋值(虽然看起来可以，但实际上是隐式转换为表达式)
- 使用`const`定义的函数表达式更明确地表示函数是一个值，更适合在对象属性中使用

### 5. 箭头函数的情况

现代JavaScript中，我们经常使用箭头函数，它必须使用`const`(或`let`)定义：

```javascript
// 箭头函数必须使用const或let定义
function arrowFn() {
  console.log('这是一个箭头函数')
}

// 箭头函数不能使用function声明
// function arrowFn() {} // 这不是箭头函数，而是普通函数声明

// 箭头函数的一些特性
function lexicalThis() {
  console.log(this) // 继承自外层作用域的this
}
```

**关键区别**：
- 箭头函数语法上必须使用`const`或`let`定义
- 箭头函数没有自己的`this`、`arguments`、`super`或`new.target`绑定

### 6. 实际应用中的选择

在实际开发中，我们通常会根据情况选择：

```javascript
// 1. 当需要函数提升特性时，使用函数声明
// 这在某些需要先调用后定义的场景很有用
initApp()

function initApp() {
  console.log('应用初始化')
}

// 2. 当需要将函数作为值传递或赋值给变量时，使用const定义的函数表达式
function calculate(a, b) {
  return a + b
}

// 3. 在模块化代码中，通常使用const定义函数
// 这样可以明确表示函数不会被重新赋值
const apiClient = {
  getData() { /* ... */ },
  postData() { /* ... */ }
}

// 4. 箭头函数通常用于回调或需要词法this的场景
function buttonHandler() {
  console.log('按钮点击处理')
}
```

### 7. 可运行完整示例

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>函数声明方式对比</title>
  <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>
  <style>
    .example {
      margin: 20px 0;
      padding: 10px;
      border: 1px solid #ddd;
    }
    .code {
      background-color: #f5f5f5;
      padding: 5px;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <div id="app">
    <div class="example">
      <h3>1. 提升行为对比</h3>
      <div class="code">
        // 函数声明(会被提升)<br>
        hoistedFunction(); // 可以调用<br><br>

        // 函数表达式(不会被提升)<br>
        // notHoistedFunction(); // 会抛出错误
      </div>
      <button @click="runHoistingExample">运行提升示例</button>
      <div>结果: {{ hoistingResult }}</div>
    </div>

    <div class="example">
      <h3>2. 重复声明对比</h3>
      <div class="code">
        // 函数声明不能重复声明<br>
        // function duplicate() {} // 语法错误<br>
        // function duplicate() {}<br><br>

        // const定义的函数不能重复声明<br>
        // const duplicate = function() {};<br>
        // const duplicate = function() {}; // TypeError
      </div>
      <button @click="runDuplicateExample">运行重复声明示例</button>
      <div>结果: {{ duplicateResult }}</div>
    </div>

    <div class="example">
      <h3>3. 作为值传递</h3>
      <div class="code">
        // 函数声明可以作为参数传递<br>
        executeFunction(declaredFunction);<br><br>

        // 函数表达式也可以作为参数传递<br>
        executeFunction(expressedFunction);
      </div>
      <button @click="runValueExample">运行值传递示例</button>
      <div>结果: {{ valueResult }}</div>
    </div>

    <div class="example">
      <h3>4. 箭头函数</h3>
      <div class="code">
        // 箭头函数必须使用const或let定义<br>
        const arrowFn = () => {};<br><br>

        // 箭头函数的this行为<br>
        const obj = {<br>
        &nbsp;&nbsp;method: function() {<br>
        &nbsp;&nbsp;&nbsp;&nbsp;setTimeout(function() { console.log(this); }, 100); // window<br>
        &nbsp;&nbsp;&nbsp;&nbsp;setTimeout(() => { console.log(this); }, 100); // obj<br>
        &nbsp;&nbsp;}<br>
        };
      </div>
      <button @click="runArrowExample">运行箭头函数示例</button>
      <div>结果: {{ arrowResult }}</div>
    </div>
  </div>

  <script>
    new Vue({
      el: '#app',
      data: {
        hoistingResult: '',
        duplicateResult: '',
        valueResult: '',
        arrowResult: ''
      },
      methods: {
        runHoistingExample() {
          this.hoistingResult = '';
          try {
            hoistedFunction();
            this.hoistingResult += 'hoistedFunction调用成功\n';
          } catch (e) {
            this.hoistingResult += 'hoistedFunction调用失败: ' + e.message + '\n';
          }

          try {
            notHoistedFunction();
            this.hoistingResult += 'notHoistedFunction调用成功\n';
          } catch (e) {
            this.hoistingResult += 'notHoistedFunction调用失败: ' + e.message + '\n';
          }
        },

        runDuplicateExample() {
          this.duplicateResult = '';
          try {
            function duplicate() {}
            // function duplicate() {} // 取消注释会看到语法错误
            this.duplicateResult += '第一次函数声明成功\n';

            // const duplicate = function() {};
            // const duplicate = function() {}; // 取消注释会看到TypeError
            this.duplicateResult += '第一次const定义成功\n';
          } catch (e) {
            this.duplicateResult += '错误: ' + e.message + '\n';
          }
        },

        runValueExample() {
          this.valueResult = '';
          function declaredFunction() {
            return '函数声明作为参数';
          }

          const expressedFunction = function() {
            return '函数表达式作为参数';
          };

          this.valueResult += executeFunction(declaredFunction) + '\n';
          this.valueResult += executeFunction(expressedFunction) + '\n';
        },

        runArrowExample() {
          this.arrowResult = '';
          const obj = {
            method: function() {
              setTimeout(function() {
                this.arrowResult += '普通函数this: ' + (typeof this) + '\n';
              }, 100);

              setTimeout(() => {
                this.arrowResult += '箭头函数this: ' + (typeof this) + '\n';
              }, 100);
            }
          };

          obj.method();
        }
      },
      mounted() {
        // 定义提升相关的函数
        function hoistedFunction() {
          return 'hoistedFunction被调用';
        }

        const notHoistedFunction = function() {
          return 'notHoistedFunction被调用';
        };

        // 定义执行函数
        function executeFunction(fn) {
          return fn();
        }
      }
    })

    // 注意: 由于Vue的mounted钩子中定义的函数在全局不可见，
    // 所以我们需要将这些函数也定义在全局作用域中以便按钮点击能正常工作
    // 这在实际面试中可能需要解释

    // 重新定义全局函数以便示例工作
    function hoistedFunction() {
      return 'hoistedFunction被调用';
    }

    const notHoistedFunction = function() {
      return 'notHoistedFunction被调用';
    };

    function executeFunction(fn) {
      return fn();
    }
  </script>
</body>
</html>
```

不过，上面的完整示例有一个问题：在Vue的mounted钩子中定义的函数在全局作用域中不可见，所以按钮点击事件无法访问这些函数。让我们修正这个问题，提供一个真正可运行的完整示例：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>函数声明方式对比</title>
  <style>
    .example {
      margin: 20px 0;
      padding: 10px;
      border: 1px solid #ddd;
    }
    .code {
      background-color: #f5f5f5;
      padding: 5px;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <div id="app">
    <div class="example">
      <h3>1. 提升行为对比</h3>
      <div class="code">
        // 函数声明(会被提升)<br>
        hoistedFunction(); // 可以调用<br><br>

        // 函数表达式(不会被提升)<br>
        // notHoistedFunction(); // 会抛出错误
      </div>
      <button id="hoistingBtn">运行提升示例</button>
      <div id="hoistingResult"></div>
    </div>

    <div class="example">
      <h3>2. 重复声明对比</h3>
      <div class="code">
        // 函数声明不能重复声明<br>
        // function duplicate() {} // 语法错误<br>
        // function duplicate() {}<br><br>

        // const定义的函数不能重复声明<br>
        // const duplicate = function() {};<br>
        // const duplicate = function() {}; // TypeError
      </div>
      <button id="duplicateBtn">运行重复声明示例</button>
      <div id="duplicateResult"></div>
    </div>

    <div class="example">
      <h3>3. 作为值传递</h3>
      <div class="code">
        // 函数声明可以作为参数传递<br>
        executeFunction(declaredFunction);<br><br>

        // 函数表达式也可以作为参数传递<br>
        executeFunction(expressedFunction);
      </div>
      <button id="valueBtn">运行值传递示例</button>
      <div id="valueResult"></div>
    </div>

    <div class="example">
      <h3>4. 箭头函数</h3>
      <div class="code">
        // 箭头函数必须使用const或let定义<br>
        const arrowFn = () => {};<br><br>

        // 箭头函数的this行为<br>
        const obj = {<br>
        &nbsp;&nbsp;method: function() {<br>
        &nbsp;&nbsp;&nbsp;&nbsp;setTimeout(function() { logResult('普通函数this: ' + (typeof this)); }, 100); // window<br>
        &nbsp;&nbsp;&nbsp;&nbsp;setTimeout(() => { logResult('箭头函数this: ' + (typeof this)); }, 100); // obj<br>
        &nbsp;&nbsp;}<br>
        };
      </div>
      <button id="arrowBtn">运行箭头函数示例</button>
      <div id="arrowResult"></div>
    </div>
  </div>

  <script>
    // 定义提升相关的函数(在全局作用域)
    function hoistedFunction() {
      return 'hoistedFunction被调用';
    }

    const notHoistedFunction = function() {
      return 'notHoistedFunction被调用';
    };

    // 定义执行函数(在全局作用域)
    function executeFunction(fn) {
      return fn();
    }

    // 全局结果记录函数
    function logResult(text) {
      const resultElement = document.getElementById('arrowResult');
      resultElement.textContent += text + '\n';
    }

    // 按钮事件处理
    document.getElementById('hoistingBtn').addEventListener('click', function() {
      const resultElement = document.getElementById('hoistingResult');
      resultElement.textContent = '';

      try {
        hoistedFunction();
        resultElement.textContent += 'hoistedFunction调用成功\n';
      } catch (e) {
        resultElement.textContent += 'hoistedFunction调用失败: ' + e.message + '\n';
      }

      try {
        notHoistedFunction();
        resultElement.textContent += 'notHoistedFunction调用成功\n';
      } catch (e) {
        resultElement.textContent += 'notHoistedFunction调用失败: ' + e.message + '\n';
      }
    });

    document.getElementById('duplicateBtn').addEventListener('click', function() {
      const resultElement = document.getElementById('duplicateResult');
      resultElement.textContent = '';

      try {
        function duplicate() {}
        // 取消下面这行的注释会看到语法错误
        // function duplicate() {}
        resultElement.textContent += '第一次函数声明成功\n';

        const duplicateConst = function() {};
        // 取消下面这行的注释会看到TypeError
        // const duplicateConst = function() {};
        resultElement.textContent += '第一次const定义成功\n';
      } catch (e) {
        resultElement.textContent += '错误: ' + e.message + '\n';
      }
    });

    document.getElementById('valueBtn').addEventListener('click', function() {
      const resultElement = document.getElementById('valueResult');
      resultElement.textContent = '';

      function declaredFunction() {
        return '函数声明作为参数';
      }

      const expressedFunction = function() {
        return '函数表达式作为参数';
      };

      resultElement.textContent += executeFunction(declaredFunction) + '\n';
      resultElement.textContent += executeFunction(expressedFunction) + '\n';
    });

    document.getElementById('arrowBtn').addEventListener('click', function() {
      const resultElement = document.getElementById('arrowResult');
      resultElement.textContent = '';

      const obj = {
        method: function() {
          setTimeout(function() {
            logResult('普通函数this: ' + (typeof this));
          }, 100);

          setTimeout(() => {
            logResult('箭头函数this: ' + (typeof this));
          }, 100);
        }
      };

      obj.method();
    });

    // 全局结果记录函数
    function logResult(text) {
      const resultElement = document.getElementById('arrowResult');
      resultElement.textContent += text + '\n';
    }
  </script>
</body>
</html>
```

这个完整可运行的示例展示了:

1. **提升行为对比**：函数声明可以在声明前调用，而函数表达式不能
2. **重复声明对比**：函数声明不能重复声明，const定义的函数也不能重复声明
3. **作为值传递**：函数声明和函数表达式都可以作为参数传递
4. **箭头函数**：必须使用const或let定义，并展示this绑定差异

## 通俗易懂的总结

简单来说，使用`const`定义函数和直接用`function`声明主要有以下几个区别：

1. **提升行为**：
   - 函数声明会被提升到作用域顶部，可以在声明前调用
   - `const`定义的函数表达式不会被提升，必须在定义后才能调用

2. **重复声明**：
   - 函数声明在同一作用域内不能重复声明
   - `const`定义的变量(包括函数)也不能重复声明

3. **作为值使用**：
   - 函数声明更像是一个"命名的语句"
   - `const`定义的函数更像是一个"可以赋值的值"，更适合在对象属性、数组元素或作为参数传递

4. **现代JavaScript实践**：
   - 在现代JavaScript中，特别是ES6+，更推荐使用`const`定义函数(或箭头函数)
   - 这种方式更明确地表示函数不会被重新赋值
   - 更适合模块化、函数式编程风格

**实际建议**：
- 在需要函数提升特性的场景(如某些库的初始化代码)，可以使用函数声明
- 在大多数现代代码中，特别是需要将函数作为值传递、赋值给变量或在对象属性中使用时，推荐使用`const`定义函数
- 对于箭头函数，必须使用`const`或`let`定义

这两种方式各有适用场景，理解它们的区别有助于我们写出更清晰、更可维护的代码。
