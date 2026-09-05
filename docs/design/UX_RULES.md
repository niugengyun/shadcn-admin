# UX Rules

## Current Interaction Model

当前交互主要由 React local state 和 Radix primitives 驱动：

- App Shell：`src/App.tsx` 管理 active page、Sidebar collapsed、mobile drawer、History `pushState`/`popstate`。
- Theme：`next-themes`，`ThemeProvider` 默认 dark、禁用 system theme。
- Language：`src/i18n.tsx` 自定义 Context，`localStorage` key 为 `agent-language`。
- Agents：添加实例、切换选中 executor、重启、停止、查看日志 Dialog。
- Routes：Switch enable/disable、Add Provider Dialog、表单提交。
- Metrics：时间范围切换、refresh 700ms 状态、输入过滤 Trace。

## State Inventory

| State | Current implementation | Rule |
| --- | --- | --- |
| Loading | 没有统一 loading/skeleton；Metrics refresh 仅显示旋转 RefreshCw | 异步新功能必须有与最终布局同形的 Skeleton 或 pending state |
| Empty | 没有统一 empty；过滤无结果时 Table Body 为空 | 必须提供明确 empty row/empty composition，不能静默空白 |
| Error | `src/services/http.ts` 抛出 `{message,status}`，页面没有展示 error boundary/inline error | API 页面必须展示可定位错误并提供 retry；不要只 console.log |
| Success | status Badge、绿色状态点、Dialog 提交后关闭 | 成功状态保留文字语义，不只依赖颜色 |
| Toast/Notification | 未安装、未实现 | Missing unified pattern；新增需求前确认是否引入 shadcn Sonner/Toast |
| Dialog | Radix Dialog adapter，用于 Agents logs、Routes add | 保留 Portal、Overlay、Escape、focus；新增复杂 Dialog 需补 title/description |
| Dropdown | Radix DropdownMenu，用于用户菜单 | 不手写 absolute menu |
| Sheet/Drawer | 名称在 README 中描述日志侧滑层，但当前源码实际使用 Dialog，App mobile sidebar 是 CSS fixed drawer | 文档以源码为准；若要 Sheet 行为先确认范围 |
| Form validation | Routes 仅 `trim()` 后阻止空 name/url，没有 Label/error text/validation library | 新增校验需先决定是否引入 form/validation library；当前不要假设已有 |
| Disabled | Button primitive 支持 disabled；Routes provider 用 `opacity-60` 表达 disabled Card，Switch 仍可用 | disabled 应作用于实际控件，不要仅视觉降 opacity |
| Pending | Metrics refresh `refreshing` 700ms | 真实 async pending 必须锁定重复提交并反馈状态 |
| Retry/Refresh | Metrics 只有 mock refresh；HTTP 无 retry | 新 API 接入时设计 retry policy，不能把 setTimeout 当真实请求状态 |
| Destructive | Agents Stop 直接从数组移除，没有确认或 undo | 破坏性操作是否确认需要产品决定；当前记录为风险，不本轮自行改变行为 |

## Accessibility Rules

- Button 必须有正确 type。
- icon-only Button 必须有 aria-label/title。
- Dialog/Dropdown/Switch 继续使用 Radix adapter 的键盘和焦点逻辑。
- 选中 executor 的视觉 `ring` 不能成为唯一状态，应有可访问选择语义。
- 状态文字和状态点一起使用，不能只用红/绿颜色。
- 输入框有可见 label 或清晰 aria-label；新增字段优先补齐 Label primitive。

## Async UX Canonical Flow

新增真实 API 页面按此顺序表达状态：idle -> loading/pending -> success 或 empty -> error/retry。Loading 不应改变最终布局尺寸；error 和 empty 放在对应 Card/Table/Chart 上下文中；toast 只用于短暂、非阻塞反馈。

## UX Technical Debt

- 缺少全局 Toast/Notification 方案。Priority P1，需用户确认是否引入官方 Sonner/Toast 后才能开发。
- 缺少统一 Skeleton、Empty、Error 组件和页面状态模型。Priority P1。
- Agents Stop 的删除行为没有确认，且文案与 `src/i18n.tsx` 不是完整统一。Priority P1。
- Dialog adapter 缺少标题/描述 helper，当前使用 `aria-label` 代替完整 dialog heading。Priority P1。
- i18n Provider 直接把 localStorage 值 cast 为 Language，没有运行时校验。Priority P2。
