# Page Patterns

以下 Pattern 只来自当前源码，不是预先套用的后台模板。

## Overview / Control Plane Overview

- Reference：`src/App.tsx` 的 `Overview`。
- Entry：`/`，由 `AppShell` 的 active `overview` 分支渲染。
- Structure：Page Header -> 4 个 clickable metric Card -> Token trend/model distribution -> Agent request/relay health -> Agent registry/recent activity。
- Components：`Card`、`Button`、`MetricCard`、Recharts `AreaChart`/`PieChart`/`BarChart`、semantic status dots。
- Spacing：根节点 `space-y-6`；主要 Grid `gap-4`；Overview 图表高度由 `src/App.css` 控制。
- Responsive：默认单列；`sm` 指标变两列；`xl` 使用 12 列 8/4、7/5 和 2 列组合。
- Notes：Overview 当前独立在 `App.tsx`，没有单独 `src/pages/Overview.tsx`。新增总览区块应保留 App Shell 边界，不要再加 page-level padding。

## Agents / Execution Management

- Reference：`src/pages/Agents.tsx`。
- Entry：`/agents`。
- Structure：Page Header + Mount action -> 4 KPI Cards -> supported executor Cards -> 8/4 实例表与 distribution/profile -> recent activity -> logs Dialog。
- Components：`Card`、`Button`、`Badge`、`Table`、`Dialog`、Recharts vertical BarChart、Lucide actions。
- Spacing：页面根节点 `space-y-6 py-6`；KPI `gap-4`；executor cards `gap-3` 和 `p-4`；主要 Card `p-5`。
- Responsive：KPI `sm:grid-cols-2 xl:grid-cols-4`；executor `md:grid-cols-2 xl:grid-cols-4`；主区 `xl:grid-cols-12`；表格 overflow-x-auto。
- State：实例数组、选中 executor、日志 Dialog 为局部 state；Add 会增加 idle instance；Stop 当前直接移除实例。
- Notes：executor Card 使用 `role="button"` + tabIndex + keydown；它是已有交互，不应继续复制到新的普通 div 交互。

## Routes / Upstream Management

- Reference：`src/pages/Routes.tsx`。
- Entry：`/routes`。
- Structure：Page Header + Add action -> LiteLLM/providers/failover KPI Cards -> provider Card grid -> failover chain Card -> add provider Dialog。
- Components：`Card`、`Button`、`Badge`、`Switch`、`Input`、`Dialog`、Lucide status/action icons。
- Spacing：页面根节点 `space-y-6`；KPI `gap-4`；Provider grid `lg:grid-cols-3 gap-3`；Provider Card 主要为 `p-5`，内部字段常用 `mt-5`。
- Responsive：Header action 在小屏 full width；KPI 手机单列、`md` 三列；Provider `lg` 三列；Failover chain 允许 wrap。
- State：provider list、enable/disable、Dialog、name/url 表单为局部 state。
- Notes：新增 Provider 使用同一 `Card`，不要因为有 enabled/disabled 就创建另一种 Card。状态使用 Switch + Badge。

## Metrics / Observability

- Reference：`src/pages/Metrics.tsx`。
- Entry：`/metrics`。
- Structure：Page Header + time range segmented actions + refresh -> 4 metric Cards -> 8/4 trend/distribution Cards -> traces Table with filter。
- Components：`Card`、`Button`、`Badge`、`Input`、`Table`、Recharts Area/Pie chart、Lucide。
- Spacing：页面根节点 `space-y-6 py-6`；Metric grid `sm:grid-cols-2 xl:grid-cols-4`；chart grid `xl:grid-cols-12`；Trace Card header `p-5`。
- Responsive：Header controls wrap；chart 单列；distribution legend 在小屏两列、xl 单列；Trace table overflow-x-auto。
- State：query、refreshing、range 为局部 state；trend 数据按 range 切换；filtered traces 用 `useMemo`。
- Notes：Metrics 自己重复定义了一个 `MetricCard`，且标题结构不同于 Overview；需要作为共享业务模式治理，但不在本轮文档任务中重构。

## Shared Pattern Rules

- 新页面先选择最接近的 Pattern，再组合现有 primitives。
- 页面模块默认 24px 纵向间距，Grid 默认 16px；不要根据官方 Demo 另造宽度或 spacing。
- Card 外观始终来自同一个 primitive。信息类型可变，表面规则不变。
- 页面标题必须只有一个 h1；subtitle 紧跟其后；操作区允许随 breakpoint 换行。
- 数据表使用项目 `Table`，图表使用当前 Recharts stack，状态使用 Badge/semantic dot。

## Pattern Technical Debt

- 没有独立共享 PageHeader/MetricCard/SectionHeader，导致四个 Pattern 手写相似 JSX。Priority P1。
- 三个页面根节点重复设置 `py-6`，Overview 组合不同。Priority P1。
- Overview 和业务页面的文案、Mock 类型散落在组件文件，没有统一 data/service 层。Priority P2。
