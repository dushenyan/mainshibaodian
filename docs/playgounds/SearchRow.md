---
sidebar: false
outline: [2, 3, 4]
---

# SearchRow 搜索表单组件

### 文档目录
```plain
./src/pages
├── SearchRow.tsx
├── index.scss
└── index.vue
```

### 1. 组件概述
`SearchRow` 组件是一个基于 Element Plus 和 Vue 3 开发的可展开/收起的搜索表单组件。该组件可以自动识别插槽中的 `ElForm` 和 `ElFormItem` 元素，将表单项和按钮进行分类处理，并根据表单项数量和展开状态动态调整布局。

### 2. 组件解决的问题
+ **布局管理**：当搜索表单包含较多表单项时，页面空间可能会显得拥挤。`SearchRow` 组件提供了展开/收起功能，默认只显示部分表单项，用户可以根据需要展开查看全部表单项，优化了页面布局。
+ **按钮管理**：自动识别插槽中的按钮组，并在按钮数量较多时调整布局。同时，会自动添加展开/收起按钮，方便用户操作。
+ **动态布局**：根据表单项数量和展开状态，动态计算列宽，确保表单在不同状态下都能保持良好的布局。

### 3. 组件用法

3.1 引入组件
```vue
<script setup lang="ts">
import { reactive } from 'vue'
import SearchRow from './SearchRow'

const queryParams = reactive({
  no: '',
  // 其他查询参数
})

function messageBox() {
  // 搜索逻辑
}
</script>

<template>
  <SearchRow>
    <el-form :model="queryParams" :inline="true">
      <!-- 表单项 -->
      <el-form-item label="表单1" prop="no">
        <el-input v-model="queryParams.no" placeholder="请输入表单1" clearable />
      </el-form-item>
      <!-- 更多表单项 -->
      <el-form-item>
        <el-button @click="messageBox">
          搜索
        </el-button>
        <el-button>
          重置
        </el-button>
        <el-button type="primary" plain>
          新增
        </el-button>
      </el-form-item>
    </el-form>
  </SearchRow>
</template>
```

3.2 说明
+ 将 `ElForm` 组件放在 `SearchRow` 组件的插槽中。
+ 表单项使用 `ElFormItem` 包裹，按钮组放在最后一个 `ElFormItem` 中。
+ 组件会自动识别表单项和按钮组，并根据情况添加展开/收起按钮。

### 4. 组件使用注释说明
```tsx
// SearchRow.tsx
import type { Slots } from 'vue'
import { ElButton, ElCol, ElFormItem, ElRow } from 'element-plus'
import { computed, defineComponent, h, ref, SlotsType, watch } from 'vue'
import './index.scss'

// 定义节点类型
type VueNode = any // 实际使用中应根据 Vue 节点类型准确定义

/**
 * SearchRow 组件是一个可展开/收起的搜索表单组件。
 * 该组件会自动识别插槽中的 ElForm 和 ElFormItem 元素，
 * 对表单项和按钮进行分类处理，并动态调整布局。
 */
export default defineComponent({
  /**
   * 组件名称
   */
  name: 'SearchRow',
  /**
   * 组件的 setup 函数
   * @param props - 组件的属性
   * @param {Slots} slots - 组件的插槽
   */
  setup(props, { slots }) {
    // 展开状态，默认未展开
    const isExpanded = ref(false)
    // 按钮是否独占一行，默认否
    const initButtonExclusive = ref(false)
    // 默认显示的表单项数量，默认 2 个
    const defaultVisibleItems = ref(2)

    // 监听 initButtonExclusive 的变化，更新默认显示的表单项数量
    watch(() => initButtonExclusive, (newVal) => {
      defaultVisibleItems.value = newVal ? 3 : 2
    })

    // 切换展开/收起状态的函数
    const toggleExpand = () => {
      isExpanded.value = !isExpanded.value
    }

    return () => {
      /**
       * 获取插槽内容
       * @param {Slots} slot - 插槽对象
       * @returns {VueNode} 插槽内容
       */
      function getSlotContent(slot: Slots): VueNode {
        return slot?.default ? slot.default() : slot
      }
      // 获取默认插槽内容
      const slotContent = getSlotContent(slots)

      // 如果没有内容或不是 el-form，直接返回
      if (slotContent.length === 0 || !slotContent[0].children) {
        return slotContent
      }

      // 查找 el-form 和收集表单项
      let formNode: VueNode | null = null
      const formItems: VueNode[] = []
      const buttons: VueNode[] = []

      /**
       * 遍历节点，查找 ElForm 和 ElFormItem 元素
       * @param {VueNode[]} nodes - 节点数组
       */
      const traverseNodes = (nodes: VueNode[]) => {
        const newNodes = getSlotContent(nodes)
        if (!newNodes)
          return

        let index = 0

        for (const node of newNodes) {
          index++
          if (node.type?.name === 'ElForm') {
            formNode = node
          }

          if (node.type?.name === 'ElFormItem') {
            // 检查是否是按钮组 最后
            if (index === newNodes.length) {
              buttons.push(node)
            }
            else {
              formItems.push(node)
            }
          }

          if (node.children) {
            traverseNodes(node.children)
          }
        }
      }

      traverseNodes(slotContent)

      if (!formNode) {
        return slotContent
      }

      /**
       * 渲染表单项
       * @param {VueNode[]} items - 表单项数组
       * @returns {JSX.Element[]} 渲染后的表单项
       */
      const renderFormItems = (items: VueNode[]) => {
        return items.map((item, index) => (
          <ElCol span={8} key={`form-item-${index}`}>
            {item}
          </ElCol>
        ))
      }

      // 创建展开/收起按钮，补充图标显示
      const expandButton = h(ElButton, {
        type: 'text',
        onClick: toggleExpand,
        class: 'ml-3',
      }, () => [
        isExpanded.value ? '收起' : '展开',
      ])

      if (buttons.length > 0) {
        const originalChildren = buttons[0].children.default()
        // 使用 h 函数重新创建 ElFormItem 节点
        buttons[0] = h(ElFormItem, buttons[0].props, () => [...originalChildren, formItems.length > 2 && expandButton])
        if (buttons.length >= 3) {
          initButtonExclusive.value = true
        }
      }
      else {
        buttons.push(h(ElFormItem, null, () => [expandButton]))
      }

      // 计算按钮组的列宽
      const ColSpan = computed(() => {
        const formItemCount = formItems.length

        if (formItemCount === 1) {
          return 16
        }
        if (initButtonExclusive.value) {
          return 24
        }
        // 未展开
        if (!isExpanded.value) {
          return 8
        }
        if (formItemCount % 3 === 1) {
          return 16
        }
        if (formItemCount % 3 === 0) {
          return 24
        }
        return 8
      })

      /**
       * 渲染按钮组
       * @returns {JSX.Element} 渲染后的按钮组
       */
      const renderButtons = () => {
        return (
          <ElCol span={ColSpan.value}>
            <div class="right-align-form-item">
              {buttons.map(button => (
                <>
                  {button}
                </>
              ))}
            </div>
          </ElCol>
        )
      }

      /**
       * 渲染展开的内容
       * @returns {JSX.Element | null} 渲染后的展开内容
       */
      const renderExpandedContent = () => {
        if (!isExpanded.value)
          return null

        return (
          <>
            {renderFormItems(formItems.slice(defaultVisibleItems.value))}
          </>
        )
      }

      // 返回 JSX
      return (
        <div class="search-row">
          {formNode && (
            <formNode.type
              {...formNode.props}
              class="-mb-15px"
            >
              <ElRow gutter={20}>
                {renderFormItems(formItems.slice(0, defaultVisibleItems.value))}
                {renderExpandedContent()}
                {renderButtons()}
              </ElRow>
            </formNode.type>
          )}
        </div>
      )
    }
  },
})
```

::: sandbox {showLineNumbers=true}
```vue /index.vue [active]
<script setup lang="ts">
import { reactive } from 'vue'
import SearchRow from './SearchRow.tsx'

const queryParams = reactive({
  no: '',
  // 其他查询参数
})

function messageBox() {
  // 搜索逻辑
}
</script>

<template>
  <SearchRow>
    <el-form :model="queryParams" :inline="true">
      <!-- 表单项 -->
      <el-form-item label="表单1" prop="no">
        <el-input v-model="queryParams.no" placeholder="请输入表单1" clearable />
      </el-form-item>
      <!-- 更多表单项 -->
      <el-form-item>
        <el-button @click="messageBox">
          搜索
        </el-button>
        <el-button>
          重置
        </el-button>
        <el-button type="primary" plain>
          新增
        </el-button>
      </el-form-item>
    </el-form>
  </SearchRow>
</template>
```

```ts /MyApp.tsx
// SearchRow.tsx
import type { Slots } from 'vue'
import { ElButton, ElCol, ElFormItem, ElRow } from 'element-plus'
import { computed, defineComponent, h, ref, SlotsType, watch } from 'vue'
import './index.scss'

// 定义节点类型
type VueNode = any // 实际使用中应根据 Vue 节点类型准确定义

/**
 * SearchRow 组件是一个可展开/收起的搜索表单组件。
 * 该组件会自动识别插槽中的 ElForm 和 ElFormItem 元素，
 * 对表单项和按钮进行分类处理，并动态调整布局。
 */
export default defineComponent({
  /**
   * 组件名称
   */
  name: 'SearchRow',
  /**
   * 组件的 setup 函数
   * @param props - 组件的属性
   * @param {Slots} slots - 组件的插槽
   */
  setup(props, { slots }) {
    // 展开状态，默认未展开
    const isExpanded = ref(false)
    // 按钮是否独占一行，默认否
    const initButtonExclusive = ref(false)
    // 默认显示的表单项数量，默认 2 个
    const defaultVisibleItems = ref(2)

    // 监听 initButtonExclusive 的变化，更新默认显示的表单项数量
    watch(() => initButtonExclusive, (newVal) => {
      defaultVisibleItems.value = newVal ? 3 : 2
    })

    // 切换展开/收起状态的函数
    const toggleExpand = () => {
      isExpanded.value = !isExpanded.value
    }

    return () => {
      /**
       * 获取插槽内容
       * @param {Slots} slot - 插槽对象
       * @returns {VueNode} 插槽内容
       */
      function getSlotContent(slot: Slots): VueNode {
        return slot?.default ? slot.default() : slot
      }
      // 获取默认插槽内容
      const slotContent = getSlotContent(slots)

      // 如果没有内容或不是 el-form，直接返回
      if (slotContent.length === 0 || !slotContent[0].children) {
        return slotContent
      }

      // 查找 el-form 和收集表单项
      let formNode: VueNode | null = null
      const formItems: VueNode[] = []
      const buttons: VueNode[] = []

      /**
       * 遍历节点，查找 ElForm 和 ElFormItem 元素
       * @param {VueNode[]} nodes - 节点数组
       */
      const traverseNodes = (nodes: VueNode[]) => {
        const newNodes = getSlotContent(nodes)
        if (!newNodes)
          return

        let index = 0

        for (const node of newNodes) {
          index++
          if (node.type?.name === 'ElForm') {
            formNode = node
          }

          if (node.type?.name === 'ElFormItem') {
            // 检查是否是按钮组 最后
            if (index === newNodes.length) {
              buttons.push(node)
            }
            else {
              formItems.push(node)
            }
          }

          if (node.children) {
            traverseNodes(node.children)
          }
        }
      }

      traverseNodes(slotContent)

      if (!formNode) {
        return slotContent
      }

      /**
       * 渲染表单项
       * @param {VueNode[]} items - 表单项数组
       * @returns {JSX.Element[]} 渲染后的表单项
       */
      const renderFormItems = (items: VueNode[]) => {
        return items.map((item, index) => (
          <ElCol span={8} key={`form-item-${index}`}>
            {item}
          </ElCol>
        ))
      }

      // 创建展开/收起按钮，补充图标显示
      const expandButton = h(ElButton, {
        type: 'text',
        onClick: toggleExpand,
        class: 'ml-3',
      }, () => [
        isExpanded.value ? '收起' : '展开',
      ])

      if (buttons.length > 0) {
        const originalChildren = buttons[0].children.default()
        // 使用 h 函数重新创建 ElFormItem 节点
        buttons[0] = h(ElFormItem, buttons[0].props, () => [...originalChildren, formItems.length > 2 && expandButton])
        if (buttons.length >= 3) {
          initButtonExclusive.value = true
        }
      }
      else {
        buttons.push(h(ElFormItem, null, () => [expandButton]))
      }

      // 计算按钮组的列宽
      const ColSpan = computed(() => {
        const formItemCount = formItems.length

        if (formItemCount === 1) {
          return 16
        }
        if (initButtonExclusive.value) {
          return 24
        }
        // 未展开
        if (!isExpanded.value) {
          return 8
        }
        if (formItemCount % 3 === 1) {
          return 16
        }
        if (formItemCount % 3 === 0) {
          return 24
        }
        return 8
      })

      /**
       * 渲染按钮组
       * @returns {JSX.Element} 渲染后的按钮组
       */
      const renderButtons = () => {
        return (
          <ElCol span={ColSpan.value}>
            <div class="right-align-form-item">
              {buttons.map(button => (
                <>
                  {button}
                </>
              ))}
            </div>
          </ElCol>
        )
      }

      /**
       * 渲染展开的内容
       * @returns {JSX.Element | null} 渲染后的展开内容
       */
      const renderExpandedContent = () => {
        if (!isExpanded.value)
          return null

        return (
          <>
            {renderFormItems(formItems.slice(defaultVisibleItems.value))}
          </>
        )
      }

      // 返回 JSX
      return (
        <div class="search-row">
          {formNode && (
            <formNode.type
              {...formNode.props}
              class="-mb-15px"
            >
              <ElRow gutter={20}>
                {renderFormItems(formItems.slice(0, defaultVisibleItems.value))}
                {renderExpandedContent()}
                {renderButtons()}
              </ElRow>
            </formNode.type>
          )}
        </div>
      )
    }
  },
})
```

```scss /index.scss
/* index.scss */
.search-row {
  padding: 12px;
  width: 100%;

  .el-form--inline {
    .right-align-form-item {
      .el-form-item__content {
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
      }
    }

    .el-form-item {
      width: 100% !important;
    }
  }

  .el-date-editor.el-input {
    width: 100% !important;
  }
}
```
:::
