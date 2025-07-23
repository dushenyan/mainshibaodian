---
layoutClass: nav-layout
sidebar: false
editLink: false
footer: false
notArticle: true
outline: [2, 3, 4]
---

<script setup>
import { useDocsTreeData } from '@theme/hooks/useDocsTreeData'
const tree = useDocsTreeData('vue')
console.log('tree.value', tree.value)
</script>

# 前端导航

<br />

<style>
.nav-layout {
  /* 覆盖全局的 vp-layout-max-width（仅当前页面使用） */
  --vp-layout-max-width: 1660px;

  /* layout 样式 */
  .container {
    max-width: var(--vp-layout-max-width) !important;
  }
  .content-container,
  .content {
    max-width: 100% !important;
  }

  /* aside 样式 */
  .aside {
    padding-left: 0;
    max-width: 224px;
  }

  /* custom-block */
  .custom-block {
    .custom-block-title {
      font-size: var(--vp-custom-block-font-size);
    }
    ul {
      margin: 8px 0;
    }
    li {
      margin: 0;
    }
  }

  .vp-doc h2 {
    margin-top: 24px;
  }
}
</style>
