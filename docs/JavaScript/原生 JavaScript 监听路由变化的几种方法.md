# 原生 JavaScript 监听路由变化的几种方法

在原生 JavaScript 中监听路由变化主要有以下几种方式：

## 1. 监听 `hashchange` 事件（适用于哈希路由）

```javascript
window.addEventListener('hashchange', function() {
  console.log('哈希变化:', window.location.hash);
  
  // 获取当前哈希值（去掉#）
  const hash = window.location.hash.substring(1);
  console.log('当前路由:', hash);
});

// 示例：修改哈希触发事件
document.getElementById('changeHashBtn').addEventListener('click', () => {
  window.location.hash = 'new-section';
});
```

## 2. 监听 `popstate` 事件（适用于HTML5 History API）

```javascript
window.addEventListener('popstate', function(event) {
  console.log('路由变化:', window.location.pathname);
  console.log('状态对象:', event.state);
});

// 示例：使用History API修改路由
document.getElementById('pushStateBtn').addEventListener('click', () => {
  history.pushState({ page: 'new' }, 'New Page', '/new-page');
});
```

## 3. 重写History方法（监听pushState/replaceState）

```javascript
// 保存原生方法
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

// 重写pushState
history.pushState = function(state, title, url) {
  console.log('pushState被调用:', url);
  originalPushState.apply(history, arguments);
  // 触发自定义事件
  window.dispatchEvent(new Event('pushstate'));
  window.dispatchEvent(new Event('locationchange'));
};

// 重写replaceState
history.replaceState = function(state, title, url) {
  console.log('replaceState被调用:', url);
  originalReplaceState.apply(history, arguments);
  // 触发自定义事件
  window.dispatchEvent(new Event('replacestate'));
  window.dispatchEvent(new Event('locationchange'));
};

// 监听自定义事件
window.addEventListener('pushstate', () => {
  console.log('检测到pushState操作');
});

window.addEventListener('locationchange', () => {
  console.log('路由变化:', window.location.href);
});
```

## 4. 轮询检查（不推荐，仅作备选）

```javascript
let lastUrl = window.location.href;

setInterval(() => {
  const currentUrl = window.location.href;
  if (currentUrl !== lastUrl) {
    console.log('路由变化:', currentUrl);
    lastUrl = currentUrl;
  }
}, 100); // 每100毫秒检查一次
```

## 完整示例代码

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>路由变化监听示例</title>
</head>
<body>
  <h1>路由变化监听示例</h1>
  
  <button id="hashBtn">修改哈希路由</button>
  <button id="historyBtn">使用History API</button>
  
  <div id="output"></div>
  
  <script>
    const output = document.getElementById('output');
    
    function log(message) {
      output.innerHTML += `<p>${new Date().toLocaleTimeString()}: ${message}</p>`;
    }
    
    // 1. 监听hashchange
    window.addEventListener('hashchange', () => {
      log(`哈希变化: ${window.location.hash}`);
    });
    
    // 2. 监听popstate
    window.addEventListener('popstate', (event) => {
      log(`History变化: ${window.location.pathname}, 状态: ${JSON.stringify(event.state)}`);
    });
    
    // 3. 重写History方法
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(state, title, url) {
      originalPushState.apply(history, arguments);
      window.dispatchEvent(new Event('locationchange'));
      log(`pushState被调用: ${url}`);
    };
    
    history.replaceState = function(state, title, url) {
      originalReplaceState.apply(history, arguments);
      window.dispatchEvent(new Event('locationchange'));
      log(`replaceState被调用: ${url}`);
    };
    
    // 监听自定义事件
    window.addEventListener('locationchange', () => {
      log(`路由变化: ${window.location.href}`);
    });
    
    // 按钮事件
    document.getElementById('hashBtn').addEventListener('click', () => {
      window.location.hash = `section-${Math.floor(Math.random() * 100)}`;
    });
    
    document.getElementById('historyBtn').addEventListener('click', () => {
      const path = `/path-${Math.floor(Math.random() * 100)}`;
      history.pushState({ random: Math.random() }, '', path);
    });
    
    log('路由监听已启动');
  </script>
</body>
</html>
```

## 各方法对比

| 方法 | 适用路由类型 | 优点 | 缺点 |
|------|------------|------|------|
| `hashchange` | 哈希路由 | 兼容性好，简单易用 | 只能监听哈希部分变化 |
| `popstate` | History API | 监听完整URL变化 | 不直接监听pushState/replaceState |
| 重写History方法 | History API | 能捕获所有路由变化 | 需要重写原生方法 |
| 轮询检查 | 所有类型 | 最简单实现 | 性能差，不精确 |

## 实际应用建议

1. **哈希路由**：使用 `hashchange` 事件
2. **HTML5 History路由**：
   - 组合使用 `popstate` + 重写History方法
   - 或者使用自定义事件系统
3. **兼容性考虑**：
   ```javascript
   // 综合解决方案
   function setupRouterListener(callback) {
     // 监听哈希路由
     window.addEventListener('hashchange', () => {
       callback(window.location.hash.substring(1));
     });
     
     // 监听History API
     window.addEventListener('popstate', () => {
       callback(window.location.pathname);
     });
     
     // 重写History方法
     const originalPushState = history.pushState;
     const originalReplaceState = history.replaceState;
     
     history.pushState = function(state, title, url) {
       originalPushState.apply(history, arguments);
       callback(url || window.location.pathname);
     };
     
     history.replaceState = function(state, title, url) {
       originalReplaceState.apply(history, arguments);
       callback(url || window.location.pathname);
     };
   }
   
   // 使用示例
   setupRouterListener((route) => {
     console.log('当前路由:', route);
   });
   ```

通过以上方法，你可以在原生JavaScript中有效地监听和响应路由变化。
