# 三大网关页面实现概览

- 实现 `src/pages/Agents.tsx`：Agent 矩阵单选、运行实例管理、状态徽章、日志抽屉、启动/停止/重启交互；实例表已统一复用项目 `ui/Table` 原语。
- 实现 `src/pages/Routes.tsx`：LiteLLM 状态与 KPI、中转站卡片、健康状态/启停切换、故障转移策略、添加中转站 Dialog。
- 重构 `src/pages/Metrics.tsx`：Token 指标卡、固定 `h-[280px]` Recharts 趋势/排行图、筛选交互、Table + Badge 明细流。
- 页面沿用中文 i18n 调用、全宽 Zinc 暗色设计、等宽数据字段与现有 UI 组件。
- 验证：`npx tsc -b` 通过，`npx vite build --outDir /tmp/shadcn-admin-dist` 通过，`git diff --check` 通过。Vite 仅提示单 chunk 超过 500KB，不影响构建产物。
- 说明：工作区原有的 `DESIGN_SYSTEM.md`、`src/App.css`、`.workbuddy/memory/2026-09-04.md` 与 `src/components/` 变更均保留，未做无关回退。
