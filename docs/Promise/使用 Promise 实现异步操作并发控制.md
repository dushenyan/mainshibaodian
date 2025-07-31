# 使用 Promise 实现异步操作并发控制

## 可用环境代码

```javascript
// 模拟异步任务
function asyncTask(id, delay) {
  return new Promise(resolve => {
    console.log(`任务 ${id} 开始，预计耗时 ${delay}ms`);
    setTimeout(() => {
      console.log(`任务 ${id} 完成`);
      resolve(id);
    }, delay);
  });
}

// 任务列表
const tasks = [
  () => asyncTask(1, 1000),
  () => asyncTask(2, 2000),
  () => asyncTask(3, 500),
  () => asyncTask(4, 1500),
  () => asyncTask(5, 800),
  () => asyncTask(6, 1200),
  () => asyncTask(7, 300),
  () => asyncTask(8, 2500),
  () => asyncTask(9, 700),
  () => asyncTask(10, 1800)
];
```

## 实现并发控制的 Promise 方案

### 1. 基本实现思路

要实现限制并发数的异步操作控制，我们需要：

1. 创建一个队列来管理所有待执行的任务
2. 维护一个计数器跟踪正在执行的任务数量
3. 当一个任务完成时，从队列中取出下一个任务执行
4. 使用 Promise 来跟踪所有任务的完成状态

### 2. 完整实现代码

```javascript
/**
 * 限制异步操作的并发数量
 * @param {Array<Function>} tasks 返回Promise的任务数组
 * @param {number} limit 最大并发数
 * @returns {Promise<Array>} 所有任务结果的Promise
 */
function runTasksWithConcurrencyLimit(tasks, limit) {
  return new Promise((resolve) => {
    const results = []; // 存储所有任务结果
    let running = 0; // 当前正在运行的任务数
    let index = 0; // 当前任务索引
    let completed = 0; // 已完成任务数
    
    // 递归执行任务
    function runNext() {
      // 所有任务已完成
      if (completed === tasks.length) {
        resolve(results);
        return;
      }
      
      // 还有任务待执行且未达到并发上限
      while (running < limit && index < tasks.length) {
        const currentIndex = index++; // 保存当前任务索引
        const task = tasks[currentIndex];
        
        running++;
        
        task().then(result => {
          results[currentIndex] = result; // 按原始顺序保存结果
        }).catch(error => {
          results[currentIndex] = error; // 捕获错误
        }).finally(() => {
          running--;
          completed++;
          runNext(); // 尝试执行下一个任务
        });
      }
    }
    
    runNext(); // 开始执行
  });
}
```

### 3. 使用示例

```javascript
// 限制并发数为3
runTasksWithConcurrencyLimit(tasks, 3)
  .then(results => {
    console.log('所有任务完成，结果:', results);
  })
  .catch(error => {
    console.error('发生错误:', error);
  });
```

### 4. 高级优化版本

下面是一个更健壮的版本，增加了错误处理和进度回调：

```javascript
function runTasksWithConcurrencyLimit(tasks, limit, progressCallback) {
  return new Promise((resolve, reject) => {
    const results = new Array(tasks.length);
    let running = 0;
    let index = 0;
    let completed = 0;
    let hasError = false;
    
    function runNext() {
      // 检查是否已完成或有错误
      if (hasError) return;
      if (completed === tasks.length) {
        resolve(results);
        return;
      }
      
      // 执行任务
      while (running < limit && index < tasks.length && !hasError) {
        const currentIndex = index++;
        const task = tasks[currentIndex];
        
        running++;
        
        Promise.resolve(task())
          .then(result => {
            results[currentIndex] = result;
          })
          .catch(error => {
            results[currentIndex] = error;
            hasError = true;
            reject(error);
          })
          .finally(() => {
            running--;
            completed++;
            
            // 调用进度回调
            if (typeof progressCallback === 'function') {
              progressCallback(completed, tasks.length);
            }
            
            runNext();
          });
      }
    }
    
    runNext();
  });
}
```

### 5. 使用优化版本

```javascript
// 带进度回调的使用示例
runTasksWithConcurrencyLimit(tasks, 3, (completed, total) => {
  console.log(`进度: ${completed}/${total}`);
})
.then(results => {
  console.log('所有任务完成:', results);
})
.catch(error => {
  console.error('任务失败:', error);
});
```

### 6. 使用 async/await 的实现

如果你更喜欢使用 async/await 语法：

```javascript
async function runTasksWithConcurrencyLimit(tasks, limit) {
  const results = [];
  const executing = new Set();
  
  for (const task of tasks) {
    // 等待直到有可用的并发槽
    if (executing.size >= limit) {
      await Promise.race(executing);
    }
    
    const p = task().then(result => {
      executing.delete(p);
      return result;
    });
    
    executing.add(p);
    results.push(await p);
  }
  
  // 等待剩余任务完成
  await Promise.all(executing);
  return results;
}
```

### 7. 实现原理总结

1. **任务队列管理**：维护一个待执行任务队列
2. **并发控制**：通过计数器限制同时执行的任务数量
3. **动态调度**：每当一个任务完成，立即启动下一个可用任务
4. **结果收集**：按原始顺序保存所有任务结果
5. **错误处理**：任一任务失败可立即终止或继续执行（根据需求）

### 8. 通俗易懂的比喻

可以把这想象成一个游泳池的更衣室管理：

1. **游泳池（任务队列）**：有很多人（任务）要游泳
2. **更衣室（并发限制）**：只有有限数量的更衣柜（如3个）
3. **管理规则**：
   - 一个人游完泳出来（任务完成），下一个人才能进去（新任务开始）
   - 始终保持更衣室里最多有3个人
   - 所有人都游完后，关闭游泳池（所有任务完成）

这种方法确保了资源（并发数）被充分利用，同时不会超额使用。

## 完整可运行示例

```html
<!DOCTYPE html>
<html>
<head>
  <title>Promise并发控制演示</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .log { margin-top: 20px; padding: 10px; border: 1px solid #ddd; height: 300px; overflow-y: auto; }
    .log p { margin: 5px 0; }
  </style>
</head>
<body>
  <h1>Promise并发控制演示</h1>
  <div>
    <label>并发限制: <input type="number" id="limit" value="3" min="1"></label>
    <button id="run">运行任务</button>
    <button id="reset">重置</button>
  </div>
  <div id="progress"></div>
  <div id="log" class="log"></div>

  <script>
    // 获取DOM元素
    const runBtn = document.getElementById('run');
    const resetBtn = document.getElementById('reset');
    const limitInput = document.getElementById('limit');
    const progressDiv = document.getElementById('progress');
    const logDiv = document.getElementById('log');
    
    // 添加日志
    function addLog(message) {
      const p = document.createElement('p');
      p.textContent = message;
      logDiv.appendChild(p);
      logDiv.scrollTop = logDiv.scrollHeight;
    }
    
    // 模拟异步任务
    function asyncTask(id, delay) {
      return new Promise(resolve => {
        addLog(`任务 ${id} 开始，预计耗时 ${delay}ms`);
        
        setTimeout(() => {
          addLog(`任务 ${id} 完成`);
          resolve(id);
        }, delay);
      });
    }
    
    // 生成任务列表
    function generateTasks(count) {
      const tasks = [];
      for (let i = 1; i <= count; i++) {
        // 随机延迟500-3000ms
        const delay = 500 + Math.floor(Math.random() * 2500);
        tasks.push(() => asyncTask(i, delay));
      }
      return tasks;
    }
    
    // 并发控制实现
    function runTasksWithConcurrencyLimit(tasks, limit) {
      return new Promise((resolve) => {
        const results = [];
        let running = 0;
        let index = 0;
        let completed = 0;
        const total = tasks.length;
        
        function updateProgress() {
          progressDiv.textContent = `进度: ${completed}/${total} (运行中: ${running})`;
        }
        
        function runNext() {
          if (completed === total) {
            resolve(results);
            return;
          }
          
          while (running < limit && index < total) {
            const currentIndex = index++;
            const task = tasks[currentIndex];
            
            running++;
            updateProgress();
            
            task().then(result => {
              results[currentIndex] = result;
            }).catch(error => {
              results[currentIndex] = error;
            }).finally(() => {
              running--;
              completed++;
              updateProgress();
              runNext();
            });
          }
        }
        
        runNext();
      });
    }
    
    // 事件监听
    runBtn.addEventListener('click', () => {
      const limit = parseInt(limitInput.value);
      const tasks = generateTasks(10);
      
      addLog(`开始执行10个任务，并发限制为${limit}`);
      
      runTasksWithConcurrencyLimit(tasks, limit)
        .then(results => {
          addLog(`所有任务完成！结果: ${results.join(', ')}`);
        });
    });
    
    resetBtn.addEventListener('click', () => {
      logDiv.innerHTML = '';
      progressDiv.textContent = '';
    });
  </script>
</body>
</html>
```

这个完整示例提供了一个可视化界面，您可以：
1. 设置并发限制数量
2. 运行10个随机耗时的任务
3. 实时查看任务执行进度和日志
4. 重置演示

通过这个示例，您可以直观地看到并发控制的效果，以及如何尽可能快地完成所有任务。
