export interface NavLink {
  /** 站点图标 */
  icon?: string | { svg: string }
  /** 站点名称 */
  title: string
  /** 站点名称 */
  desc?: string
  /** 站点链接 */
  link: string
}

export interface PageEnvDataVO {
  path: string
  title: string
  relativePath: string
  cleanUrls: boolean
  sfcBlocks: {
    template: string | null
    script: string | null
    scriptSetup: string | null
    scripts: string[]
    styles: string[]
    customBlocks: string[]
  }
  content: string
  excerpt: string
  frontmatter: {
    layoutClass: string
    sidebar: boolean
    editLink: boolean
    footer: boolean
    /**
     * 是否给文章添加统计数据
     */
    notArticle: boolean
    /**
     * 是否开启方括号转义
     */
    bracketEscaping: boolean
    [key: string]: any
  }
}

export interface EnhancedDocsTreeDataVO {
  title: string
  metadata?: Record<string, any>
  link?: string
  fileExtension?: string
  items?: EnhancedDocsTreeDataVO[]
}
