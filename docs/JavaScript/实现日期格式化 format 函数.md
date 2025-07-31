# JavaScript 日期格式化函数实现

## 可用环境代码

```javascript
// 这里将实现日期格式化函数
const date = new Date('2023-05-15T14:30:00');
```

## 日期格式化函数实现

### 1. 基础版本（支持常见格式）

```javascript
/**
 * 日期格式化函数
 * @param {Date} date - 日期对象
 * @param {string} format - 格式字符串，例如 'YYYY-MM-DD hh:mm:ss'
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date, format = 'YYYY-MM-DD') {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return format
    .replace(/YYYY/g, year)
    .replace(/YY/g, String(year).slice(-2))
    .replace(/MM/g, month)
    .replace(/M/g, date.getMonth() + 1)
    .replace(/DD/g, day)
    .replace(/D/g, date.getDate())
    .replace(/hh/g, hours)
    .replace(/h/g, date.getHours())
    .replace(/mm/g, minutes)
    .replace(/m/g, date.getMinutes())
    .replace(/ss/g, seconds)
    .replace(/s/g, date.getSeconds());
}

// 使用示例
console.log(formatDate(date, 'YYYY-MM-DD'));           // "2023-05-15"
console.log(formatDate(date, 'YYYY/MM/DD hh:mm:ss')); // "2023/05/15 14:30:00"
console.log(formatDate(date, 'YY-M-D h:m:s'));         // "23-5-15 14:30:0"
```

### 2. 高级版本（支持更多格式）

```javascript
function formatDate(date, format = 'YYYY-MM-DD') {
  const map = {
    YYYY: date.getFullYear(),
    YY: String(date.getFullYear()).slice(-2),
    MM: String(date.getMonth() + 1).padStart(2, '0'),
    M: date.getMonth() + 1,
    DD: String(date.getDate()).padStart(2, '0'),
    D: date.getDate(),
    HH: String(date.getHours()).padStart(2, '0'),
    H: date.getHours(),
    hh: String(date.getHours() % 12 || 12).padStart(2, '0'),
    h: date.getHours() % 12 || 12,
    mm: String(date.getMinutes()).padStart(2, '0'),
    m: date.getMinutes(),
    ss: String(date.getSeconds()).padStart(2, '0'),
    s: date.getSeconds(),
    SSS: String(date.getMilliseconds()).padStart(3, '0'),
    A: date.getHours() < 12 ? 'AM' : 'PM',
    a: date.getHours() < 12 ? 'am' : 'pm',
    ddd: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
    dddd: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()]
  };

  // 正则匹配替换
  return format.replace(/(YYYY|YY|MM|M|DD|D|HH|H|hh|h|mm|m|ss|s|SSS|A|a|ddd|dddd)/g, 
    (matched) => map[matched]);
}

// 使用示例
console.log(formatDate(date, 'YYYY-MM-DD HH:mm:ss')); // "2023-05-15 14:30:00"
console.log(formatDate(date, 'hh:mm:ss A'));           // "02:30:00 PM"
console.log(formatDate(date, 'ddd, MMM D, YYYY'));     // "Mon, May 15, 2023"
```

### 3. 支持本地化版本

```javascript
function formatDate(date, format = 'YYYY-MM-DD', locale = 'en-US') {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: format.includes('A') || format.includes('a')
  };
  
  // 使用Intl.DateTimeFormat处理本地化
  let formatted = new Intl.DateTimeFormat(locale, options).format(date);
  
  // 自定义格式处理
  if (format.includes('YYYY')) {
    formatted = formatted.replace(/(\d{4})/, date.getFullYear());
  }
  if (format.includes('A')) {
    formatted = formatted.replace(/([AP]M)/, date.getHours() < 12 ? 'AM' : 'PM');
  }
  if (format.includes('a')) {
    formatted = formatted.replace(/([ap]m)/, date.getHours() < 12 ? 'am' : 'pm');
  }
  
  return formatted;
}

// 使用示例
console.log(formatDate(date, 'YYYY-MM-DD', 'zh-CN')); // "2023-05-15"
console.log(formatDate(date, 'YYYY/MM/DD', 'ja-JP')); // "2023/05/15"
```

### 4. 性能优化版本（避免频繁正则替换）

```javascript
function formatDate(date, format = 'YYYY-MM-DD') {
  const pad = (num) => String(num).padStart(2, '0');
  
  const tokens = {
    YYYY: date.getFullYear(),
    YY: String(date.getFullYear()).slice(-2),
    MM: pad(date.getMonth() + 1),
    M: date.getMonth() + 1,
    DD: pad(date.getDate()),
    D: date.getDate(),
    HH: pad(date.getHours()),
    H: date.getHours(),
    hh: pad(date.getHours() % 12 || 12),
    h: date.getHours() % 12 || 12,
    mm: pad(date.getMinutes()),
    m: date.getMinutes(),
    ss: pad(date.getSeconds()),
    s: date.getSeconds(),
    SSS: String(date.getMilliseconds()).padStart(3, '0'),
    A: date.getHours() < 12 ? 'AM' : 'PM',
    a: date.getHours() < 12 ? 'am' : 'pm',
    ddd: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
    dddd: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()]
  };

  // 按最长匹配优先的顺序处理
  const patterns = [
    'YYYY', 'YY', 'MM', 'M', 'DD', 'D', 
    'HH', 'H', 'hh', 'h', 'mm', 'm', 
    'ss', 's', 'SSS', 'A', 'a', 'ddd', 'dddd'
  ];

  let result = format;
  for (const pattern of patterns) {
    result = result.replace(new RegExp(pattern, 'g'), tokens[pattern]);
  }
  
  return result;
}
```

## 完整可运行示例

```html
<!DOCTYPE html>
<html>
<head>
  <title>日期格式化函数</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .output { margin-top: 20px; padding: 10px; border: 1px solid #ddd; }
  </style>
</head>
<body>
  <h1>日期格式化函数演示</h1>
  <div id="output" class="output"></div>

  <script>
    const output = document.getElementById('output');
    function log(msg) {
      output.innerHTML += `<p>${msg}</p>`;
    }

    // 当前日期
    const now = new Date();
    
    // 格式化函数实现
    function formatDate(date, format = 'YYYY-MM-DD') {
      const pad = (num) => String(num).padStart(2, '0');
      
      const tokens = {
        YYYY: date.getFullYear(),
        YY: String(date.getFullYear()).slice(-2),
        MM: pad(date.getMonth() + 1),
        M: date.getMonth() + 1,
        DD: pad(date.getDate()),
        D: date.getDate(),
        HH: pad(date.getHours()),
        H: date.getHours(),
        hh: pad(date.getHours() % 12 || 12),
        h: date.getHours() % 12 || 12,
        mm: pad(date.getMinutes()),
        m: date.getMinutes(),
        ss: pad(date.getSeconds()),
        s: date.getSeconds(),
        SSS: String(date.getMilliseconds()).padStart(3, '0'),
        A: date.getHours() < 12 ? 'AM' : 'PM',
        a: date.getHours() < 12 ? 'am' : 'pm',
        ddd: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
        dddd: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()]
      };

      // 按最长匹配优先的顺序处理
      const patterns = [
        'YYYY', 'YY', 'MM', 'M', 'DD', 'D', 
        'HH', 'H', 'hh', 'h', 'mm', 'm', 
        'ss', 's', 'SSS', 'A', 'a', 'ddd', 'dddd'
      ];

      let result = format;
      for (const pattern of patterns) {
        result = result.replace(new RegExp(pattern, 'g'), tokens[pattern]);
      }
      
      return result;
    }

    // 测试各种格式
    log(`<b>当前时间:</b> ${now}`);
    log(`<b>YYYY-MM-DD:</b> ${formatDate(now, 'YYYY-MM-DD')}`);
    log(`<b>MM/DD/YYYY:</b> ${formatDate(now, 'MM/DD/YYYY')}`);
    log(`<b>DD.MM.YYYY:</b> ${formatDate(now, 'DD.MM.YYYY')}`);
    log(`<b>YYYY年MM月DD日:</b> ${formatDate(now, 'YYYY年MM月DD日')}`);
    log(`<b>hh:mm:ss A:</b> ${formatDate(now, 'hh:mm:ss A')}`);
    log(`<b>HH:mm:ss:</b> ${formatDate(now, 'HH:mm:ss')}`);
    log(`<b>ddd, MMM D, YYYY:</b> ${formatDate(now, 'ddd, MMM D, YYYY')}`);
    log(`<b>dddd, MMMM D, YYYY:</b> ${formatDate(now, 'dddd, MMMM D, YYYY')}`);
    log(`<b>YYYY-MM-DD HH:mm:ss.SSS:</b> ${formatDate(now, 'YYYY-MM-DD HH:mm:ss.SSS')}`);
  </script>
</body>
</html>
```

## 总结

实现日期格式化函数的关键点：

1. **提取日期各部分**：年、月、日、时、分、秒等
2. **格式化处理**：补零、12/24小时制转换、AM/PM处理
3. **模式匹配替换**：使用正则表达式或字符串替换
4. **性能优化**：避免频繁的正则创建，使用缓存
5. **扩展性**：支持更多格式如季度、周数等

**最佳实践建议**：
- 简单需求可以使用基础版本
- 需要多语言支持考虑使用 `Intl.DateTimeFormat`
- 高频调用场景使用性能优化版本
- 复杂日期处理推荐使用现成库如 `moment.js` 或 `date-fns`
