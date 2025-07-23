import fs from 'node:fs'
import path from 'node:path'
import * as jsonc from 'jsonc-parser'

/**
 * 描述纯文本文件
 */
export interface TextFile {
  path: string
  data: string
}

/**
 * 修改JSON文件的联合类型
 */
type ModifyUnion = [jsonc.JSONPath, unknown]

/**
 * 描述JSON文件
 */
interface JsonFile {
  path: Readonly<string>
  text: Readonly<string>
  data: Readonly<unknown>
  modified: ModifyUnion[]
}

/**
 * 读取JSON/JSONC文件并返回解析后的数据
 */
export async function readJsoncFile(name: string, cwd: string): Promise<JsonFile> {
  const file = await readTextFile(name, cwd)
  const data = jsonc.parse(file.data)
  const modified: ModifyUnion[] = []

  return { ...file, data, modified, text: file.data }
}

/**
 * 写入JSON/JSONC文件
 */
export async function writeJsoncFile(file: JsonFile): Promise<void> {
  let newJSON = file.text
  for (const [key, value] of file.modified) {
    const edit = (jsonc.modify(newJSON, key, value, {}))
    newJSON = jsonc.applyEdits(newJSON, edit)
  }

  return writeTextFile({ ...file, data: newJSON })
}

/**
 * 读取文本文件并返回其内容
 */
export function readTextFile(name: string, cwd: string): Promise<TextFile> {
  return new Promise((resolve, reject) => {
    const filePath = path.join(cwd, name)

    fs.readFile(filePath, 'utf8', (err, text) => {
      if (err) {
        reject(err)
      }
      else {
        resolve({
          path: filePath,
          data: text,
        })
      }
    })
  })
}

/**
 * 写入文本文件
 */
export function writeTextFile(file: TextFile): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(file.path, file.data, (err) => {
      if (err)
        reject(err)

      else
        resolve()
    })
  })
}
