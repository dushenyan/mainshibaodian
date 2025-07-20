import fs from 'node:fs'
import path from 'node:path'

export function usePrintTree(dirPath:string, prefix = '') {
  const items = fs.readdirSync(dirPath, { withFileTypes: true });
  const lastIndex = items.length - 1;

  items.forEach((item, index) => {
    const isLast = index === lastIndex;
    const pointer = isLast ? '└── ' : '├── ';
    console.log(prefix + pointer + item.name);

    if (item.isDirectory()) {
      const newPrefix = prefix + (isLast ? '    ' : '│   ');
      usePrintTree(path.join(dirPath, item.name), newPrefix);
    }
  });
}
