# Canvas 与 WebGL 的区别详解

## 核心区别对比

| 特性                | Canvas (2D)                          | WebGL                              |
|---------------------|---------------------------------------|------------------------------------|
| **渲染类型**         | 2D 矢量图形                           | 3D/2D 硬件加速图形                  |
| **API 层级**        | 高级 API (简单易用)                   | 低级 API (接近显卡驱动层)            |
| **编程语言**        | JavaScript                            | GLSL (着色器语言) + JavaScript      |
| **性能**            | CPU 渲染，适合简单场景                 | GPU 加速，适合复杂3D和高性能需求     |
| **坐标系**          | 二维直角坐标系                        | 三维坐标系 (-1到1的标准化设备坐标)   |
| **学习曲线**        | 平缓，适合前端开发者                   | 陡峭，需要图形学基础                 |
| **典型应用**        | 图表、简单动画、图像处理               | 3D游戏、VR/AR、复杂数据可视化        |

## 技术细节解析

### 1. Canvas (2D)

```javascript
// 基础使用示例
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// 绘制红色矩形
ctx.fillStyle = 'red';
ctx.fillRect(10, 10, 100, 100);

// 绘制文本
ctx.font = '20px Arial';
ctx.fillText('Hello Canvas', 50, 50);
```

**特点**：
- 基于指令式绘图API
- 自动处理底层渲染细节
- 适合：
  - 数据可视化 (Chart.js)
  - 简单游戏
  - 图像滤镜
  - SVG-like 绘图

### 2. WebGL

```javascript
// 初始化WebGL
const gl = canvas.getContext('webgl');

// 顶点着色器
const vsSource = `
  attribute vec4 aPosition;
  void main() {
    gl_Position = aPosition;
  }
`;

// 片段着色器
const fsSource = `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`;

// 创建着色器程序
const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

// 绘制三角形
const vertices = [
  0.0,  0.5, 0.0,
  -0.5, -0.5, 0.0,
  0.5, -0.5, 0.0
];

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

gl.drawArrays(gl.TRIANGLES, 0, 3);
```

**特点**：
- 基于状态机和着色器程序
- 需要手动管理：
  - 缓冲区
  - 着色器
  - 纹理
  - 帧缓冲
- 适合：
  - 3D建模和渲染
  - 物理模拟
  - 实时阴影和光照
  - GPU通用计算

## 性能对比测试

```javascript
// 10,000个矩形的绘制性能测试
function testCanvas2D() {
  const start = performance.now();
  for (let i = 0; i < 10000; i++) {
    ctx.fillStyle = `rgb(${i%255}, ${i%255}, ${i%255})`;
    ctx.fillRect(Math.random()*300, Math.random()*300, 10, 10);
  }
  console.log(`Canvas2D: ${performance.now() - start}ms`);
}

function testWebGL() {
  // WebGL批量渲染实现
  const positions = new Float32Array(10000 * 2);
  const colors = new Float32Array(10000 * 3);
  
  for (let i = 0; i < 10000; i++) {
    positions[i*2] = Math.random()*2-1;
    positions[i*2+1] = Math.random()*2-1;
    colors[i*3] = (i%255)/255;
    colors[i*3+1] = (i%255)/255;
    colors[i*3+2] = (i%255)/255;
  }
  
  const start = performance.now();
  // 实际WebGL渲染代码...
  console.log(`WebGL: ${performance.now() - start}ms`);
}
```

**典型结果**：
- Canvas2D: 120-200ms
- WebGL: 5-15ms (使用实例化渲染可降至1-3ms)

## 选择指南

### 使用 Canvas 当：
1. 开发简单的2D图形应用
2. 需要快速原型开发
3. 团队缺乏图形编程经验
4. 项目对性能要求不高
5. 需要与DOM元素交互

### 使用 WebGL 当：
1. 需要3D渲染能力
2. 处理大规模数据可视化 (10,000+元素)
3. 实现复杂视觉效果 (粒子系统、后期处理)
4. 需要硬件加速的物理模拟
5. 开发Web游戏或VR应用

## 混合使用方案

现代库常结合两者优势：
```javascript
// 使用Canvas2D绘制UI，WebGL渲染3D场景
const uiCanvas = document.getElementById('ui');
const gameCanvas = document.getElementById('game');

const uiCtx = uiCanvas.getContext('2d');
const gl = gameCanvas.getContext('webgl');

function render() {
  // WebGL渲染3D场景
  render3DScene(gl);
  
  // Canvas绘制UI元素
  uiCtx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
  uiCtx.fillStyle = 'white';
  uiCtx.fillText(`FPS: ${calculateFPS()}`, 10, 20);
  
  requestAnimationFrame(render);
}
```

## 通俗易懂的比喻

把图形渲染比作绘画：

- **Canvas** 像使用智能画笔：
  - 你只需要说"画个红色圆形"
  - 画笔自动处理颜料混合和笔触细节
  - 适合普通绘画需求

- **WebGL** 像直接控制画笔分子：
  - 你需要指定每个颜料分子的位置
  - 可以创造全息投影级别的作品
  - 需要学习颜料化学(图形学)知识
  - 能实现普通画笔做不到的效果

**选择口诀**：
"平面简单用画布，三维性能选GL；
Canvas上手快，WebGL潜力强。"
