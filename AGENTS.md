# Agent 开发约束

## Project Context

本项目是 AgentGateway Control Plane，一个面向 AI Agent 执行器、LLM 上游路由和 Token 可观测性的 React 管理后台脚手架。当前前端使用 Vite + React 19 + TypeScript + Tailwind CSS v4，组件采用本地维护的 shadcn/ui 风格实现，图标统一使用 `lucide-react`，图表直接使用 Recharts。

核心业务页面位于 `src/pages/Agents.tsx`、`src/pages/Routes.tsx` 和 `src/pages/Metrics.tsx`；总览页、路由切换和 Nav + Sidebar + Content 应用壳层位于 `src/App.tsx`。当前页面使用规范 Mock 数据，真实 HTTP 基础封装位于 `src/services/http.ts`。

## Source Structure

- 应用入口：`src/main.tsx`
- 应用壳层、导航和自定义路由：`src/App.tsx`
- 业务页面：`src/pages/`
- UI primitives：`src/components/ui/`
- class 合并工具：`src/lib/utils.ts`
- 国际化 Provider 和词典：`src/i18n.tsx`
- HTTP 基础客户端：`src/services/http.ts`
- 全局 token、Tailwind v4 映射和 reset：`src/index.css`
- 应用壳层布局 CSS：`src/App.css`
- 构建配置：`vite.config.ts`、`tsconfig*.json`、`package.json`

项目当前没有独立的 `app/`、`routes/`、`layouts/`、`features/`、`stores/`、`theme/` 或 `components/layout/` 目录，不要凭经验创建这些层级。

## Project Terminology

- Agent：可被控制平面发现、配置和运行的 AI 执行器。
- Harness：Agent 的运行实例/执行环境，当前实例数据和启停操作在 `src/pages/Agents.tsx`。
- Agent Gateway：管理本地终端、沙盒、容器执行器的页面模块。
- LLM Gateway：管理模型上游节点、优先级、健康状态和故障转移的页面模块。
- Relay / Provider / 上游节点：LLM Gateway 中的模型中转或直连节点，当前类型定义在 `src/pages/Routes.tsx`。
- Token Metrics / Token 审计：记录 Token、模型、节点、延迟和状态的观测页面，当前类型定义在 `src/pages/Metrics.tsx`。
- Control plane：当前管理后台本身，不等同于某个后端服务。

## UI Development Rules

- 修改 UI 前先读取 `docs/design/AI_UI_RULES.md` 及其要求的专项文档。
- 当前 Nav + Sidebar + Content 应用壳、Zinc 黑白主题、semantic tokens、字号、圆角和间距是基础设施，不得随意重设计。
- 同一个 UI 组件必须通过同一个 `src/components/ui/` primitive 承载，并保持相同的根样式、交互、焦点和状态行为。尤其是 `Card`：不得用 `article` 或页面自定义容器冒充 Card，也不得为不同页面复制第二套卡片皮肤。
- Card 的业务内容可以不同，网格位置和内部布局可以不同；背景、边框、圆角、阴影、默认内边距和交互状态必须遵守统一的 Card 规则。现有 `p-4/p-5` 差异已列为 UI Technical Debt，新代码使用规范中的 canonical Card 组合。
- 优先复用现有项目组件，其次使用官方 shadcn/ui 组合；不得引入第二套 UI、Icon 或 Chart library。
- 图表继续使用 Recharts 和 `--chart-1` 至 `--chart-5`；图标继续使用 `lucide-react`。
- 页面根节点不得重新设置横向 Content 边界；`.main-content` 是唯一的页面横向 padding 来源。
- 不删除既有路由、业务状态或交互流程；新增可见文案同时补充 `src/i18n.tsx` 的中英文词条。

## Mandatory UI Reading

修改 UI 前至少读取：

1. `docs/design/AI_UI_RULES.md`
2. `docs/design/DESIGN_SYSTEM.md`
3. `docs/design/LAYOUT_RULES.md`
4. `docs/design/COMPONENT_RULES.md`
5. `docs/design/PAGE_PATTERNS.md`

涉及 Chart、Icon 或异步/交互状态时，分别追加读取 `CHART_RULES.md`、`ICON_RULES.md`、`UX_RULES.md`。

## Before Coding

要求 Agent 在修改代码前：

1. 找到真实模块位置和当前调用方。
2. 找到最接近的已有页面 Pattern。
3. 检查 `src/components/ui/` 是否已有对应 primitive。
4. 检查同类组件是否已经存在多个页面组合，优先统一到 canonical 组合。
5. 记录规范与代码冲突，确认是否只是文档债务还是本次任务授权的代码修复。
6. 只在范围明确后开始编码。

## Validation

修改后运行：

```bash
npm run build
npm run lint
```

涉及 UI 时至少检查 390px、768px、1440px，验证亮色/暗色主题、语言切换、侧栏状态、菜单/弹窗行为，并确认页面无横向溢出。

所有 Agent 修改本项目代码前，必须先读取设计规范和开发规范：

```bash
cat DESIGN_SYSTEM.md
cat DEVELOPMENT_GUIDELINES.md
```

若需要分段读取，必须继续读取到文件末尾：

```bash
sed -n '1,260p' DESIGN_SYSTEM.md
sed -n '261,520p' DESIGN_SYSTEM.md
```

## 执行顺序

1. 先读取 `DESIGN_SYSTEM.md`。
2. 再读取 `DEVELOPMENT_GUIDELINES.md`。
3. 检查 `src/components/ui/` 和已安装依赖。
4. 修改 UI 前确认官方 shadcn/ui 是否已有对应组件、主题、Block 或 Chart。
5. 业务页面优先组合已有组件，不得重复实现或覆盖已有组件。
6. 修改后运行 `npm run build` 和 `npm run lint`；涉及 UI 或交互时验证桌面和手机视口，并确认无横向溢出。

## 必须遵守

- 以 `DESIGN_SYSTEM.md` 和用户最新需求为准。
- 保留 shadcn/ui 官方黑白主题、semantic tokens 和默认组件行为。
- 不自定义替代官方组件的颜色、边框、尺寸、圆角或交互。
- 不为已有功能另写一套组件或 class 体系。
- 不改变现有业务功能、路由和交互流程。
- 发现规范与代码现状冲突时，先报告证据并向用户确认。
- 新页面和新路由必须遵守 `DEVELOPMENT_GUIDELINES.md` 的命名、映射和响应式要求。
- 基于本模板创建其他项目时，按 `DEVELOPMENT_GUIDELINES.md` 的模板复用流程区分框架层与示例业务页面。
