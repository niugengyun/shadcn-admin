# Component Rules

## Component Layers

当前组件不能按“所有 components 都一样”理解，应按以下层级使用：

1. Primitive：`src/components/ui/` 中维护的基础组件和 Radix adapter。
2. Shared shell：`src/App.tsx` 中的 TopNav、Sidebar、MetricCard 等跨页面/壳层组合。
3. Business page composition：`src/pages/` 中的 Agent、Provider、Trace、图表和页面指标组合。
4. Data/service：`src/services/http.ts` 和页面内 Mock 类型/常量。

## UI Inventory

| Name | Path | Category | Purpose / Source | Reusable / Used by | Recommended usage | Do not use when |
| --- | --- | --- | --- | --- | --- | --- |
| `Button` | `src/components/ui/button.tsx` | shadcn/ui primitive | CVA + native button；default/secondary/outline/ghost/link/destructive，default/sm/lg/icon | 全局；App 与三页 | 先选 `variant`/`size`，再添加布局 class；显式 `type` | 不要用普通 button + 自定义背景复制 Button |
| `Card` | `src/components/ui/card.tsx` | shadcn/ui primitive | `rounded-xl border bg-card shadow-sm` 的表面容器 | App 与三页 | 所有卡片唯一入口；标准内容 inset 20px | 不要用 `article`、`.panel` 或另一个 `metric-card` 复制外观 |
| `CardHeader/Title/Content` | `src/components/ui/card.tsx` | shadcn/ui composition | Card 内部结构 helper | 当前页面尚未使用，primitive 已提供 | 复杂 Card 优先用组合 helper，保持标题/内容层级 | 不要用它们重写 Card 根样式 |
| `Badge` | `src/components/ui/badge.tsx` | shadcn/ui primitive | default/secondary/destructive/outline 状态标签 | Agents、Routes、Metrics | 状态、角色和短分类；状态点使用 semantic token | 不要用 Badge 承载长文本或当作按钮 |
| `Input` | `src/components/ui/input.tsx` | shadcn/ui primitive | 统一 h-9、border/input、focus ring 输入框 | App 搜索、Routes Dialog、Metrics 筛选 | 受控值配合 label/aria-label | 不要页面手写 input 皮肤 |
| `Table*` | `src/components/ui/table.tsx` | shadcn/ui primitive | Table、Header、Body、Row、Head、Cell | Agents、Metrics | 外层 `overflow-x-auto`，列内容使用 truncate/min-width 策略 | 不要为单页重新造 table row/header 样式 |
| `Dialog/DialogContent` | `src/components/ui/dialog.tsx` | Radix adapter | Portal、Overlay、Content、Escape/focus 行为 | Agents 日志、Routes 添加 Provider | 通过 Root 控制 open；保留 primitive 键盘和焦点行为 | 不要手写 absolute modal 或遮罩 |
| `DropdownMenu*` | `src/components/ui/dropdown-menu.tsx` | Radix adapter | Portal menu、focus、keyboard navigation | App 用户菜单 | 使用 Trigger + Content + Item 组合 | 不要手写 absolute dropdown |
| `Switch` | `src/components/ui/switch.tsx` | Radix adapter | checked/onCheckedChange 状态开关 | Routes Provider 启停 | 使用标准 `checked`/`onCheckedChange`，提供 aria-label | 不要用 checkbox 或 role 模拟 switch |
| `MetricCard` | `src/App.tsx`、`src/pages/Metrics.tsx` | business/shared composition | 指标标签、值、变化/跳转说明 | Overview、Metrics | 应归并为一个共享业务模式，再由 props 表达可点击/变化方向 | 不要继续在新页面复制同名函数 |
| Overview chart sections | `src/App.tsx` | business composition | Token 趋势、模型分布、Agent 请求、Relay 健康 | Overview | 使用 Recharts + chart token + stable height | 不要把图表颜色写成任意色盘 |
| Agent cards/table/profile | `src/pages/Agents.tsx` | business composition | Harness 类型、实例、分布、运行配置 | Agents | 复用 Card/Table/Badge/Button/Dialog | 不要把业务状态下沉为新 primitive |
| Provider cards/failover form | `src/pages/Routes.tsx` | business composition | LLM 上游节点和故障转移 | Routes | 复用 Card/Switch/Badge/Dialog/Input | 不要为 Provider 另造卡片系统 |
| Metrics dashboard | `src/pages/Metrics.tsx` | business composition | 指标、趋势、分布、Trace 表 | Metrics | 复用 Card/Table/Badge/Button/Input | 不要引入新 chart/table library |

## Card Canonical Usage

同类 Card 样式必须一致，内容结构可以不同：

```tsx
<Card className="min-w-0 p-5">
  <div className="flex items-start justify-between gap-3">
    <div>
      <h2 className="font-semibold">Title</h2>
      <p className="mt-1 text-xs text-muted-foreground">Description</p>
    </div>
  </div>
  <div className="mt-4">Content</div>
</Card>
```

上例只表示当前页面组合中的 canonical inset 和内容层级；Card 的背景、border、radius、shadow 必须来自 `src/components/ui/card.tsx`，不能在页面中再次声明。表格容器可以不在根节点加 `p-5`，但 header/content 必须自行保持相同的 inset，并在 Pattern 中说明这是结构例外。

选中态、禁用态和可点击态只能添加语义状态，例如 `ring-ring`、`opacity-60`、`hover:bg-muted/50`；它们不应改变 Card 的基础表面。

## Component API Rules

- 所有 Button 明确 `type="button"` 或 `type="submit"`。
- icon-only Button 必须 `size="icon"`，并同时有 `aria-label` 和 `title`（已存在的 Toggle/Actions 模式如此）。
- 状态控件使用 Radix 标准事件：`checked/onCheckedChange`，而不是自定义 `role`。
- Dialog/Dropdown/Sheet 等浮层优先复用 Radix adapter 的 Portal、focus 和 Escape 行为。
- class 合并使用 `cn`；已有 variant 使用 CVA，不在页面复制 Button/Card variant。
- 可见文案必须通过 `useI18n`，新增中文和英文词条同时加入 `src/i18n.tsx`。

## Missing / Deferred Components

当前 `src/components/ui/` 没有 `Label`、`Skeleton`、`Toast/Sonner`、`Tooltip`、`Tabs`、`Popover`、`ChartContainer` 等组件。新增需求需要它们时，先确认官方 shadcn/ui 是否已有对应实现，再按项目 token 添加最小 adapter；不要在页面内手写长期复用的伪组件。

## Component Technical Debt

- `MetricCard` 在 `src/App.tsx` 和 `src/pages/Metrics.tsx` 重复定义，结构和行为不完全相同。Priority P1。
- Card helpers 已存在但页面全部手写内部结构；长期可考虑统一 `CardHeader/CardTitle/CardContent` 使用。Priority P2。
- Dialog adapter 只有 `DialogContent`，缺少统一 `DialogTitle/Description/Close` 导出；当前页面通过 `aria-label` 处理标题语义，需在新增复杂 Dialog 前补齐确认。Priority P1。
- Agents 支持的 executor Card 用 `role="button"` 的 div；后续应评估使用语义按钮或可访问的 Toggle/selection primitive。Priority P2。
