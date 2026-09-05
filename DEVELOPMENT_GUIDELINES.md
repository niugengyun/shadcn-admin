# 开发规范

## 1. 开发前置

AI 或开发者修改代码前必须按顺序执行：

1. 读取 DESIGN_SYSTEM.md 全文。
2. 检查 src/components/ui/、src/lib/utils.ts 和 package.json。
3. 检查现有页面、路由、i18n 文案和相邻功能。
4. 在官方 shadcn/ui 文档中确认是否已有组件、Block、Chart 或交互。
5. 先复用现有组件；只有官方和项目都没有时才新增最小组件。若用户提供截图或设计图并要求 1:1，先提取其布局、间距、层级和状态，再用现有组件完成还原。
6. 修改后运行 npm run build、npm run lint；UI 修改增加桌面和手机视口检查。

本项目常见 UI 问题和通用处理原则记录在 DESIGN_SYSTEM.md 的“常见失败模式”中。遇到类似问题时必须先对照该章节，禁止重新引入已知的覆盖、固定宽度和自定义交互问题。

## 2. 基于模板创建其他项目

本仓库同时作为后台框架模板使用。其他项目接入时按以下顺序：

1. 复制或初始化模板后，先读取 `AGENTS.md`、`DESIGN_SYSTEM.md`、`DEVELOPMENT_GUIDELINES.md`。
2. 保留框架层：`src/components/ui/`、`src/lib/`、`src/index.css`、应用壳层 Nav/Sidebar/Content、主题 Provider、i18n 基础能力和构建配置。
3. 盘点 `src/pages/` 中的业务页面；模板示例页面不是框架必需品，可以删除或替换，但删除前必须同步清理导航、路由、i18n、接口和无引用文件。
4. 新项目只保留自己需要的页面和业务服务，不要为了保留示例而携带 Agents、Routes、Metrics 等无关业务模块。
5. 不要复制旧页面级 CSS；新业务页面从现有 UI 组件和统一 Content 布局开始。
6. 完成迁移后检查：直接访问新路由、浏览器前进后退、主题切换、语言切换、侧栏折叠、桌面/手机布局，以及 `npm run build` 和 `npm run lint`。

模板复用的删除边界：可以删除示例业务，不得删除仍被框架或其他页面引用的 UI 组件、token、工具函数、壳层布局和主题能力。无法确认依赖关系时先搜索引用并标记待确认，不凭猜测删除。

## 3. 页面命名

- 页面文件使用 PascalCase，名称表达业务对象或功能：Agents.tsx、Metrics.tsx、Routes.tsx。
- 页面默认导出同名组件：export default function Agents()。
- 页面文件只负责页面组合和业务数据，不承载通用 Button/Card/Dialog 样式。
- 页面标题必须是 h1，下面紧跟唯一的页面子标题 p；不重复显示面包屑、小标题或路由标签。
- 新页面的根节点放在 main-content 内，遵守统一 Content 间距和响应式网格。
- 新页面根节点不得再添加横向 `px-*`、`padding-inline`、固定 `width`、`max-width` 或 `mx-auto`；页面左右边界统一继承 `.main-content`，避免各页面宽度不一致。

## 4. 路由命名和创建

- 路径使用小写 kebab-case：/token-metrics、/agent-gateway。
- 路由不得使用大写、空格、下划线或无意义缩写。
- 导航 ID 使用小写 camelCase：tokenMetrics、agentGateway。
- 新路由必须同时更新：
  - App.tsx 的 NavId
  - navItems
  - pathToNavId 和 navIdToPath 的映射
  - 页面渲染分支
  - i18n 的 nav 文案
- 路由变更必须保留浏览器前进、后退和直接访问 URL 的行为。
- 不为单页功能引入新的路由库，除非项目明确采用该库。

## 5. 组件使用

- Button 先选择官方 variant/size，再写布局 class；禁止用自定义 class 复制按钮外观。
- 图标按钮必须使用 size=icon，并提供 aria-label/title。
- Card 使用 Card 组件；外层只补充网格位置和业务间距。
- Input、Select、Switch、Dialog、DropdownMenu、Table 等必须使用项目 UI 组件。
- 自定义组件必须使用 cn 和 semantic tokens；交互优先使用 Radix 官方 primitive。
- 不得在 App.css 用父级选择器覆盖组件的颜色、边框、宽高、圆角、阴影或 focus 状态。
- 不得在页面硬编码 hex、zinc、white、black 来替代主题 token。
- 任何新增可见文案都要补齐中英文 i18n。

## 6. 布局和响应式

- 应用使用 Nav + Sidebar + Content 三层布局。
- Content 不设置固定 max-width；使用剩余宽度和响应式内边距。
- `.main-content` 是 Content 横向间距的唯一来源；顶部用户操作区右边缘必须与页面内容右边缘对齐。
- 页面模块间距默认 16px，标题区到首模块 24px，常用内部间距 8/12/16/24px。
- 网格列必须使用 minmax(0, 1fr)，移动端单列或自然换行。
- 新页面必须在至少 390px、768px、1440px 检查无横向溢出。
- 顶部 Nav、Sidebar、Content 必须共享同一边界，不得单独写另一套宽度。

## 7. 禁止事项

- 不删除既有业务逻辑、数据、路由和交互流程。
- 不重新实现官方已有组件或功能。
- 1:1 还原截图/设计图时可以调整页面组合层布局，但不得把参考稿误解为允许重写组件行为、无障碍能力或全局主题。
- 不保留已经被组件替代的旧 CSS、旧伪组件和死代码。
- 不用 !important、currentColor 边框或白色边框修复样式。
- 不把页面级布局样式写进 UI 组件，也不把组件样式散落到 App.css。
