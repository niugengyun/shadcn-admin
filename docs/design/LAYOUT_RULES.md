# Layout Rules

## App Shell

真实实现位于 `src/App.tsx` 的 `AppShell` 和 `src/App.css`：

```text
.app-shell
├── TopNav
├── Sidebar
├── sidebar-overlay (mobile open 时)
└── main.main-content
    └── Overview | Metrics | Agents | Routes
```

桌面端 `.app-shell` 是两列两行 Grid：第一行为 60px Top Nav，第二行为剩余高度；默认 Sidebar 256px，Content 使用 `minmax(0, 1fr)`。900px 以下 Sidebar 缩为 208px。折叠态通过根节点 `.sidebar-collapsed` 改为 72px 左列，Top Nav 的品牌列同步变化。

手机端（CSS `max-width: 640px`）App Shell 改为 block，Top Nav 高 60px 并 sticky；Sidebar 变为从左侧进入的 fixed drawer，宽度 `min(18rem, 85vw)`，通过 `.sidebar-overlay` 关闭。

## Top Nav

Top Nav 的真实结构和交互在 `src/App.tsx` 的 `TopNav`：品牌、移动端菜单、Sidebar 折叠、搜索、语言切换、主题切换、用户 Dropdown。

- `.top-nav` 和 Sidebar 共享 16rem/13rem 的桌面列宽。
- `.top-nav-tools` 右侧 padding 使用 `clamp(1rem, 4vw, 3rem)`，与 Main Content 的横向边界一致。
- 搜索框宽度为 `min(18rem, 32vw)`，最小 8rem；移动端变为剩余宽度。
- 右侧操作使用 `gap: 0.5rem`；用户菜单由 `DropdownMenu` primitive 承载。
- 移动端隐藏品牌文字、语言/主题按钮和用户文字，只保留菜单、搜索和用户图标。

不要在页面或新 Header 中重复创建另一套右边距。新增 Top Nav 操作必须确认不会挤压搜索框和用户菜单。

## Sidebar 与 Navigation

Sidebar 由 `src/App.tsx` 的 `Sidebar` 和 `src/App.css` 实现。导航数据 `navItems`、ID 类型 `NavId`、路径映射 `pathToNavId`/`navIdToPath` 都位于 `src/App.tsx`。

- 当前路径：`/`、`/agents`、`/routes`、`/metrics`。
- 导航使用原生 `<a>` 保留 URL 语义，再由 `pushState` 管理单页切换。
- nav item 高度 40px、左右 padding 12px、gap 12px、图标通常 17px。
- active/hover 使用 `sidebar-accent` 和 `sidebar-accent-foreground`。
- 折叠态只保留图标，桌面状态保存于 `localStorage` 的 `agent-sidebar-collapsed`。

不要为单页功能再引入 Router；除非产品明确要求，保持当前 History 路由实现。

## Main Content（核心约束）

真实实现为 `src/App.css` 的 `.main-content`，是所有页面横向边界的唯一来源：

- Grid 位置：`grid-column: 2; grid-row: 2`。
- `min-width: 0`，防止子级 Grid/Flex 将 Content 撑出视口。
- `overflow: auto`，页面内滚动发生在 Content 区域。
- 桌面 padding：`2rem clamp(1rem, 4vw, 3rem)`，即上/下 32px，左右随视口在 16px 到 48px 之间变化。
- 手机 padding：`1.25rem 1rem 2rem`，即上 20px、左右 16px、下 32px。
- 没有页面级 `max-width`；Content 使用剩余宽度。

页面组件当前使用 `<main>` 作为自己的根节点，导致 `main-content` 内存在嵌套 `<main>`；新页面应使用 `<div>` 或内容语义 section，避免继续扩大该语义债务。页面根节点不应添加新的横向 `px-*`、`padding-inline`、`mx-auto`、固定 width 或 max-width。

## Page Header

当前页面 Header 都由页面文件内联组合：

- Overview：`src/App.tsx`，`border-b border-border pb-6`，h1 为 3xl。
- Agents：`src/pages/Agents.tsx`，同样带 control plane eyebrow、底部线和右侧 Mount Button。
- Routes：`src/pages/Routes.tsx`，同样带 eyebrow、底部线和 Add Button。
- Metrics：`src/pages/Metrics.tsx`，无底部线和 eyebrow，h1 为 2xl，右侧为 range control + refresh icon。

推荐的后续 canonical Page Header：唯一 `h1` + 紧邻 subtitle + 可选 action；页面标题区到底部第一个模块 24px；不要重复显示路由名、面包屑和小标题。现状差异先记入技术债，不在文档任务中大范围重构。

## Grids 与 Width

- 页面模块普遍使用 `grid grid-cols-1`，桌面在 `sm`、`md`、`lg` 或 `xl` 增列。
- 12 列模块使用 `xl:grid-cols-12`，Overview 常见 `xl:col-span-8/4`、`7/5`；Agents 实例表使用 `8/4`；Metrics 趋势图使用 `8/4`。
- 所有可能收缩的 Grid/卡片都应有 `min-w-0`；长 URL、模型名、任务名使用 `truncate`。
- 表格外层使用 `overflow-x-auto`；不要把固定宽度加在页面根节点。
- 当前 CSS App Shell breakpoint 是 900px/640px，而 Tailwind 业务类使用默认 `sm=640`、`md=768`、`lg=1024`、`xl=1280`。新增规则尽量采用默认 Tailwind breakpoint，并记录需要与壳层 breakpoint 对齐的情况。

## 页面 Pattern 的默认间距

- 页面模块：`space-y-6` / 24px。
- 常规 Grid：`gap-4` / 16px。
- 密集卡片 Grid：`gap-3` / 12px，仅在 Agents executor 等明确密度场景使用。
- Card 标准 inset：20px / `p-5`，见 `DESIGN_SYSTEM.md` 的 Card 统一规则。
- Card 头部内部：常见 `gap-3`，标题到说明 `mt-1`。
- 列表项：常见 `py-3`，分隔线使用 `divide-y divide-border` 或 `border-*`。

## Responsive Acceptance

至少验证 390px、768px、1440px：

1. 页面无横向滚动，除明确允许的表格横向滚动。
2. Header 操作不遮挡搜索和用户菜单。
3. 侧栏抽屉、遮罩、关闭和 active 状态正常。
4. 12 列 Grid 能在手机单列折叠，Card 内文字不溢出。
5. 图表父容器有稳定 height/min-height，Recharts 能完成首次测量。
6. 亮色和暗色模式没有白色异常边框或低对比文字。

## Layout Technical Debt

- 三个业务页面都在 `.main-content` 内再次使用 `py-6`，而 Overview 没有；页面纵向起始边界不完全一致。Priority P1。
- Page Header 组合有两套。Priority P1。
- App Shell 使用 900px breakpoint，但业务 Tailwind 使用 1024px 的 `lg`，在 900-1023px 区间可能出现布局意图不一致。Priority P2。
- 页面根节点嵌套 `<main>`。Priority P2。
