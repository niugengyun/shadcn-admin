# Design System

## 来源与边界

当前视觉 token 的真实来源是 `src/index.css`；组件默认外观来自 `src/components/ui/*.tsx`；应用壳层布局来自 `src/App.css`。`src/App.css` 的首行也明确声明它只负责布局，不负责 UI primitive 皮肤。

本项目使用 shadcn/ui 的组件思想和 semantic token 体系，但没有 `components.json`、shadcn CLI 配置或 `@radix-ui/themes`。因此不能把官方示例的页面宽度、间距或主题值直接复制进业务页面。

## 颜色 Token

所有业务 UI 优先使用以下 semantic token，而不是在页面中写 hex、`zinc-*`、`white` 或 `black`：

| Token | Light | Dark | 用途 |
| --- | --- | --- | --- |
| `background` | `0 0% 100%` | `240 5% 4%` | 页面和应用背景 |
| `foreground` | `240 10% 4%` | `0 0% 98%` | 主要文字 |
| `card` | `0 0% 100%` | `240 4% 8%` | Card 表面 |
| `popover` | `0 0% 100%` | `240 4% 8%` | Dropdown 等浮层 |
| `muted` | `240 5% 96%` | `240 4% 14%` | 次级背景、图标容器 |
| `muted-foreground` | `240 4% 46%` | `240 5% 65%` | 辅助文字 |
| `primary` | `240 6% 10%` | `0 0% 98%` | 主操作 |
| `secondary` | `240 5% 96%` | `240 4% 16%` | 次级操作 |
| `border` / `input` | `240 6% 90%` | `240 4% 16%` | 分隔线、边框、输入框 |
| `ring` | `240 5% 65%` | `240 5% 65%` | 键盘焦点和选中态 |
| `destructive` | `0 72% 51%` | `0 62% 45%` | 失败和破坏性操作 |
| `success` | `142 71% 45%` | `142 71% 45%` | 运行正常、成功 |
| `warning` | `38 92% 50%` | `38 92% 50%` | 空闲、降级、排队 |

Chart 专用 token 是 `chart-1` 到 `chart-5`。当前实现使用蓝、绿、黄、紫、红作为图表序列；图表不得借用 `foreground`、`muted` 或 `border` 凑色。

`@theme inline` 在 `src/index.css` 把这些变量映射为 Tailwind 类，例如 `bg-card`、`text-muted-foreground`、`border-border`、`bg-chart-1`。新增组件优先使用这些映射。

## 字体与排版

`src/index.css` 通过 Google Fonts `@import` 引入 `Space Grotesk` 和 `DM Mono`。源码没有设置全局 `font-family`，因此普通文本实际依赖浏览器/Tailwind 默认 sans；数据、URL、ID 和时间等字段在页面中显式使用 `font-mono`，App CSS 中的环形图中心值明确使用 `DM Mono`。

当前常见排版：

- 页面标题：Overview、Agents、Routes 使用 `text-3xl font-semibold tracking-tight`；Metrics 使用 `text-2xl font-bold tracking-tight`，这是当前不一致点。
- 卡片标题：多数使用 `font-semibold`，部分页面模块标题使用 `text-lg font-semibold`。
- 辅助说明：通常为 `text-xs text-muted-foreground`，页面子标题通常为 `text-sm text-muted-foreground`。
- 数据字段：优先 `font-mono`，如实例 ID、URL、Token、延迟和版本。
- 小标签：页面中大量使用 `text-xs`、`uppercase` 和 `tracking-[0.14em]`/`tracking-[0.18em]`，新增页面不要无意义复制 eyebrow。

Canonical 规则：新页面的唯一主标题使用 `h1`，并统一采用页面 Pattern 中的标题结构；不要因为页面是 Metrics 就另造一套标题字号。标题、说明和数据值的语义层级可以不同，组件基础字号不应因此分裂。

## 圆角、边框与阴影

`--radius` 在 `src/index.css` 中为 `0.625rem`。Tailwind 映射为：`--radius-sm = var(--radius) - 4px`、`--radius-md = var(--radius) - 2px`、`--radius-lg = var(--radius)`。

当前组件实际使用：

- `Card`：`rounded-xl`、`border border-border`、`bg-card`、`shadow-sm`。
- `Button`、`Input`：`rounded-md`。
- `Dialog`：`rounded-lg`、`shadow-lg`。
- `DropdownMenu`：内容 `rounded-md shadow-md`，菜单项 `rounded-sm`。
- `Badge`、`Switch`：`rounded-full`。
- Sidebar nav：使用 `var(--radius)`。

这说明项目目前既有 token 圆角，也有 Tailwind literal 圆角。新代码不得再增加第三套圆角；同一个组件的基础圆角只能由它自己的 primitive 决定。

## Spacing

当前源码已经形成以下高频节奏：

| 场景 | 当前实现 | Canonical 规则 |
| --- | --- | --- |
| 页面模块纵向节奏 | 页面根节点多为 `space-y-6` | 页面模块默认 24px；模块内部再使用 8/12/16/24px |
| Grid 卡片间距 | 多数为 `gap-4`，Agents executor 为 `gap-3` | 同一页面 Pattern 内统一；默认 `gap-4`，密集列表才使用 `gap-3` |
| 普通 Card 内边距 | 多数 `p-5` | 新增标准 Card 默认使用统一 20px inset；不要新增 `p-4` 变体 |
| Agents executor Card | `p-4` | 当前 outlier，后续代码治理需统一到 Card canonical inset |
| Card 内部字段 | `mt-1`、`mt-2`、`mt-3`、`mt-4`、`mt-5` | 依据层级使用 4/8/12/16/20px，不随页面随意增加新值 |
| Main Content | `src/App.css` 为 `padding: 2rem clamp(1rem, 4vw, 3rem)` | 由 `.main-content` 单一提供，页面根节点不得重复横向 padding |
| 手机 Main Content | `1.25rem 1rem 2rem` | 390px 起保持 16px 横向边界 |

## Card 统一规则

这是项目最重要的组件一致性约束：

1. 所有卡片都使用 `src/components/ui/card.tsx` 的 `Card`；不使用 `article`、自定义 `div` class 或页面专属 `metric-card` 来复制 Card 的表面样式。
2. `Card` 根样式统一为当前 primitive 的 `rounded-xl border border-border bg-card text-card-foreground shadow-sm`。页面组合只能增加网格列、`min-w-0`、内容间距或语义状态，不得改写根背景、边框、圆角和阴影。
3. 标准业务 Card 的内容 inset 统一采用 20px（Tailwind `p-5`）作为当前 canonical proposal。现有 Agents executor 的 `p-4` 是技术债，不应继续扩散。
4. 如果 Card 是表格容器，允许根节点不加 padding，但必须由内部 header/content/footer 组合明确提供相同的 20px inset；这属于结构例外，不是另一种 Card 皮肤。
5. 可点击 Card 必须保留统一的键盘焦点和 hover/active 规则。新的可点击卡片优先用语义 `<button>` 或 `<a>`；不要用 `role="button"` 让普通 `div` 承担新的交互，除非已有交互兼容要求。
6. 状态色只能通过 `success`、`warning`、`destructive` 或 chart token 表达，不能通过给每张卡片重新设置颜色来制造“卡片变体”。

## CSS 边界

- `src/index.css`：token、Tailwind theme 映射、基础 reset。
- `src/components/ui/`：primitive 默认外观、ARIA 和交互。
- `src/App.css`：App Shell、Top Nav、Sidebar、Main Content 和 Overview 必要布局。
- `src/pages/*.tsx`：页面组合、业务数据、网格和业务状态；不复制 primitive 皮肤。

## UI Technical Debt

| Issue | Current implementation | Affected paths | Recommendation | Priority |
| --- | --- | --- | --- | --- |
| Card 内容内边距不统一 | 普通 Card 多为 `p-5`，Agents executor 使用 `p-4` | `src/pages/Agents.tsx`、`src/pages/Metrics.tsx`、`src/pages/Routes.tsx`、`src/App.tsx` | 统一为 Card canonical inset；必要时在 primitive 中引入明确 size 变体，不用散落 class | P1 |
| Page Header 不统一 | Overview/Agents/Routes 有 eyebrow 和底部线，Metrics 没有；标题为 2xl/3xl 两套 | `src/App.tsx`、`src/pages/*.tsx` | 统一页面 Pattern；这是组合层治理，不重写主题 | P1 |
| 字体 import 依赖外部 CSS | Google Fonts 使用 `@import`，没有 fallback 设计说明 | `src/index.css` | 确认部署网络策略后决定是否自托管；本轮不改 | P2 |
| Tailwind literal 圆角与 `--radius` 并存 | Card 用 `rounded-xl`，Sidebar 用 `var(--radius)` | `src/components/ui/card.tsx`、`src/App.css` | 后续按组件逐步收敛，避免同一组件分裂 | P2 |
