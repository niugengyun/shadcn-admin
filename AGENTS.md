# Agent 开发约束

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
