# Chart Rules

## Current Stack

- Library：`recharts@3.10.1`。
- Source：`src/App.tsx`、`src/pages/Agents.tsx`、`src/pages/Metrics.tsx`。
- shadcn chart adapter：当前不存在 `src/components/ui/chart.tsx`，也没有 `ChartContainer`、`ChartConfig`、`ChartTooltipContent`。
- Official reference checked：shadcn/ui Chart 文档说明其底层仍是 Recharts，并建议用 `ChartContainer` 提供稳定高度、用 semantic CSS variables 主题化；这可以作为后续新增 Chart adapter 的参考，不代表当前项目已经安装了该组件。

## Existing Examples

| Page | Chart | Source | Container size | Data |
| --- | --- | --- | --- | --- |
| Overview | `AreaChart` | `src/App.tsx` | `.overview-chart-main` 280px desktop / 240px mobile | prompt/completion token trend |
| Overview | `PieChart` | `src/App.tsx` | `.overview-chart-donut` 192px | model distribution |
| Overview | vertical `BarChart` | `src/App.tsx` | `.overview-chart-bars` 216px desktop / 192px mobile | Agent requests |
| Agents | vertical `BarChart` | `src/pages/Agents.tsx` | `h-[150px]` | executor sessions |
| Metrics | `AreaChart` | `src/pages/Metrics.tsx` | `h-[290px]` | trend by 1h/24h/7d/30d |
| Metrics | `PieChart` | `src/pages/Metrics.tsx` | `h-[220px]` | model distribution |

当前图表都使用 `ResponsiveContainer width="100%" height="100%"`，因此父级必须给出明确 height。不能把 height 删除后期待 ResponsiveContainer 自动测量。

## Token 与颜色

图表序列只能使用 `hsl(var(--chart-1))` 至 `hsl(var(--chart-5))`（Recharts 当前代码形式）或项目后续 adapter 规定的 `var(--chart-*)` 形式。网格、轴和文字使用 `border`/`muted-foreground`；这些是结构色，不是数据序列色。

当前重复的 Tooltip 样式为 `backgroundColor: hsl(var(--card))`、`borderColor: hsl(var(--border))`、`borderRadius: var(--radius)`。新增图表要保持亮暗主题可读，不写固定白色背景或任意 hex。

## Composition Rules

- 图表必须放在 `Card` 内，Card 的表面和 inset 遵守 `COMPONENT_RULES.md`。
- 图表外层 `min-w-0 w-full`，父级 Grid 使用 `minmax(0, 1fr)` 语义。
- Area/Bar/Pie 的数据标签、Tooltip、图例使用 i18n 文案；不要在 chart config 中散落业务显示文案。
- Area/Bar radius、stroke width、legend 字号保持同一类图表一致；业务差异通过数据和 token 表达。
- Recharts direct composition 是当前事实。只有当多个页面继续重复 Tooltip、legend、axis 结构时，才考虑新增最小 `src/components/ui/chart.tsx` adapter，并先核对官方 shadcn API。

## Loading、Empty、Error、Dark Mode

当前所有图表均为同步 Mock 数据，没有 Skeleton、空数据 fallback 或错误状态。新接入异步 API 的图表必须在图表区域提供：

1. 与图表最终尺寸一致的 Skeleton/loading 状态。
2. 数据为空时的简洁 empty 状态，不渲染空坐标轴。
3. 请求失败时的 inline error 和 retry action，不用静默空白。
4. 暗色主题下使用 `card`、`border`、`muted-foreground` 和 chart tokens 验证对比度。

## Chart Technical Debt

- 三个页面重复维护 Recharts Tooltip、轴和颜色内联对象。Priority P1。
- 缺少统一 `ChartContainer`/config 约定，新增图表容易产生不同高度和 tooltip 皮肤。Priority P1。
- 当前图表数据与 Mock 页面耦合，真实 API 接入前需要独立 response type/transform。Priority P2。
- 没有 loading/empty/error 图表状态。Priority P1。
