# AI UI Rules

这是后续 Codex/Agent 修改本项目 UI 时的执行规范。它与根目录 `AGENTS.md`、`DESIGN_SYSTEM.md`、`DEVELOPMENT_GUIDELINES.md` 一起使用。

## 1. 唯一基础

当前项目唯一 UI 基础是现有 Vite + React + Tailwind v4 + 本地 shadcn/ui 风格 primitives + Lucide + Recharts。不得建立第二套 UI framework、theme、icon library、chart library 或 page shell。

## 2. 修改前顺序

1. 读取根目录 `AGENTS.md`、`DESIGN_SYSTEM.md`、`DEVELOPMENT_GUIDELINES.md`。
2. 读取本目录 `DESIGN_SYSTEM.md`、`LAYOUT_RULES.md`、`COMPONENT_RULES.md`、`PAGE_PATTERNS.md`。
3. 按任务追加 `CHART_RULES.md`、`ICON_RULES.md` 或 `UX_RULES.md`。
4. 在真实源码中找到页面、调用方和最近的 Pattern。
5. 搜索 `src/components/ui/` 是否已有 primitive，确认官方 shadcn/ui 是否已有对应 component/block/chart。
6. 区分本次授权的代码修改、已有技术债和需要用户确认的方案，不把推测当成授权。

## 3. 复用优先级

1. 当前页面的既有 Pattern。
2. 当前已有业务/共享组合。
3. `src/components/ui/` 中的本地 primitive。
4. 官方 shadcn/ui component/block/chart 的最小实现。
5. 基于已有 Radix primitive 的最小业务组合。
6. 只有官方和项目都没有时，才创建最小自定义组件。

新组件必须使用 `cn`、semantic tokens 和正确的 Radix ARIA/keyboard/focus 行为。

## 4. Card 一致性锁

同一个 Card 组件在所有页面必须看起来和操作起来属于同一套系统：

- 统一使用 `src/components/ui/card.tsx` 的 `Card`。
- 根背景只能是 `bg-card`，边框只能是 `border-border`，文字只能继承 `text-card-foreground`，基础圆角/阴影由 primitive 提供。
- 标准业务 Card 使用 canonical `p-5` 内容 inset；不要新建 `p-4` 卡片变体或复制 `.metric-card`/`.panel` 皮肤。
- 表格容器可以使用无根 padding 结构，但内部 header/content 必须补齐相同 inset，并在页面 Pattern 中说明。
- 同类 Card 的差异只能来自内容、网格列、min-width、状态 ring/opacity 和业务数据，不得来自另一个 background/border/radius/shadow/class 体系。
- 可点击卡片优先用语义 button/link；所有键盘 focus、hover、active 和 disabled 状态都必须保留。

当前 `p-4` 与 `p-5` 的已存差异是 P1 技术债。文档先锁定规则，代码迁移需要以具体任务授权为准。

## 5. Layout 与 Tailwind

- `.main-content` 是唯一 Content 横向边界；页面根节点不得添加横向 padding、fixed width、max-width 或 `mx-auto`。
- 使用 `min-w-0` 和 `minmax(0, 1fr)` 防止页面横向溢出。
- 页面模块默认 `space-y-6`，Grid 默认 `gap-4`；手机明确折叠为单列或自然换行。
- 不用页面级 max-width 把后台内容缩窄居中。
- 使用项目 semantic classes：`bg-background`、`text-foreground`、`bg-card`、`text-muted-foreground`、`border-border`、`bg-primary`、`bg-chart-*`。
- 不在页面散落 hex、zinc、white、black；不使用 `!important`；不以父级选择器覆盖 Button/Input/Card/Dialog/Switch 外观。
- 新页面文件使用 PascalCase，默认导出同名组件；路径使用小写 kebab-case，并同步 `App.tsx` 的 NavId、mapping、页面分支和 i18n。

## 6. Components 与行为

- Button 先用官方 variant/size，再写布局 class；显式 `type`。
- icon-only Button 使用 `size="icon"`，加 aria-label/title。
- Input、Table、Badge、Dialog、DropdownMenu、Switch 统一使用项目组件。
- Dialog、Dropdown、Switch 不手写 role/absolute/focus 逻辑。
- 图表继续使用 Recharts 和 `chart-*` token；必须有稳定 parent height。
- 新增文案同时补 `zh-CN` 和 `en`，不能在页面写长期可见的硬编码文案。

## 7. 交互状态

涉及真实数据时，明确 idle/loading/success/empty/error/retry/disabled/pending 状态。Loading 要贴合最终布局，empty/error 要放在上下文中；破坏性操作要依据既有业务流程，若需要确认/undo 等方案选择必须先说明证据并请求确认。

## 8. 禁止事项

- 不为了一个页面创建第二套 Card、Button、Table、Dialog 或 Chart 组件。
- 不重新设计 Sidebar、Top Nav、Main Content、主题、整体颜色、整体 spacing 或页面节奏。
- 不引入未安装的 form、validation、table、query、toast 或 chart library；先检查 `package.json`，需要引入时先说明安装命令和影响。
- 不删除现有路由、Mock 业务流程、i18n、主题和侧栏交互。
- 不做与当前任务无关的大范围目录重组或 UI 重构。

## 9. 验收清单

- 代码只改动授权范围，且复用了最近 Pattern 和现有 primitives。
- 同类 Card/Button/Table 在所有页面的根皮肤一致。
- 亮色/暗色主题可读，图表只使用 chart tokens。
- 390px、768px、1440px 无横向溢出；表格的横向滚动仅在允许的 wrapper 内。
- 菜单、Dialog、Switch、侧栏、语言/主题切换和浏览器前进后退可用。
- 运行 `npm run build` 和 `npm run lint`；记录 warning，不把 warning 伪装成零问题。

## 10. 需要用户确认的事项

以下事项当前存在多个合理方案，不能由 Agent 默默决定：

- 是否将现有 `p-4` Agents Card 立即迁移为 `p-5`，还是引入明确的 Card size variant。
- 是否统一四个 Page Header 的底部线、eyebrow 和标题字号。
- 是否新增官方 shadcn Chart adapter、Skeleton、Empty、Error、Label 或 Sonner。
- Agents Stop 是否需要确认/undo。
- 是否将 Mock 数据迁移到 `src/mocks/`，以及何时接入 `src/services/` 的真实 API。
