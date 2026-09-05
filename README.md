# AgentGateway Control Plane

面向 AI Agent 基础设施的极简控制台脚手架。项目聚焦网关运行、开发调试和 Token 可观测性：

- **智能体网关（Agent Gateway / Harness）**：管理本地、沙盒和容器中的 Agent 执行器与运行实例。
- **LLM 网关（LLM Gateway / Routes）**：管理模型中转节点、优先级、健康检查与故障转移。
- **Token 统计（Token Observability / Metrics）**：观察 Token 用量、成本、延迟和调用链路。
- **调试工作台（Playground）**：验证模型选择、统一协议和流式响应。
- **访问控制（API Keys）**：管理网关调用凭据及其使用情况。
- **请求日志（Request Logs）**：查看实时吞吐、路由负载和调用事件。
- **系统设置（Settings）**：配置网关、安全、存储与流量限制。

当前版本提供完整的前端交互和规范 Mock 数据，适合作为 AI 中控后台的视觉基线和业务脚手架。后端接口通过 `src/services/http.ts` 统一封装，页面暂未默认连接真实服务。

## 开发规范入口

修改本项目前按以下顺序读取：

1. [AGENTS.md](./AGENTS.md)：Agent 执行顺序、授权边界和验证要求。
2. [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)：shadcn/ui 视觉、主题、布局、组件和响应式规范。
3. [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md)：页面命名、路由命名、组件使用和新页面开发流程。

README 只介绍项目和运行方式；具体约束以以上三份文档为准，避免重复维护产生冲突。

## 作为后台模板复用

本项目的 Nav、Sidebar、Content、主题、响应式布局和 `src/components/ui/` 是通用框架层；`src/pages/Agents.tsx`、`Routes.tsx`、`Metrics.tsx` 是当前项目的示例业务页面，不是所有衍生项目都必须保留的页面。

基于本模板创建其他项目时：

1. 先读取 [AGENTS.md](./AGENTS.md)、[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)、[DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md)。
2. 保留 UI 组件、主题 token、应用壳层、Providers、工具函数和构建配置。
3. 只保留目标项目需要的业务页面；删除示例页面时同步清理导航、路由、i18n、接口和无引用文件。
4. 新页面遵循统一 Content 边界和响应式规则，不复制旧页面 CSS。
5. 迁移后运行 `npm run build`、`npm run lint`，并检查桌面/手机视口及主题、语言、侧栏交互。

## 特性

- Vite + React 19 + TypeScript
- shadcn/ui 设计体系，Zinc 黑白主题
- `next-themes` 深色 / 浅色模式
- 中文默认、中英双语切换，语言偏好保存到 `localStorage`
- 登录页与 Nav + Sidebar + Content 的全宽响应式管理后台布局
- Recharts Token 趋势图和模型消耗排行
- Agent 实例状态表、终端日志侧滑层
- LLM 上游节点开关、添加节点 Dialog、Failover 策略展示
- 严格 TypeScript 构建检查

## 快速开始

### 环境要求

- Node.js 20 或更高版本
- npm 10 或更高版本

### 安装依赖

```bash
npm install
```

### 配置环境变量

```bash
cp .env.example .env
```

默认配置即可启动前端 Mock 展示。变量说明：

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `/api` | 后端 API 前缀或完整地址 |
| `VITE_API_TIMEOUT` | `30000` | 请求超时时间，单位毫秒 |
| `VITE_USE_MOCK` | `true` | 是否启用 Mock 兼容数据约定，预留给后端接入 |

### 启动开发环境

```bash
npm run dev
```

默认访问地址：<http://localhost:5174>

指定端口或允许局域网访问：

```bash
npm run dev -- --host 127.0.0.1 --port 4173
```

### 构建与预览

```bash
npm run build
npm run preview
```

生产构建文件输出到 `dist/`。

### 代码检查

```bash
npm run lint
```

TypeScript 单独检查：

```bash
npx tsc -b
```

## 目录结构

```text
.
├── public/                     # 不经过构建处理的静态资源
├── DESIGN_SYSTEM.md            # UI 约束、主题和布局规范
├── src/
│   ├── pages/                  # 业务页面，按一级导航拆分
│   │   ├── Agents.tsx          # Agent Gateway / Harness 管理
│   │   ├── Routes.tsx          # LLM Gateway / 上游路由管理
│   │   ├── Metrics.tsx         # Token 统计与调用审计
│   │   ├── Playground.tsx      # 模型调试工作台
│   │   ├── ApiKeys.tsx         # API 密钥管理
│   │   ├── Logs.tsx            # 请求事件流
│   │   ├── Settings.tsx        # 网关系统设置
│   │   └── Login.tsx           # 控制台登录
│   ├── services/
│   │   └── http.ts             # 统一 HTTP 请求封装
│   ├── components/ui/          # shadcn/ui 组件实现与官方 primitives
│   ├── lib/                    # cn 等基础工具函数
│   ├── App.tsx                 # 应用壳、侧边栏和页面入口切换
│   ├── App.css                 # 应用壳层和响应式布局，不承载组件皮肤
│   ├── i18n.tsx                # LanguageProvider 与中英词典
│   ├── index.css               # 全局样式入口
│   └── main.tsx                # React 应用入口
├── .env.example                # 环境变量模板
├── tests/                      # 端到端与组件测试预留目录
├── index.html                  # HTML 入口
├── package.json                # 脚本与依赖
├── tsconfig*.json              # TypeScript 配置
└── vite.config.ts              # Vite 配置
```

## 页面与交互

### Overview

总览页只呈现三大模块的关键状态：

- 活跃智能体数量和当前 Agent 类型
- LLM 网关可用率和已接入中转站数量
- 今日 Token 消耗及昨日对比
- 今日预估费用
- Agent 实时任务流
- LLM 中转节点心跳与延迟
- 启动 Agent、添加中转节点、查看 Token 账单快捷入口

### Agent Gateway

入口：侧边栏「智能体网关」。

- 展示 Claude Code CLI、Codex Terminal Runner、Python / Node Sandbox、Docker Isolated Agent
- 查看运行中 Harness 实例及 CPU / 内存占用
- 支持停止和重启实例
- 点击终端图标打开右侧实时日志 Sheet
- 当前实例数据位于页面文件顶部的 Mock 常量中

### LLM Gateway

入口：侧边栏「LLM 网关」。

- 展示 Primary、Fallback、Emergency 上游节点
- 查看脱敏 Base URL、模型映射、优先级、实时心跳延迟
- 使用开关启用或禁用节点
- 「添加中转节点」打开配置 Dialog
- Failover 策略展示 429、5xx 和超时触发条件

### Token Metrics

入口：侧边栏「Token 统计」。

- 支持 1 小时、24 小时、7 天、30 天时间范围切换
- Prompt / Completion Token 面积趋势图
- 模型消耗排行
- 最近高开销请求审计表
- 审计字段包含 Trace ID、发起 Agent、分发节点、模型、总 Token、耗时和状态

### Playground / API Keys / Request Logs / Settings

- Playground 提供模型选择、请求参数和流式响应的本地 Mock 调试界面。
- API Keys 以卡片形式展示凭据范围、调用量和最近使用时间，支持创建与撤销 Mock 密钥。
- Request Logs 展示可筛选的请求事件流、实时吞吐和各路由负载。
- Settings 提供网关端点、安全策略、数据保留和并发限制配置表单。
- 登录页使用 `agent-authenticated` 本地会话标记承载前端演示；接入后端时应替换为服务端会话或短期 Token。

## 接口封装

统一入口为 `src/services/http.ts`：

```ts
import { api } from '../services/http'

type HealthResponse = { status: 'ok'; latency: number }

const health = await api.get<HealthResponse>('/health')
const result = await api.post<{ id: string }>('/agents', {
  harness: 'claude-code',
})
```

封装行为：

- 自动读取 `VITE_API_BASE_URL`
- 默认发送 `Content-Type: application/json`
- 自动应用 `VITE_API_TIMEOUT`
- 非 2xx 响应抛出包含 `message` 和 `status` 的错误对象
- 支持泛型返回值，避免 `any`

接入真实后端时，建议按业务模块继续拆分：

```text
src/
├── services/
│   ├── http.ts                # 基础请求客户端
│   ├── agents.api.ts          # Agent Gateway 接口
│   ├── routes.api.ts          # LLM Gateway 接口
│   └── metrics.api.ts         # Token Metrics 接口
└── pages/
    ├── Agents.tsx
    ├── Routes.tsx
    └── Metrics.tsx
```

页面组件只负责展示和交互，接口请求、响应类型和错误处理放在 `services/`。当接口数量增加后，可再引入 TanStack Query 处理缓存、轮询和失效策略。

## 响应式侧栏

侧栏采用参考项目中的三态思路：桌面展开、桌面图标折叠、移动端抽屉。折叠状态保存在 `localStorage` 的 `agent-sidebar-collapsed`，移动端通过遮罩层关闭。语言和主题分别由独立 Provider / state 管理，不共享切换值，因此互不联动。

## 测试建议

参考 `satnaing/shadcn-admin` 的测试组织方式，正式接入业务接口后建议补充：

```text
tests/
├── setup.ts                 # 测试环境和 localStorage 清理
├── sidebar.test.tsx         # 折叠、展开、移动端抽屉、激活态
├── i18n.test.tsx            # 中英文切换和偏好持久化
├── overview.test.tsx        # 三类业务指标与快捷入口
├── agents.test.tsx          # 实例状态、停止、重启、日志 Sheet
├── routes.test.tsx          # 节点开关、添加节点 Dialog、Failover
├── metrics.test.tsx         # 时间范围、图表容器、审计表
└── e2e/
    └── control-plane.spec.ts # Chromium 端到端关键流程
```

推荐工具组合：Vitest + Testing Library 做组件和状态测试，Playwright 做浏览器级响应式回归。每次提交至少执行 `npm run build`、`npm run lint` 和测试命令；当前仓库尚未安装测试依赖，以上目录为接入后约定。

## 新增页面规范

新增业务模块时遵循以下边界：

1. 在 `src/pages/` 创建页面文件。
2. 在 `App.tsx` 中增加严格的 `NavId` 联合类型和菜单项。
3. 将页面文案加入 `src/i18n.tsx` 的中英文词典。
4. API 请求放入 `src/services/`，不要在页面中散落 `fetch`。
5. 遵守 [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) 的 Content 边界、间距、token 和组件约束。
6. 遵守 [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md) 的命名、路由和响应式流程。
7. 完成后运行 `npm run build` 和 `npm run lint`，并检查桌面和手机视口。

## 主题与国际化

主题使用 `next-themes`：

```tsx
<ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
  <LanguageProvider>
    <AppShell />
  </LanguageProvider>
</ThemeProvider>
```

语言使用 `useI18n`：

```tsx
const { language, setLanguage, t } = useI18n()

return <h1>{t('metrics.title')}</h1>
```

支持的语言：

- `zh-CN`：默认简体中文
- `en`：English

不要在业务页面直接写可见的固定文案；新增文案必须同时补齐中英文词条。

## shadcn/ui 约定

项目沿用 shadcn/ui 的组件思想和 Zinc 中性色体系。引入标准组件时，优先通过 shadcn CLI / 官方文档获取组件代码，并遵守 [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) 与 [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md)，不要手工改写主题变量或重复实现官方功能。

建议组件目录：

```text
src/components/ui/
├── button.tsx
├── card.tsx
├── badge.tsx
├── dialog.tsx
├── sheet.tsx
├── switch.tsx
└── table.tsx
```

当前页面中的轻量控件仍以内联结构配合统一 CSS 呈现，后续需要增加表单校验、键盘访问或复杂弹层时，再将对应控件迁移到 `components/ui/`。

## Mock 与真实后端

当前 Mock 数据直接定义在页面文件中，目的是让脚手架开箱即见完整 UI。接入后端时建议：

- 将 Mock 数据迁移到 `src/mocks/` 或独立 Mock Service Worker
- 保留页面使用的 TypeScript 类型，并让 API 响应复用这些类型
- 用轮询或 SSE 更新 Agent 状态、节点心跳和 Token 指标
- 对 429、5xx、超时统一映射到可展示的错误状态
- API Key 只存储在后端或安全的服务端配置中，不写入前端源码和 `.env` 公开变量

## 性能说明

Metrics 使用 Recharts，生产构建可能出现 JavaScript chunk 体积提示。这是优化建议，不影响构建和运行。后续页面继续扩展时，可通过动态导入 Metrics 页面进行 code splitting：

```tsx
const Metrics = lazy(() => import('./pages/Metrics'))
```

## 许可证

当前仓库未声明正式开源许可证。对外发布前，请根据实际授权策略补充 `LICENSE` 文件。
