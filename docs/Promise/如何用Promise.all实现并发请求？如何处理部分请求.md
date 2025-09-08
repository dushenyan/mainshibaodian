---
tags: ['Promise','并发请求','部分请求失败']
---

# 使用 Promise.all 实现并发请求及部分请求失败处理方案

## 开场白

"关于如何使用 Promise.all 实现并发请求并处理部分请求失败的问题，这是前端开发中非常实用的场景。让我结合五年实战经验，从基础到高级为您系统讲解。"

## 核心回答

### 1. Promise.all 基础用法

"首先，让我们回顾 Promise.all 的基本用法。它接收一个 Promise 数组，当所有 Promise 都成功时返回结果数组，如果任何一个失败则立即 reject："

```javascript
// @环境: 现代浏览器/Node.js
const fetchUser = (id) => 
  fetch(`https://jsonplaceholder.typicode.com/users/${id}`).then(res => res.json());

const fetchPosts = (userId) =>
  fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`).then(res => res.json());

// 基础并发请求
Promise.all([fetchUser(1), fetchPosts(1)])
  .then(([user, posts]) => {
    console.log('用户数据:', user);
    console.log('用户文章:', posts);
  })
  .catch(error => {
    console.error('请求失败:', error); // 任一失败都会进入这里
  });
```

### 2. 处理部分请求失败

"实际项目中我们常需要即使部分请求失败，也要获取其他成功的结果。这时可以结合 Promise.allSettled 或自行封装处理逻辑："

#### 方案1：使用 Promise.allSettled (ES2020)

```javascript
// 处理部分失败的优雅方案
async function fetchUserData(userId) {
  const [userResult, postsResult] = await Promise.allSettled([
    fetchUser(userId),
    fetchPosts(userId)
  ]);

  // 统一处理结果
  const user = userResult.status === 'fulfilled' ? userResult.value : null;
  const posts = postsResult.status === 'fulfilled' ? postsResult.value : [];
  
  if (user) {
    console.log('成功获取用户:', user);
  } else {
    console.error('获取用户失败:', userResult.reason);
  }

  return { user, posts };
}

// 使用示例
fetchUserData(1).then(console.log);
```

#### 方案2：自行封装容错逻辑

```javascript
// 兼容性更好的封装方案
function tolerantPromiseAll(promises) {
  return Promise.all(
    promises.map(p => 
      p.catch(error => {
        console.warn('单个请求失败:', error);
        return { error, __isError: true };
      })
    )
  ).then(results => {
    const successes = results.filter(r => !r.__isError);
    const failures = results.filter(r => r.__isError);
    return { successes, failures };
  });
}

// 使用示例
tolerantPromiseAll([
  fetchUser(1),
  fetch('invalid-url').then(res => res.json()), // 会失败的请求
  fetchPosts(1)
]).then(({ successes, failures }) => {
  console.log('成功结果:', successes);
  console.log('失败请求:', failures);
});
```

### 3. 高级控制：并发数限制

"当需要控制并发请求数量时，可以结合自定义调度器："

```javascript
class PromisePool {
  constructor(maxConcurrent) {
    this.max = maxConcurrent;
    this.pending = [];
    this.running = 0;
  }

  add(promiseCreator) {
    return new Promise((resolve, reject) => {
      this.pending.push({ promiseCreator, resolve, reject });
      this.run();
    });
  }

  run() {
    if (this.running >= this.max || !this.pending.length) return;
    
    this.running++;
    const { promiseCreator, resolve, reject } = this.pending.shift();
    
    promiseCreator()
      .then(resolve)
      .catch(reject)
      .finally(() => {
        this.running--;
        this.run();
      });
  }
}

// 使用示例
const pool = new PromisePool(2); // 最大并发2个

const requests = [
  () => fetchUser(1),
  () => fetchUser(2),
  () => fetchUser(3),
  () => fetchPosts(1)
];

Promise.all(requests.map(req => pool.add(req)))
  .then(results => {
    console.log('受控并发结果:', results);
  });
```

## 可运行完整示例

```javascript
// @环境: 现代浏览器(支持fetch)
// 完整示例可直接在浏览器控制台运行

// 模拟API函数
function mockAPI(endpoint, shouldFail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error(`${endpoint} 请求失败`));
      } else {
        resolve(`${endpoint} 数据`);
      }
    }, Math.random() * 1000);
  });
}

// 实战场景处理
async function fetchCriticalData() {
  const apis = [
    mockAPI('/user'),
    mockAPI('/orders', true), // 模拟失败
    mockAPI('/products')
  ];

  try {
    const results = await Promise.allSettled(apis);
    
    const data = {
      user: results[0].status === 'fulfilled' ? results[0].value : null,
      orders: results[1].status === 'fulfilled' ? results[1].value : [],
      products: results[2].status === 'fulfilled' ? results[2].value : []
    };

    console.log('最终数据:', data);
    return data;
  } catch (error) {
    console.error('意外错误:', error);
    throw error;
  }
}

// 执行测试
fetchCriticalData().then(data => {
  console.log('处理后的数据:', {
    userValid: !!data.user,
    ordersCount: data.orders.length,
    productsCount: data.products.length
  });
});
```

## 通俗易懂的总结

"理解 Promise.all 的并发控制就像管理一个团队：

1. **Promise.all 是严格经理**：
   - 要求所有成员（请求）必须成功
   - 一人犯错，全组受罚（整体失败）

2. **Promise.allSettled 是宽容导师**：
   - 允许成员个别失败
   - 收集每个人的结果（成功和失败都记录）

3. **并发控制就像项目排期**：
   - 限制同时进行的任务数（避免资源耗尽）
   - 确保系统稳定运行

**开发中的最佳实践**：
- 关键路径请求 → 用 Promise.all 确保全部成功
- 非关键数据 → 用 allSettled 获取部分结果
- 大量请求 → 添加并发控制保护系统
- 错误处理 → 记录失败请求便于重试

在我的实际项目中，这套方案帮助我们在电商平台实现了：
1. 商品详情页20+接口的并行请求
2. 即使推荐系统接口失败也不影响主流程
3. 高峰期的请求流量控制"

"掌握这些技巧，可以大幅提升前端应用的稳定性和用户体验，特别是在复杂的数据获取场景下。"
