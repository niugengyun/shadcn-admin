# 全局前端架构与设计系统开发规范 (DESIGN_SYSTEM.md)

本文档定义了本项目在 UI/UX 架构、设计语言、组件选型及布局约束上的全局通用规范。所有页面开发及 AI 编程助手必须无条件遵循本规范，确保系统在视觉、交互与工程质量上保持绝对一致。

---

## 1. 核心设计原则 (Design Principles)

1. **全面复用官方内置原语 (Zero Redundancy)**：
   - 严禁手写 HTML 原生基础标签（如原生 `<button>`, `<input>`, `<table>`, 自写带边框的 `div` 假冒卡片）。
   - 所有基础组件统一从项目内置的 `@/components/ui/*` 导入。
   - 项目环境已配置 **shadcn MCP**。缺少组件时，必须优先通过 MCP 工具拉取官方标准原语，严禁造轮子。
2. **严格继承官方 Zinc 默认黑白配色 (Official Monochrome)**：
   - 严禁在 CSS/Tailwind 中手动覆写全局色盘，严禁引入偏蓝、偏紫或自定义十六进制色值（如 `#000000`）。
   - 全局严格使用 Semantic Tokens：
     - 全局背景基底：`bg-background`（纯净深黑）
     - 内容卡片背景：`bg-card`，文字使用 `text-card-foreground`
     - 边框与分割线：`border-border`
     - 次级/悬浮背景：`bg-secondary` / `bg-muted`
     - 主高亮元素：`bg-primary`，文字使用 `text-primary-foreground`
3. **极简扁平化单层导航 (Flat Structure Only)**：
   - 整个系统严禁使用任何二级折叠抽屉、展开式树形菜单或下拉子路由。所有导航项必须在一级侧边栏平铺展开。

---

## 2. 全局骨架与布局规范 (Layout Architecture)

### 2.1 移除全局顶部 Header (No Top Navigation Bar)
- 全站不设顶部 Header，不设顶部常驻搜索条、不设面包屑栏，不设右上角头像下拉菜单。
- 页面主体直接从视窗顶部起始，第一层固定渲染页面头部信息：
  - 页面大标题：`text-2xl font-bold tracking-tight text-foreground`
  - 页面副说明：`text-sm text-muted-foreground mt-1 mb-6`
  - 目的：最大化纵向有效操作空间与信息密度。

### 2.2 流式宽屏自适应与表面对比度 (Fluid Layout & Elevation)
- **禁止定宽限死**：主容器绝对禁止使用 `max-w-4xl`、`max-w-5xl`、`max-w-7xl` 或带 `mx-auto` 的居中定宽包裹。统一采用全宽流式布局：
  ```tsx
  <main className="w-full min-h-screen px-6 py-6 2xl:px-10 bg-background text-foreground space-y-6">
    {/* 业务内容 */}
  </main>
  ```
- **表面实体层级铁律 (Elevation Token)**：
  - 卡片**严禁使用纯透明背景**或与底色同级的纯黑。
  - 所有卡片容器必须使用：`bg-card text-card-foreground border border-border rounded-lg shadow-sm`，与 `bg-background` 形成明确的物理表面分层。

### 2.3 侧边栏规范 (Sidebar Standard)
- **物理边界隔离**：侧边栏右侧必须显式声明右边框：`border-r border-border bg-sidebar`，严禁与主工作区无缝混为一体。
- **品牌展示区 (Header)**：左上角仅使用加粗大写的纯文本 Logo（字号 `text-base font-bold tracking-wider`），不放装饰性 SVG。
- **导航项排版 (Nav Item)**：
  - 结构：`[Lucide 图标 (size=16)] + [功能名称] + [右侧等宽数字 Badge (可选)]`
  - 默认态：`text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors`
  - 激活态：`bg-secondary text-secondary-foreground font-medium`
- **底部沉底工具区 (Footer Dock)**：
  - 移除业务重启等逻辑，仅保留对称的双纯图标按钮（语言切换 Tooltip + 主题切换 Tooltip），底部附带小号版本号与运行健康指示点。

---

## 3. 全局通用组件与场景约束 (Component Usage Guidelines)

### 3.1 概览指标组件 (Metrics & Statistics)
- **唯一指定组件**：`Card`, `CardHeader`, `CardTitle`, `CardContent`
- **三段式标准结构**：
  1. 顶部：全大写语义标签（`text-xs font-medium text-muted-foreground`）+ 彩色小图标点缀。
  2. 中间：大号粗体核心数值（`text-3xl font-bold tracking-tight text-foreground font-mono`）。
  3. 底部：次级说明文字、环比波动 Badge 或右箭头跳转链接。

### 3.2 数据图表系统 (Data Visualization)
- **唯一指定组件**：基于 `recharts` 原生或 `@/components/ui/chart` 体系。
- **图表容器高度绝对约束铁律（防止 0px 塌陷黑屏）**：
  - 严禁在未显式声明高度的容器中直接使用 `<ResponsiveContainer height="100%">`。
  - 放置图表的包裹层必须明确指定固定像素高度类名（如 `h-[280px]` 或 `h-[320px]`）：
    ```tsx
    <div className="h-[280px] w-full">
      <ResponsiveContainer height="100%" width="100%">
        {/* 图表内容 */}
      </ResponsiveContainer>
    </div>
    ```
- **图表类型与场景绑定**：
  - 时序波动：堆叠面积图（`AreaChart`，Prompt 为浅色高亮，Completion 为暗灰渐变）。
  - 分类统计/排行：横向柱状图（`BarChart`）或紧凑进度条。
  - 占比分布：环形饼图（`PieChart` with `innerRadius`）。
- **坐标轴与提示卡**：
  - 坐标轴字体统一为 `fontSize={10} fill="hsl(var(--muted-foreground))"`。
  - 网格线统一为 `stroke="hsl(var(--border))" strokeDasharray="3 3"`。
  - Tooltip 必须继承卡片样式：`backgroundColor: hsl(var(--card))`, `borderColor: hsl(var(--border))`。

### 3.3 数据列表与表格 (Data Tables)
- **唯一指定组件**：结合 `@tanstack/react-table` 的 `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell`。
- **等宽字体约束**：所有 `Trace ID`、`Time`、`Token 数量`、`Latency (延迟)` 必须强制添加 `font-mono text-xs` 类名。
- **状态标识**：状态统一采用 `Badge variant="outline"`，内嵌 6px 彩色圆点指示（成功绿点、限流红点、排队黄点）。

### 3.4 抽屉与弹出层 (Drawers & Modals)
- **终端与事件流**：实时日志、SSE 事件流、代码 Diff 强制使用右侧滑出的 `Sheet`，内部背景固定为终端风格：`bg-zinc-950 font-mono text-xs text-zinc-300 p-4 rounded-lg`。
- **确认与表单**：使用居中弹出的 `Dialog` 或 `AlertDialog`。

---

## 4. 全局多语言 (i18n) 规范

1. **默认语言**：全站默认语言为**简体中文 (zh-CN)**，必须支持运行时切换为英文 (en-US)。
2. **零硬编码**：所有标题、描述、指标标签、图例文本、表格表头，严禁在 JSX 中硬编码中英文字符，统一提取至 i18n 字典。
3. **数据持久化**：语言与主题配置均保存在 `localStorage` 中。