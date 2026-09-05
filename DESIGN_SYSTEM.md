# UI 设计规范

本项目默认以官方 shadcn/ui 为视觉和交互基准。没有明确设计稿时，业务代码只组合官方组件和提供数据，不重新发明视觉系统。若用户提供截图、设计图、参考站点并明确要求 1:1，则以该参考稿的布局、层级、密度和视觉结果为验收标准；同时优先复用 shadcn/ui 组件承载交互，只在参考稿确实需要时增加页面组合层样式，不得无依据另造一套设计系统。

## 1. 页面整体框架

所有管理页面使用统一的三层结构：

1. 顶部 Nav：全宽，固定在应用顶部布局行；包含品牌、侧栏折叠按钮、搜索、语言/主题、用户菜单。
2. Sidebar：桌面端位于左侧，宽度由应用壳层控制；只放主导航和底部状态。
3. Content：占据剩余空间，min-width: 0，内容随视口伸缩，不使用页面级固定最大宽度。

页面内容统一排版：
- main-content
- header：h1 页面标题，p 页面子标题
- section：页面模块

- 右侧内容区顶部、左侧、右侧使用同一套响应式内边距：桌面约 32px，宽屏最大 48px；手机 16px。
- 横向间距只有一个来源：由应用壳层的 `.main-content` 统一提供。当前约定为桌面 `clamp(1rem, 4vw, 3rem)`，手机 `1rem`；页面根节点不得再次添加 `px-*`、`padding-inline`、`mx-auto` 或固定宽度来改变 Content 边界。
- 顶部 Nav 的右侧操作区必须使用与 `.main-content` 相同的右侧边界；用户菜单的右边缘必须和页面内容模块的右边缘对齐。新增页面不得自行决定另一套左右边距。
- 页面标题区与第一个模块之间使用 24px。
- 页面模块之间使用 16px；模块内部常用间距使用 8px、12px、16px、24px。
- 页面不得使用 max-width 把内容缩窄后居中；需要限制单个阅读模块时，只在该模块内部限制。
- 页面不得产生横向溢出；网格使用 minmax(0, 1fr)，长文本使用截断或换行。
- 桌面布局使用 CSS Grid/Flex；手机端在 640px 附近折叠侧栏，模块改为单列，操作区允许换行。
- 顶部 Nav、Sidebar 和 Content 的边界必须对齐；禁止单独给顶部或内容设置另一套宽度。

## 2. 主题和颜色

- 参考稿 1:1 优先级高于默认示例外观，但必须先区分“设计要求”与“组件实现”：可以还原设计稿要求的布局和视觉层级，不能因为页面需要 1:1 就重写官方组件的可访问性、键盘行为和公开 API。

- 只使用 bg-background、text-foreground、bg-card、text-card-foreground、bg-muted、text-muted-foreground、bg-primary、text-primary-foreground、border-border、border-input、ring-ring。
- 保留官方 :root / .dark semantic tokens：background、foreground、card、popover、primary、secondary、muted、accent、destructive、border、input、ring、chart-1 到 chart-5、sidebar-*。
- 图表颜色只能来自 chart-1 至 chart-5；禁止用 foreground、muted、border 凑灰色图表。
- 禁止页面散落 hex、zinc、白色边框、黑色背景和自定义色盘。状态颜色使用 semantic success/warning/destructive。
- 不得用全局规则把边框颜色变成 currentColor；所有边框显式使用 border-border 或组件自身的官方变体。

## 3. 官方组件优先

开发前先检查 src/components/ui/、已安装依赖和官方文档。优先使用官方组件及官方组合：

- Button：使用 variant（default、secondary、outline、ghost、link、destructive）和 size（default、sm、lg、icon）。
- Card：使用 Card、CardHeader、CardTitle、CardDescription、CardContent；页面不再用 article 伪装 Card。
- Input/Textarea/Select/Checkbox/Radio/Label：使用对应官方组件，不手写同类控件。
- Table/Data Table：使用 Table 组合；表格外层处理响应式滚动。
- Dialog/Alert Dialog/Sheet/Drawer：使用官方 primitive；必须保留焦点、Escape、遮罩和无障碍行为。
- Dropdown Menu/Context Menu/Menubar/Navigation Menu：使用官方菜单组合，不手写 absolute 菜单。
- Switch/Checkbox/Toggle/Toggle Group：使用官方状态组件和标准事件 API。
- Tabs、Accordion、Popover、Tooltip、Toast、Sonner、Command、Combobox、Calendar、Date Picker、Pagination、Breadcrumb、Avatar、Badge、Skeleton、Progress、Slider、Scroll Area、Resizable、Sidebar、Chart：新增需求优先采用官方组件或官方 Block。
- 官方已有的功能、Block 和 Chart 不得用自写逻辑替代。

项目内自定义组件只有在官方没有对应组件时才允许新增；新增组件必须复用 cn、semantic tokens、官方 primitive，并遵循官方 ARIA、键盘和焦点行为。不能为了改颜色、边框、圆角或尺寸而复制官方组件。

## 4. CSS 边界

- src/index.css 只放 token、Tailwind theme 映射和全局基础 reset。
- src/components/ui/*.tsx 负责组件自身默认外观和交互。
- src/App.css 只负责应用壳层、响应式布局和无法由 Tailwind 表达的页面布局；不得重写 UI 组件外观。
- 页面 JSX 的 class 只负责组合、网格、间距和状态，不重复写 Card/Button 的默认 background、border、radius、shadow、height、width。
- 禁止父级选择器覆盖 button、input、card、switch、dropdown、dialog 等组件。
- 禁止使用 !important 修复组件冲突；先删除冲突规则，再调整组件变体或 token。
- 不创建同义 class（例如 primary-button、metric-card 去复制 Button/Card 外观）。页面专属布局 class 必须有明确布局用途。
- UI 组件统一通过 cn 合并 class，变体统一使用 class-variance-authority。

## 5. 交互、可访问性和功能保护

- Button 必须声明 type=button 或 type=submit。
- Icon-only Button 必须有 aria-label 和 title。
- Dialog、DropdownMenu、Sheet、Popover 等必须使用官方焦点和键盘行为。
- 状态控件使用 checked / onCheckedChange 等标准 API，不用页面自定义 role 模拟。
- 语言切换、主题切换、头像菜单、侧栏折叠必须保留既有功能。
- 不删除既有业务流程、路由、数据和交互；只改变明确授权的 UI 实现。
- 页面可见文案统一走 i18n，新增文案同时补中文和英文。

## 6. 常见失败模式

- 颜色全部变灰：通常是错误复用 foreground、muted 或 border 作为图表颜色；图表必须使用 chart tokens。
- 出现白色边框：通常是 border 回退到 currentColor；边框必须绑定 border token，选中态也不能用 foreground 冒充边框。
- 页面样式互相覆盖：通常是 App.css 同时承担布局和组件皮肤；布局与组件皮肤必须分层。
- 大屏内容过窄或两侧空白：通常是页面级 max-width 居中；管理后台 Content 默认使用剩余宽度。
- 手机端横向滚动：通常是固定宽度、缺少 min-width: 0 或网格列未使用 minmax(0, 1fr)。
- 卡片内部出现错误色块：通常是把整条 Button 当作卡片链接；应根据设计稿决定整卡可点击或使用低强调 link。
- 菜单、弹窗、Switch 行为异常：通常是手写 role 和 absolute 定位；优先采用官方 primitive。
- 页面标题层级混乱：统一使用标题和子标题，避免无意义的面包屑、路由标签和重复小标题。
- 参考截图要求 1:1 时，不得被默认示例限制；应还原参考稿的布局和视觉，同时保留官方组件的行为、无障碍和响应式能力。

## 7. 提交前检查

运行 npm run build 和 npm run lint。涉及 UI 时还要检查桌面和手机视口：页面无横向滚动，标题层级统一，左右边距一致，按钮变体正确，菜单/弹窗可用，暗色和亮色主题均无白色异常边框。
