# Icon Rules

## Library

项目唯一主要图标库是 `lucide-react@1.40.0`。App 和三个业务页面都从该库导入图标；没有发现第二套 Icon library。新增图标继续使用 Lucide，不要手写 SVG path，也不要引入新的图标库。

## Existing Usage

| 场景 | 当前来源 | 常见尺寸 | 规则 |
| --- | --- | --- | --- |
| Navigation | `src/App.tsx` 的 `navItems` | 17px，`strokeWidth={1.8}` | 只表达一级导航，保持同一族和同一 stroke |
| Top Nav action | `src/App.tsx` | 16px，菜单 18px | icon-only 必须 `Button size="icon"`、aria-label、title |
| Card/section marker | App 与页面 | 15-18px | 作为内容语义辅助，不单独替代标题 |
| Table action | `src/pages/Agents.tsx` | 15px | 使用 ghost icon Button，并提供 title/aria-label |
| Status | 页面 inline dot + Lucide Check/HeartPulse | 6-14px | 颜色使用 success/warning/destructive semantic token |
| Empty/feedback | 当前没有统一 empty primitive | - | 新增时先查官方 icon，再和 UX pattern 一起设计 |

## Current Mapping

- Overview：`LayoutDashboard`、`Bot`、`GitFork`、`BarChart3`、`Cpu`、`Activity`、`HeartPulse`。
- Navigation：Overview `LayoutDashboard`，Agents `Bot`，Routes `GitFork`，Metrics `BarChart3`。
- Agent executor：`Terminal`、`Code2`、`Cpu`、`HardDrive`。
- Routes：`Globe2`、`HeartPulse`、`ShieldAlert`、`GitFork`、`Plus`、`Check`、`X`。
- Metrics：`TrendingUp`、`Activity`、`Coins`、`Gauge`、`RefreshCw`、`Search`、趋势箭头。
- Shell：`Menu`、`PanelLeftClose`、`PanelLeftOpen`、`Search`、`Languages`、`Moon`/`Sun`、`UserCircle`、`ChevronDown`、`Settings`、`LogOut`。

不要因为同一语义在不同页面换用另一枚相近图标。新增语义先搜索现有 mapping，再选择最接近的 Lucide icon。

## Accessibility

- 装饰性图标使用 `aria-hidden="true"`。
- 只有图标的 Button 必须有可翻译的 `aria-label` 和 `title`。
- 带文字的 Button 中图标不重复朗读。
- 不要只用颜色或图标表达 running/failed/disabled；同时提供文字或可访问名称。
- `brand-mark` 当前是 `✣` 字符，不是 Lucide 图标；不要把它误认为项目统一图标组件。若以后替换品牌标记，需要产品/品牌确认。

## Icon Technical Debt

- `src/App.tsx` 中用户菜单、Top Nav 部分文案为硬编码英文，icon label 未完全走 i18n。Priority P1。
- 状态点大量在页面内用 `<span>` 重复实现，当前没有统一 StatusIndicator primitive。Priority P2；不要为了文档任务直接新增。
