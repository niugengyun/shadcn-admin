# Token 页面重构概览

- 仅重构 `src/pages/Metrics.tsx` 与直接相关 `src/i18n.tsx` 词条。
- 完成 Token 审计控制栏、24h/7d/30d 切换、刷新动效、四项核心指标卡、双层堆叠面积图、Agent/Model 用量排行、可筛选 Recent Token Traces 明细表。
- 保持 Zinc 黑白视觉和全宽响应式布局，使用 Recharts 与现有页面原语/样式约定。
- 已清理越界的 `App.css`、`App.tsx` 改动；当前目标代码范围仅剩 Metrics 与 i18n，另有工作日志更新。
- `npm run build` 与 `git diff --check` 通过。构建仍提示 bundle 超过 500KB 的既有体积警告，不影响构建成功。
