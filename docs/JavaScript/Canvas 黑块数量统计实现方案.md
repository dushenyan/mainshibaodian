# Canvas 黑块数量统计实现方案

## 方案概述

我将提供一个完整的解决方案，用于统计 Canvas 上随机分布的黑块数量。这个方案包括图像处理算法和优化策略。

## 实现代码

```javascript
function countBlackBlocks(canvas, threshold = 30) {
  // 获取Canvas的像素数据
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // 创建访问标记数组
  const visited = new Array(width * height).fill(false);
  let blockCount = 0;
  
  // 定义8个方向的邻居偏移量
  const directions = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0],          [1, 0],
    [-1, 1],  [0, 1],  [1, 1]
  ];
  
  // 遍历所有像素
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      
      // 如果像素是黑色且未被访问过
      if (!visited[index] && isBlackPixel(data, index, threshold)) {
        // 开始BFS标记连通区域
        const queue = [[x, y]];
        visited[index] = true;
        
        while (queue.length > 0) {
          const [cx, cy] = queue.shift();
          
          // 检查8个方向的邻居
          for (const [dx, dy] of directions) {
            const nx = cx + dx;
            const ny = cy + dy;
            
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const neighborIndex = ny * width + nx;
              
              if (!visited[neighborIndex] && isBlackPixel(data, neighborIndex, threshold)) {
                visited[neighborIndex] = true;
                queue.push([nx, ny]);
              }
            }
          }
        }
        
        blockCount++;
      }
    }
  }
  
  return blockCount;
}

// 辅助函数：判断是否为黑像素
function isBlackPixel(data, index, threshold) {
  const r = data[index * 4];
  const g = data[index * 4 + 1];
  const b = data[index * 4 + 2];
  
  // 计算灰度值 (简化公式)
  const grayValue = (r + g + b) / 3;
  
  // 小于阈值则认为是黑像素
  return grayValue < threshold;
}
```

## 算法说明

1. **图像数据获取**：
   - 使用 `getImageData()` 获取 Canvas 所有像素的 RGBA 数据
   - 每个像素占4个字节（R,G,B,A）

2. **连通区域分析**：
   - 使用广度优先搜索(BFS)算法标记连通的黑像素区域
   - 8方向邻域检测确保斜向连接的黑块也能被识别为一个整体

3. **黑像素判定**：
   - 将RGB转换为灰度值
   - 通过阈值(默认30)判断是否为黑像素（可调整）

4. **性能优化**：
   - 使用访问标记数组避免重复处理
   - 队列处理确保高效遍历

## 使用示例

```javascript
// 获取Canvas元素
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// 随机绘制黑块示例
function drawRandomBlocks() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 随机绘制20-50个黑块
  const blockCount = 20 + Math.floor(Math.random() * 30);
  for (let i = 0; i < blockCount; i++) {
    const x = Math.random() * (canvas.width - 20);
    const y = Math.random() * (canvas.height - 20);
    const size = 5 + Math.random() * 15;
    
    ctx.fillStyle = 'black';
    ctx.fillRect(x, y, size, size);
  }
}

// 绘制并统计
drawRandomBlocks();
const count = countBlackBlocks(canvas);
console.log(`Canvas上有 ${count} 个黑块`);
```

## 高级优化方案

对于大型Canvas，可以考虑以下优化：

1. **分块处理**：将Canvas分成多个区域并行处理
2. **分辨率降低**：先缩小图像处理再放大结果
3. **Web Worker**：使用多线程避免界面卡顿
4. **GPU加速**：通过WebGL实现更快的像素处理

```javascript
// Web Worker优化示例
const worker = new Worker('blob-counter-worker.js');
worker.postMessage({
  canvas: canvas.transferControlToOffscreen()
}, [canvas.transferControlToOffscreen()]);

worker.onmessage = function(e) {
  console.log(`黑块数量: ${e.data.count}`);
};
```

## 边界情况处理

1. **抗锯齿边缘**：调整阈值处理半透明像素
2. **极小黑点**：可设置最小像素数过滤噪声
3. **非纯黑色**：修改 `isBlackPixel` 函数适应深灰色块

这个解决方案能准确统计Canvas上的黑块数量，适用于大多数应用场景。
