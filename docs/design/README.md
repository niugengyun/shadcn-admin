# UI 规范入口

本目录记录 AgentGateway Control Plane 当前源码已经形成的 UI 架构、视觉 token、页面组合和交互约束。它不是一套脱离代码的通用 React 模板：所有路径、组件和当前实现都以本仓库源码为证据。

## 当前架构概览

- 构建层：Vite 8 + `@vitejs/plugin-react` + Tailwind CSS v4 Vite plugin。
- 应用层：`src/main.tsx` 挂载 `src/App.tsx`；`App.tsx` 同时承载自定义 History 路由、Top Nav、Sidebar、Content 和 Overview。
- 页面层：`src/pages/Agents.tsx`、`src/pages/Routes.tsx`、`src/pages/Metrics.tsx`。
- UI 层：`src/components/ui/` 下的 Button、Card、Badge、Input、Table、Dialog、DropdownMenu、Switch。
- 状态层：页面局部 `useState`/`useMemo`/`useEffect`，主题使用 `next-themes`，语言使用 `src/i18n.tsx` Context；没有第三方全局 store。
- 数据层：页面内 Mock 常量；`src/services/http.ts` 提供 `fetch` 基础封装，但当前页面未连接真实 API。
- 图表层：Recharts 3.10 直接组合，当前没有本地 `ChartContainer` 或 `src/components/ui/chart.tsx`。

## 文档关系

| 文档 | 作用 |
| --- | --- |
| `DESIGN_SYSTEM.md` | 记录颜色、字体、圆角、阴影、间距和 Card 等视觉基础；区分当前实现与 canonical 规则。 |
| `LAYOUT_RULES.md` | 记录 App Shell、Sidebar、Top Nav、Main Content、页面标题和响应式边界。 |
| `COMPONENT_RULES.md` | 记录 `src/components/ui/` 和业务页面组件 inventory，以及各组件的推荐使用方式。 |
| `CHART_RULES.md` | 记录 Recharts 图表、token、容器尺寸和当前图表实例。 |
| `ICON_RULES.md` | 记录 Lucide 图标族、尺寸、语义和例外。 |
| `PAGE_PATTERNS.md` | 从当前页面源码归纳 Overview、Agents、Routes、Metrics 四类页面 Pattern。 |
| `UX_RULES.md` | 记录 loading、empty、error、dialog、form、destructive action 等当前实现和缺口。 |
| `AI_UI_RULES.md` | AI 修改 UI 时的执行顺序、复用优先级、禁止事项和验收清单。 |

## Agent 阅读顺序

1. 根目录 `AGENTS.md`
2. `AI_UI_RULES.md`
3. `DESIGN_SYSTEM.md`
4. `LAYOUT_RULES.md`
5. `COMPONENT_RULES.md`
6. `PAGE_PATTERNS.md`
7. 按任务追加 `CHART_RULES.md`、`ICON_RULES.md` 或 `UX_RULES.md`

## 按任务追加阅读

- 调整页面框架、边距、侧栏、顶部导航：`LAYOUT_RULES.md`、`DESIGN_SYSTEM.md`
- 新增或修改 Card、Button、Table、Dialog、Input：`COMPONENT_RULES.md`、`UX_RULES.md`
- 新增或修改图表：`CHART_RULES.md`、`DESIGN_SYSTEM.md`
- 修改图标：`ICON_RULES.md`
- 新增页面：`PAGE_PATTERNS.md`、`LAYOUT_RULES.md`、`COMPONENT_RULES.md`
- 修改加载、空态、错误、刷新或破坏性操作：`UX_RULES.md`

## 一致性原则

同名组件必须有同一套基础外观和行为。业务页面可以通过 Grid/Flex 改变 Card 的位置、内容结构和信息密度，但不能通过页面 class 重新定义 Card 的背景、边框、圆角、阴影、焦点或交互逻辑。当前 Card primitive 已统一根样式，但页面仍有 `p-4` 与 `p-5` 两种内容内边距；这被明确记录为待治理债务，而不被当作已完成的标准化。
