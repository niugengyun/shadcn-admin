# 全局前端架构与设计系统开发规范 (DESIGN_SYSTEM.md)

本文档定义了本项目在 UI/UX 架构、设计语言、组件选型及布局约束上的全局通用规范。所有页面开发及 AI 编程助手必须无条件遵循本规范，确保系统在视觉、交互与工程质量上保持绝对一致。

---

## 1. 核心设计原则 (Design Principles)

1. **全面复用官方内置原语 (Zero Redundancy)**：
   - 严禁手写 HTML 原生基础标签（如 `<button>`, `<input>`, `<table>` 等）来替代组件。
   - 所有基础组件统一从项目内置的 `@/components/ui/*` 导入。
   - 项目环境已配置 **shadcn MCP**。若缺少组件，必须优先通过 MCP 工具拉取官方标准原语，严禁私自开发或引入第三方冗余 UI 库。
2. **严格继承官方 Zinc 默认黑白配色 (Official Monochrome)**：
   - 严禁在 CSS/Tailwind 中手动覆写全局色盘，严禁引入偏蓝、偏紫或其它带偏色的主题色。
   - 所有颜色必须且仅能通过系统标准 Semantic Tokens 引用：
     - 背景基底：`bg-background`（纯黑 `#09090b` / 纯白 `#ffffff`）
     - 内容卡片：`bg-card`，文字使用 `text-card-foreground`
     - 边框与分割线：`border-border`（极细深灰边框）
     - 次级/悬浮背景：`bg-secondary` / `bg-muted`
     - 主高亮元素：`bg-primary`，文字使用 `text-primary-foreground`
3. **极简扁平化单层导航 (Flat Structure Only)**：
   - 整个系统严禁使用任何二级折叠抽屉、可展开树形菜单或下拉子菜单。所有导航项必须在一级侧边栏平铺展开。

---

## 2. 全局骨架与布局规范 (Layout Architecture)

### 2.1 移除全局顶部 Header (No Top Navigation Bar)
- 全站不设顶部 Header，不设顶部常驻搜索条、不设面包屑栏，不设右上角头像下拉菜单。
- 页面主体直接从视窗顶部起始，第一层固定渲染页面头部信息：
  - 页面大标题：`text-2xl font-bold tracking-tight text-foreground`
  - 页面副说明：`text-sm text-muted-foreground mt-1 mb-6`
  - 目的：最大化纵向有效操作空间与信息密度。

### 2.2 流式宽屏自适应 (Fluid Full-Width Grid)
- **严禁限制主工作区宽度**：页面外层容器绝对禁止使用 `max-w-4xl`、`max-w-5xl`、`max-w-6xl` 或带 `mx-auto` 的居中定宽包裹。
- 主容器标准类名：
  ```tsx
  <main className="w-full min-h-screen px-6 py-6 2xl:px-10">
    {/* 业务内容 */}
  </main>
  ```
- **全局栅格断点标准**：
  - 指标卡片行：`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`
  - 混合内容与图表排版：统一基于 12 列栅格系统 `grid grid-cols-1 lg:grid-cols-12 gap-4`（通常采用 8:4 或等分 6:6 划分）。

### 2.3 侧边栏规范 (Sidebar Standard)
- **品牌展示区 (Header)**：左上角仅使用加粗大写的纯文本 Logo（字号 `text-base font-bold tracking-wider`），不使用任何装饰性 SVG 图标。
- **导航项排版 (Nav Item)**：
  - 结构：`[Lucide 图标 (size=16)] + [功能名称] + [右侧等宽数字 Badge (可选)]`
  - 悬浮态：`text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors`
  - 激活态：`bg-secondary text-secondary-foreground font-medium`
- **底部沉底工具区 (Footer Dock)**：
  - 移除业务重启等逻辑，仅保留全站级配置。
  - 水平集成 **多语言切换器 (DropdownMenu)** 与 **主题切换器 (Toggle Theme)**。

---

## 3. 全局通用组件与场景约束 (Component Usage Guidelines)

全站所有功能页面的开发，必须严格依据以下场景约定使用对应组件：

### 3.1 概览指标组件 (Metrics & Statistics)
- **使用场景**：任何需要汇总数据、展示 KPI、展示即时状态的板块顶部。
- **唯一指定组件**：`Card`, `CardHeader`, `CardTitle`, `CardContent`
- **设计范式**：
  - 采用统一的三段式垂直结构：
    1. 顶部：全大写的小号语义标签（`text-xs font-medium text-muted-foreground`）+ 彩色小图标点缀。
    2. 中间：大号粗体核心数值（`text-3xl font-bold tracking-tight text-foreground`）。
    3. 底部：次级说明文字、环比波动 Badge 或右箭头跳转链接（`text-xs text-muted-foreground flex items-center`）。

### 3.2 数据图表系统 (Data Visualization)
- **使用场景**：趋势分析、资源占比、时延监控、吞吐量统计。
- **唯一指定组件**：基于官方推荐的 `recharts` 或 `shadcn/ui Charts` 原语组件体系封装。
- **图表类型与场景绑定**：
  - **时序与趋势分析**：强制使用 **面积堆叠图 (`AreaChart`)**，用于展现用量随时间维度的涨跌波动。
  - **对比与分类统计**：强制使用 **柱状图 (`BarChart`)** 或 **横向条形图**，用于展现模型、实例或接口的排行。
  - **占比与份额分布**：强制使用 **环形饼图 (`PieChart` with innerRadius / Donut)**，用于展现协议、来源或错误类型的占比。
- **全局图表样式约束**：
  - 坐标轴（X/Y Axis）文字使用 `fill-muted-foreground text-[10px]`。
  - 网格分割线（CartesianGrid）必须使用极细微暗色描边：`stroke="hsl(var(--border))"`，严禁使用鲜艳网格线。
  - 浮层提示（Tooltip）必须封装为系统内置的卡片样式（`bg-card border-border shadow-md rounded-lg text-xs`），禁止使用浏览器默认提示条。

### 3.3 数据列表与表格 (Data Tables)
- **使用场景**：明细数据展示、事件审计、请求日志、资源配置清单。
- **唯一指定组件**：结合 `@tanstack/react-table` 的 `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell`。
- **规范要求**：
  - 统一继承表格行悬浮高亮（`hover:bg-muted/50`）。
  - ID、哈希值、代码段必须使用等宽字体（`font-mono text-xs`）。
  - 状态展示必须统一采用 `Badge`，严禁使用纯文字描述状态。
  - 表格底部统一配备紧凑型分页器与每页条数选择器。

### 3.4 状态标识与轻量标签 (Badges)
- **使用场景**：任务状态、节点可用性、协议标识、计数器。
- **唯一指定组件**：`Badge`
- **规范要求**：
  - 默认使用 `variant="outline"` 保证清爽度。
  - 状态类型采用内部嵌入 6px 圆点指示：
    - 正常 / 成功：`bg-emerald-500`
    - 异常 / 危险：`bg-rose-500`
    - 警告 / 处理中：`bg-amber-500 animate-pulse`
    - 离线 / 休眠：`bg-zinc-500`

### 3.5 数据录入与表单 (Forms & Inputs)
- **使用场景**：参数编辑、配置新增、凭证管理。
- **唯一指定组件**：`Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`, `Input`, `Select`, `Switch`, `Textarea`。
- **规范要求**：
  - 必须使用 `react-hook-form` 配合 `zod` 进行模式校验。
  - 所有的输入框、选择框统一使用系统默认的边框与聚焦环（`focus-visible:ring-ring`）。
  - 布尔开关一律使用 `Switch`，禁止使用原生复选框。

### 3.6 抽屉与弹出层 (Drawers, Sheets & Modals)
- **使用场景**：
  - 详细审计、控制台输出、实时日志：强制使用右侧滑出的 **`Sheet`** 抽屉组件，内部背景统一为纯黑终端风格（`bg-zinc-950 font-mono text-xs text-zinc-300 p-4 rounded-lg overflow-y-auto`）。
  - 人工干预确认、删除阻断操作、新建表单：使用居中弹出的 **`Dialog`** 或 **`AlertDialog`**。

---

## 4. 全局多语言 (i18n) 与文案规范

1. **默认语言**：全站默认语言为**简体中文 (zh-CN)**，必须支持运行时无缝切换为英文 (en-US)。
2. **零硬编码 (No Hardcoded Strings)**：
   - 所有页面大标题、副描述、菜单名、指标卡标签、图表 Tooltip 提示词、表格表头及操作按钮，严禁直接在 JSX 中写死文字。
   - 必须通过全局字典对象或 `useTranslation` 统一管理。
3. **持久化**：语言偏好必须持久化写入 `localStorage`，切换时无需刷新整个单页应用。