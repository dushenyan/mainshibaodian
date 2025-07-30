# WebSocket 兼容低版本浏览器的解决方案

## 可用环境代码

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WebSocket 兼容性解决方案</title>
</head>
<body>
  <div id="output"></div>
  <script>
    // 这里将放置兼容性解决方案代码
  </script>
</body>
</html>
```

## 回答

面试官您好，我来详细介绍一下 WebSocket 在低版本浏览器中的兼容性解决方案。WebSocket 是 HTML5 引入的技术，对于不支持 WebSocket 的老旧浏览器，我们需要采用降级方案来实现类似功能。

### 1. 检测浏览器是否支持 WebSocket

首先我们需要检测浏览器是否支持 WebSocket：

```javascript
function checkWebSocketSupport() {
  return 'WebSocket' in window || 'MozWebSocket' in window;
}

if (checkWebSocketSupport()) {
  console.log('浏览器支持 WebSocket');
} else {
  console.log('浏览器不支持 WebSocket，需要降级方案');
}
```

### 2. 降级方案一：长轮询（Long Polling）

对于不支持 WebSocket 的浏览器，最常用的替代方案是长轮询：

```javascript
function setupLongPolling(url, callback) {
  function fetchData() {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        callback(data);
        // 立即发起下一次请求
        fetchData();
      })
      .catch(error => {
        console.error('长轮询错误:', error);
        // 错误时延迟重试
        setTimeout(fetchData, 5000);
      });
  }
  fetchData();
}

// 使用示例
if (!checkWebSocketSupport()) {
  setupLongPolling('/api/poll', data => {
    console.log('收到数据:', data);
    document.getElementById('output').textContent = JSON.stringify(data);
  });
}
```

### 3. 降级方案二：EventSource（Server-Sent Events）

对于只需要服务器推送的场景，可以使用 EventSource：

```javascript
function setupEventSource(url, callback) {
  if ('EventSource' in window) {
    const source = new EventSource(url);
    source.onmessage = function(event) {
      callback(JSON.parse(event.data));
    };
    source.onerror = function() {
      console.error('EventSource 连接错误');
      // 可以在这里实现重连逻辑
    };
    return source;
  }
  return null;
}

// 使用示例
if (!checkWebSocketSupport()) {
  const eventSource = setupEventSource('/api/events', data => {
    console.log('收到事件:', data);
    document.getElementById('output').textContent = JSON.stringify(data);
  });
  
  if (!eventSource) {
    // 如果 EventSource 也不支持，回退到长轮询
    setupLongPolling('/api/poll', data => {
      console.log('长轮询收到数据:', data);
    });
  }
}
```

### 4. 使用兼容库：SockJS 或 Socket.io

更完整的解决方案是使用兼容库，它们会自动选择最佳传输方式：

#### 4.1 SockJS 示例

```javascript
// 需要先引入 SockJS 库
<script src="https://cdn.jsdelivr.net/npm/sockjs-client@1.5.0/dist/sockjs.min.js"></script>

<script>
  const sock = new SockJS('/ws');
  sock.onopen = function() {
    console.log('连接已建立');
    sock.send('test');
  };
  sock.onmessage = function(e) {
    console.log('收到消息:', e.data);
    document.getElementById('output').textContent = e.data;
  };
  sock.onclose = function() {
    console.log('连接已关闭');
  };
</script>
```

#### 4.2 Socket.io 示例

```javascript
// 需要先引入 Socket.io 库
<script src="https://cdn.socket.io/4.5.0/socket.io.min.js"></script>

<script>
  const socket = io();
  socket.on('connect', () => {
    console.log('已连接');
  });
  socket.on('message', (data) => {
    console.log('收到消息:', data);
    document.getElementById('output').textContent = data;
  });
  socket.on('disconnect', () => {
    console.log('已断开连接');
  });
</script>
```

### 5. 服务端兼容性处理

服务端也需要做相应调整来支持多种连接方式：

#### 5.1 Node.js 示例（使用 ws 和 express）

```javascript
const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);

// WebSocket 服务器
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log('收到消息:', message);
    ws.send(`服务器回复: ${message}`);
  });
});

// 长轮询端点
app.get('/api/poll', (req, res) => {
  // 模拟实时数据
  setTimeout(() => {
    res.json({ time: new Date().toISOString() });
  }, 1000);
});

// EventSource 端点
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  const interval = setInterval(() => {
    res.write(`data: ${JSON.stringify({ time: new Date().toISOString() })}\n\n`);
  }, 1000);
  
  req.on('close', () => {
    clearInterval(interval);
  });
});

server.listen(3000, () => {
  console.log('服务器已启动在端口 3000');
});
```

### 6. 兼容性策略总结

1. **优先尝试 WebSocket**：现代浏览器首选 WebSocket
2. **次选 EventSource**：适用于服务器推送场景
3. **最后使用长轮询**：最广泛的兼容方案
4. **考虑使用兼容库**：如 SockJS 或 Socket.io 简化实现
5. **服务端多协议支持**：后端需要支持多种通信方式

### 7. 通俗易懂的总结

可以把 WebSocket 兼容性方案想象成快递配送方式：

1. **WebSocket** 就像专车直达 - 最快最直接，但需要双方都支持（就像需要你家和商家都在专车服务区）
2. **EventSource** 像定期邮车 - 只能单向送货（服务器到客户端），但比专车覆盖更广
3. **长轮询** 像反复打电话查询 - "货到了吗？""还没""货到了吗？""到了"，虽然效率低但哪里都能用
4. **兼容库** 像智能物流系统 - 自动选择最佳配送方式，你只需要告诉它目的地

在实际项目中，根据目标用户群体选择方案：
- 如果只需要支持现代浏览器，直接使用 WebSocket
- 如果需要广泛兼容，使用 Socket.io 等库
- 如果资源有限，可以只实现长轮询作为降级方案

## 完整可运行示例

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WebSocket 兼容性演示</title>
</head>
<body>
  <h1>WebSocket 兼容性演示</h1>
  <div id="output" style="margin: 20px; padding: 10px; border: 1px solid #ccc;"></div>
  <button id="connectBtn">连接</button>
  <button id="disconnectBtn">断开</button>
  
  <!-- 使用 CDN 引入 SockJS -->
  <script src="https://cdn.jsdelivr.net/npm/sockjs-client@1.5.0/dist/sockjs.min.js"></script>
  
  <script>
    const output = document.getElementById('output');
    let connection;
    
    function log(message) {
      output.innerHTML += `<p>${new Date().toLocaleTimeString()}: ${message}</p>`;
    }
    
    function setupWebSocket() {
      if ('WebSocket' in window) {
        log('尝试使用原生 WebSocket...');
        const ws = new WebSocket('ws://echo.websocket.org');
        
        ws.onopen = () => {
          log('WebSocket 连接已建立');
          ws.send('Hello WebSocket!');
        };
        
        ws.onmessage = (e) => {
          log(`收到消息: ${e.data}`);
        };
        
        ws.onclose = () => {
          log('WebSocket 连接已关闭');
        };
        
        return ws;
      }
      return null;
    }
    
    function setupSockJS() {
      log('尝试使用 SockJS...');
      const sock = new SockJS('https://demos.kaazing.com/echo');
      
      sock.onopen = () => {
        log('SockJS 连接已建立');
        sock.send('Hello SockJS!');
      };
      
      sock.onmessage = (e) => {
        log(`收到消息: ${e.data}`);
      };
      
      sock.onclose = () => {
        log('SockJS 连接已关闭');
      };
      
      return sock;
    }
    
    function setupLongPolling() {
      log('使用长轮询作为降级方案...');
      let active = true;
      
      function poll() {
        if (!active) return;
        
        fetch('https://httpbin.org/delay/1')
          .then(res => res.json())
          .then(data => {
            log(`长轮询收到响应: ${JSON.stringify(data).slice(0, 50)}...`);
            setTimeout(poll, 2000);
          })
          .catch(err => {
            log(`长轮询错误: ${err}`);
            setTimeout(poll, 5000);
          });
      }
      
      poll();
      
      return {
        close: () => { active = false; }
      };
    }
    
    document.getElementById('connectBtn').addEventListener('click', () => {
      connection = setupWebSocket() || setupSockJS() || setupLongPolling();
    });
    
    document.getElementById('disconnectBtn').addEventListener('click', () => {
      if (connection) {
        if (connection.close) connection.close();
        log('已主动断开连接');
        connection = null;
      }
    });
  </script>
</body>
</html>
```

这个完整示例展示了从原生 WebSocket 到 SockJS 再到长轮询的逐步降级策略，您可以直接在浏览器中运行并观察不同情况下的连接方式。
